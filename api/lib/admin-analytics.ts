import type { VercelRequest } from '@vercel/node';
// @ts-expect-error Shared JS aggregate from WeWeb admin workflow export
import { aggregateAnalytics } from './admin-analytics-aggregate.mjs';
// @ts-expect-error Shared JS tracking layer (216 estimated note views)
import { addTracking } from './admin-analytics-add-tracking.mjs';
import { bridgingServiceClient, currentUser, presentRow, readBody } from './bridging.js';

type Row = Record<string, unknown>;

function mapRows(rows: Row[] | null | undefined): Row[] {
  return (rows ?? []).map((row) => presentRow(row));
}

function readParameters(body: Record<string, unknown>): Record<string, unknown> {
  const nested = body.parameters;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }
  return {
    range: body.range ?? body.preset ?? 'custom',
    start: body.start ?? '2026-07-23',
    end: body.end ?? '',
  };
}

const ADMIN_EMAIL = '3lijahzhou@gmail.com';

function isAllowlistedAdminEmail(email?: string | null): boolean {
  return String(email ?? '').trim().toLowerCase() === ADMIN_EMAIL;
}

export async function requireAdmin(req: VercelRequest): Promise<boolean> {
  const session = await currentUser(req);
  if (!session) return false;
  return isAllowlistedAdminEmail(session.user.email);
}

export async function buildAdminAnalyticsPayload(
  parameters: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const db = bridgingServiceClient();

  const [usersRes, attemptsRes, questionsRes, topicsRes, settingsRes, eventsRes] = await Promise.all([
    db.from('all_users').select('id,email,auth_user_id,first_seen_at,created_at').limit(10000),
    db.from('attempts').select('id,user_id,created_at,is_correct,question_id').limit(20000),
    db.from('questions').select('id,prompt,topic_id').limit(5000),
    db.from('topics').select('id,code,name').limit(500),
    db.from('user_settings').select('level,school,user_id,exam_track').limit(10000),
    db.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(50000),
  ]);

  const errors = [
    usersRes.error,
    attemptsRes.error,
    questionsRes.error,
    topicsRes.error,
    settingsRes.error,
    eventsRes.error,
  ].filter(Boolean);
  if (errors.length) {
    throw new Error(errors[0]?.message ?? 'Failed to load admin analytics data');
  }

  const users = mapRows(
    (usersRes.data as Row[]).map((row) => ({
      ...row,
      user_id: row.auth_user_id ?? row.id,
      created_at: row.first_seen_at ?? row.created_at,
    })),
  );

  const context = {
    parameters,
    workflow: {
      FETCH_USERS: { result: { data: users } },
      FETCH_ATTEMPTS: { result: { data: mapRows(attemptsRes.data as Row[]) } },
      FETCH_QUESTIONS: { result: { data: mapRows(questionsRes.data as Row[]) } },
      FETCH_TOPICS: { result: { data: mapRows(topicsRes.data as Row[]) } },
      FETCH_SETTINGS: { result: { data: mapRows(settingsRes.data as Row[]) } },
      FETCH_EVENTS: { result: { data: mapRows(eventsRes.data as Row[]) } },
      AGGREGATE: { result: {} },
    },
  };

  const aggregated = aggregateAnalytics(context) as Record<string, unknown>;
  const events = mapRows(eventsRes.data as Row[]);
  const topics = mapRows(topicsRes.data as Row[]);
  return addTracking(aggregated, events, topics) as Record<string, unknown>;
}

export async function handleAdminAnalytics(req: VercelRequest): Promise<Record<string, unknown>> {
  const parameters = readParameters(readBody(req));
  return buildAdminAnalyticsPayload(parameters);
}
