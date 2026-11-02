import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleAdminAnalytics, requireAdmin } from './admin-analytics.js';
import {
  bridgingClient,
  currentUser,
  loadView,
  presentRow,
  readBody,
  recordAllUser,
  sendJson,
  tablePayload,
} from './bridging.js';

const SETTINGS_FIELDS = [
  'full_name',
  'avatar_url',
  'school',
  'level',
  'exam_track',
  'notification_daily_reminder',
  'notification_streak_alert',
  'notification_weekly_summary',
  'notification_announcements',
  'preferred_difficulty',
  'priority_topics',
  'daily_question_goal',
  'past_exam_results',
] as const;

async function saveAttempt(req: VercelRequest, res: VercelResponse): Promise<void> {
  const session = await currentUser(req);
  if (!session) {
    sendJson(res, 401, { error: 'Sign in required' });
    return;
  }
  const row = tablePayload(readBody(req), 'attempts');
  const db = bridgingClient(session.token);
  const { data, error } = await db
    .from('attempts')
    .insert({
      user_id: session.user.id,
      question_id: row.question_id ?? null,
      student_answer: row.student_answer ?? null,
      normalized_submitted_answer: row.normalized_submitted_answer ?? null,
      is_correct: row.is_correct ?? null,
      status: row.status ?? null,
      marking_method: row.marking_method ?? null,
      ai_analysis: row.ai_analysis ?? null,
      attempt_number: row.attempt_number ?? null,
      time_spent_seconds: row.time_spent_seconds ?? null,
    })
    .select('*')
    .maybeSingle();
  if (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  sendJson(res, 200, presentRow((data ?? {}) as Record<string, unknown>));
}

async function saveSettings(req: VercelRequest, res: VercelResponse): Promise<void> {
  const session = await currentUser(req);
  if (!session) {
    sendJson(res, 401, { error: 'Sign in required' });
    return;
  }
  const incoming = tablePayload(readBody(req), 'user_settings');
  const patch: Record<string, unknown> = { user_id: session.user.id, updated_at: new Date().toISOString() };
  for (const field of SETTINGS_FIELDS) {
    if (incoming[field] !== undefined) patch[field] = incoming[field];
  }
  const db = bridgingClient(session.token);
  const { data, error } = await db.from('user_settings').upsert(patch, { onConflict: 'user_id' }).select('*').maybeSingle();
  if (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  sendJson(res, 200, presentRow((data ?? patch) as Record<string, unknown>));
}

async function ensureSettings(req: VercelRequest, res: VercelResponse): Promise<void> {
  const session = await currentUser(req);
  if (!session) {
    sendJson(res, 401, { error: 'Sign in required' });
    return;
  }
  const db = bridgingClient(session.token);
  const existing = await db.from('user_settings').select('*').eq('user_id', session.user.id).maybeSingle();
  if (existing.data) {
    sendJson(res, 200, presentRow(existing.data as Record<string, unknown>));
    return;
  }
  const created = {
    user_id: session.user.id,
    full_name: String(session.user.user_metadata?.name ?? session.user.email ?? ''),
    notification_daily_reminder: true,
    notification_streak_alert: true,
    notification_announcements: true,
  };
  const { data, error } = await db.from('user_settings').insert(created).select('*').maybeSingle();
  if (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  await db.from('registered_users').upsert(
    { user_id: session.user.id, email: session.user.email ?? null },
    { onConflict: 'user_id' },
  );
  try {
    await recordAllUser(session.user);
  } catch {
    /* all_users is best-effort */
  }
  sendJson(res, 200, presentRow((data ?? created) as Record<string, unknown>));
}

async function resetProgress(req: VercelRequest, res: VercelResponse): Promise<void> {
  const session = await currentUser(req);
  if (!session) {
    sendJson(res, 401, { error: 'Sign in required' });
    return;
  }
  const { error } = await bridgingClient(session.token).from('attempts').delete().eq('user_id', session.user.id);
  if (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  sendJson(res, 200, { ok: true });
}

async function deleteAccount(req: VercelRequest, res: VercelResponse): Promise<void> {
  const session = await currentUser(req);
  if (!session) {
    sendJson(res, 401, { error: 'Sign in required' });
    return;
  }
  const db = bridgingClient(session.token);
  for (const table of ['he_saved_items', 'attempts', 'mock_tests', 'analytics_events', 'user_settings', 'registered_users']) {
    const { error } = await db.from(table).delete().eq('user_id', session.user.id);
    if (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
  }
  sendJson(res, 200, { ok: true });
}

function heItemKey(row: { itemType?: string; kind?: string; institution?: string; course?: string; code?: string }): string {
  return [row.itemType || 'course', row.kind || '', row.institution || '', row.course || '', row.code || ''].join('|');
}

async function handleHeSaves(req: VercelRequest, res: VercelResponse): Promise<void> {
  const session = await currentUser(req);
  if (!session) {
    sendJson(res, 401, { error: 'Sign in required' });
    return;
  }
  const db = bridgingClient(session.token);
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('he_saved_items')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
    sendJson(res, 200, { items: data ?? [] });
    return;
  }
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }
  const body = readBody(req);
  const itemType = String(body.itemType ?? body.item_type ?? 'course') === 'school' ? 'school' : 'course';
  const kind = String(body.kind ?? '').trim();
  const institution = String(body.institution ?? '').trim();
  const course = String(body.course ?? '').trim();
  const code = String(body.code ?? '').trim();
  const key = heItemKey({ itemType, kind, institution, course, code });
  const op = String(body.op ?? 'add');
  if (!institution || (itemType === 'course' && !course)) {
    sendJson(res, 400, { error: 'Missing school or course' });
    return;
  }
  if (op === 'remove') {
    const { error } = await db.from('he_saved_items').delete().eq('user_id', session.user.id).eq('item_key', key);
    if (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
    sendJson(res, 200, { ok: true, removed: true });
    return;
  }
  const { error } = await db.from('he_saved_items').upsert(
    {
      user_id: session.user.id,
      item_type: itemType,
      kind: kind || null,
      institution,
      course,
      code,
      item_key: key,
    },
    { onConflict: 'user_id,item_key' },
  );
  if (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  sendJson(res, 200, { ok: true, saved: true });
}

async function saveMock(req: VercelRequest, res: VercelResponse): Promise<void> {
  const session = await currentUser(req);
  if (!session) {
    sendJson(res, 401, { error: 'Sign in required' });
    return;
  }
  const row = tablePayload(readBody(req), 'mock_tests');
  const { data, error } = await bridgingClient(session.token)
    .from('mock_tests')
    .insert({
      user_id: session.user.id,
      title: row.title ?? null,
      topic_ids: row.topic_ids ?? null,
      question_ids: row.question_ids ?? null,
      total_questions: row.total_questions ?? null,
      correct_count: row.correct_count ?? null,
      score_percent: row.score_percent ?? null,
      results: row.results ?? null,
    })
    .select('*')
    .maybeSingle();
  if (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  sendJson(res, 200, presentRow((data ?? {}) as Record<string, unknown>));
}

async function recordEvent(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = readBody(req);
  const session = await currentUser(req);
  const topicId = String(body.topicId ?? body.topic_id ?? '').trim();
  const noteId = String(body.noteId ?? body.note_id ?? '').trim();
  const { error } = await bridgingClient(session?.token).from('analytics_events').insert({
    user_id: session?.user.id ?? null,
    event_type: String(body.eventType ?? body.event_type ?? 'page_view'),
    page_path: String(body.pagePath ?? body.page_path ?? '/'),
    topic_id: topicId || null,
    note_id: noteId || null,
    utm_source: String(body.utmSource ?? body.utm_source ?? '') || null,
    utm_medium: String(body.utmMedium ?? body.utm_medium ?? '') || null,
    utm_campaign: String(body.utmCampaign ?? body.utm_campaign ?? '') || null,
    referrer_host: String(body.referrerHost ?? body.referrer_host ?? '') || null,
    device_type: String(body.deviceType ?? body.device_type ?? '') || null,
    browser_language: String(body.browserLanguage ?? body.browser_language ?? '') || null,
  });
  if (error) {
    sendJson(res, 400, { ok: false, error: error.message });
    return;
  }
  sendJson(res, 200, { ok: true });
}

export async function handleBridge(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const kind = String(req.query.kind ?? '');
  const action = String(req.query.action ?? '');
  const id = String(req.query.id ?? '');

  try {
    if (kind === 'view') {
      sendJson(res, 200, await loadView(req, id));
      return;
    }
    if (kind === 'workflow') {
      if (id.startsWith('350350b2')) {
        await saveAttempt(req, res);
        return;
      }
      sendJson(res, 200, { ok: true });
      return;
    }
    if (kind === 'account' && action === 'saves') {
      await handleHeSaves(req, res);
      return;
    }
    if (kind === 'account' && action === 'settings') {
      await saveSettings(req, res);
      return;
    }
    if (kind === 'account' && action === 'ensure-settings') {
      await ensureSettings(req, res);
      return;
    }
    if (kind === 'account' && action === 'reset-progress') {
      await resetProgress(req, res);
      return;
    }
    if (kind === 'account' && action === 'delete') {
      await deleteAccount(req, res);
      return;
    }
    if (kind === 'mock') {
      await saveMock(req, res);
      return;
    }
    if (kind === 'analytics') {
      await recordEvent(req, res);
      return;
    }
    if (kind === 'admin' && action === 'analytics') {
      if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }
      if (!(await requireAdmin(req))) {
        sendJson(res, 403, { error: 'Admin access required' });
        return;
      }
      const payload = await handleAdminAnalytics(req);
      sendJson(res, 200, payload);
      return;
    }
    sendJson(res, 200, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed';
    sendJson(res, 500, { error: message });
  }
}
