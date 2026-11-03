import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type User } from '@supabase/supabase-js';

const SESSION_COOKIE = 'better-auth.session_token';
const ADMIN_EMAIL = '3lijahzhou@gmail.com';

export const TABLE_VIEWS: Record<string, { table: string; scope: 'public' | 'user' | 'admin'; order: string }> = {
  '2e7e24ea-7339-4bca-954a-24f38b47379d': { table: 'topics', scope: 'public', order: 'code' },
  '34ff8d97-be2e-423a-9ada-8749a59a7742': { table: 'questions', scope: 'public', order: 'created_at' },
  '7d4719cb-9d6a-48ce-9a85-4bf524fabe90': { table: 'notes', scope: 'public', order: 'order_index' },
  'daa3142c-6fa2-4985-acb7-2ac36dcfc0a4': { table: 'attempts', scope: 'user', order: 'created_at' },
  '59455056-9b75-45c2-bdef-9a45e17bd34a': { table: 'mock_tests', scope: 'user', order: 'created_at' },
  'e35cda4a-0218-44ea-80bd-4873baf9cd84': { table: 'user_settings', scope: 'user', order: 'updated_at' },
  '274caa49-e1e3-408e-9520-6111b378ac61': { table: 'all_users', scope: 'admin', order: 'first_seen_at' },
};

function isAllowlistedAdminEmail(email?: string | null): boolean {
  return String(email ?? '').trim().toLowerCase() === ADMIN_EMAIL;
}

export function sendJson(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function readBody(req: VercelRequest): Record<string, unknown> {
  const raw = req.body;
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
}

function readCookies(req: VercelRequest): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    out[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim());
  }
  return out;
}

export function accessToken(req: VercelRequest): string | null {
  const auth = req.headers.authorization;
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return readCookies(req)[SESSION_COOKIE] || null;
}

export function supabaseEnv(): { url: string; key: string } {
  const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '').trim();
  const key = (process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? '').trim();
  if (!url || !key) throw new Error('Supabase env not configured');
  return { url, key };
}

export function bridgingClient(token?: string | null) {
  const { url, key } = supabaseEnv();
  return createClient(url, key, {
    db: { schema: 'bridging' },
    auth: { persistSession: false, autoRefreshToken: false },
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
}

export function bridgingServiceClient() {
  const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
  if (!url || !key) throw new Error('Supabase service role not configured');
  return createClient(url, key, {
    db: { schema: 'bridging' },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function recordAllUser(user: {
  id?: string | null;
  email?: string | null;
  created_at?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): Promise<void> {
  const email = String(user.email ?? '').trim().toLowerCase();
  if (!email) return;
  const meta = user.user_metadata ?? {};
  const display =
    String(meta.full_name ?? meta.name ?? '')
      .trim() || email.split('@')[0];
  const db = bridgingServiceClient();
  const existing = await db.from('all_users').select('sources,display_name,auth_user_id,first_seen_at').eq('email', email).maybeSingle();
  const sources = Array.from(new Set([...(existing.data?.sources ?? []), 'auth']));
  await db.from('all_users').upsert(
    {
      email,
      display_name: existing.data?.display_name || display,
      auth_user_id: user.id ?? existing.data?.auth_user_id ?? null,
      sources,
      first_seen_at: existing.data?.first_seen_at ?? user.created_at ?? new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: 'email' },
  );
}

export async function currentUser(req: VercelRequest): Promise<{ token: string; user: User } | null> {
  const token = accessToken(req);
  if (!token) return null;
  const { url, key } = supabaseEnv();
  const auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await auth.auth.getUser(token);
  if (error || !data.user) return null;
  return { token, user: data.user };
}

export function presentRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...row };
  if (row.created_at != null) out.createdAt = row.created_at;
  if (row.updated_at != null) out.updatedAt = row.updated_at;
  if (out.id == null && row.user_id != null) out.id = row.user_id;
  return out;
}

export function tablePayload(body: Record<string, unknown>, table: string): Record<string, unknown> {
  const keyed = body[`table:${table}`] ?? body[table] ?? body.rowData;
  if (keyed && typeof keyed === 'object' && !Array.isArray(keyed)) return { ...(keyed as Record<string, unknown>) };
  return { ...body };
}

export async function loadView(req: VercelRequest, viewId: string) {
  const view = TABLE_VIEWS[viewId];
  if (!view) return { data: [], metadata: { total: 0, offset: 0, limit: 0 } };

  const session = view.scope === 'user' || view.scope === 'admin' ? await currentUser(req) : null;
  if (view.scope === 'user' && !session) return { data: [], metadata: { total: 0, offset: 0, limit: 0 } };
  if (view.scope === 'admin' && (!session || !isAllowlistedAdminEmail(session.user.email))) {
    return { data: [], metadata: { total: 0, offset: 0, limit: 0 } };
  }

  const db = view.scope === 'admin' ? bridgingServiceClient() : bridgingClient(session?.token);
  const newestFirst = view.table === 'attempts' || view.table === 'mock_tests';
  let query = db.from(view.table).select('*').order(view.order, { ascending: !newestFirst });
  if (view.scope === 'user' && session) query = query.eq('user_id', session.user.id);
  const { data, error } = await query.limit(2000);
  if (error) throw new Error(error.message);

  const rows = (data ?? []).map((row) => {
    const raw = row as Record<string, unknown>;
    const out = presentRow(raw);
    if (view.table === 'all_users') {
      out.user_id = raw.auth_user_id ?? raw.id;
      if (raw.first_seen_at != null) out.createdAt = raw.first_seen_at;
    }
    return out;
  });
  const offset = Number(req.query.offset ?? 0) || 0;
  const requested = Number(req.query.limit ?? 0) || 0;
  const page = requested > 0 ? rows.slice(offset, offset + requested) : rows.slice(offset);
  return { data: page, metadata: { total: rows.length, offset, limit: requested || rows.length } };
}
