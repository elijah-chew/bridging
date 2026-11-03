export function aggregateAnalytics(context) {
const users = context.workflow['FETCH_USERS'].result?.data || [];
const attempts = context.workflow['FETCH_ATTEMPTS'].result?.data || [];
const questions = context.workflow['FETCH_QUESTIONS'].result?.data || [];
const topics = context.workflow['FETCH_TOPICS'].result?.data || [];
const settings = context.workflow['FETCH_SETTINGS'].result?.data || [];

const preset = String(context.parameters['range'] || 'custom').toLowerCase();
const customStart = String(context.parameters['start'] || '').trim();
const customEnd = String(context.parameters['end'] || '').trim();
const LAUNCH_START = '2026-07-23';

function toDateKey(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function startOfUtcDay(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDays(d, n) {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

const now = new Date();
const todayStart = startOfUtcDay(now);
let rangeStart = startOfUtcDay(new Date(LAUNCH_START + 'T00:00:00.000Z'));
let rangeEnd = addDays(todayStart, 1);

if (preset === 'today') {
  rangeStart = todayStart;
} else if (preset === '7d') {
  rangeStart = addDays(todayStart, -6);
} else if (preset === '30d') {
  rangeStart = addDays(todayStart, -29);
} else if (preset === 'all') {
  rangeStart = new Date('1970-01-01T00:00:00.000Z');
} else if (preset === 'custom') {
  if (customStart) {
    rangeStart = startOfUtcDay(new Date(customStart + 'T00:00:00.000Z'));
  }
  if (customEnd) {
    rangeEnd = addDays(startOfUtcDay(new Date(customEnd + 'T00:00:00.000Z')), 1);
  } else {
    rangeEnd = addDays(todayStart, 1);
  }
}

function inRange(dateValue) {
  const t = new Date(dateValue).getTime();
  return !isNaN(t) && t >= rangeStart.getTime() && t < rangeEnd.getTime();
}

function inLastDays(dateValue, days) {
  const start = addDays(todayStart, -(days - 1));
  const t = new Date(dateValue).getTime();
  return !isNaN(t) && t >= start.getTime() && t < addDays(todayStart, 1).getTime();
}

const questionById = {};
for (let i = 0; i < questions.length; i++) questionById[questions[i].id] = questions[i];
const topicById = {};
for (let j = 0; j < topics.length; j++) topicById[topics[j].id] = topics[j];

const totalUsers = users.length;
const activeTodaySet = {};
const activeWeekSet = {};
const activeMonthSet = {};
const activeRangeSet = {};
const usersWithAttempts = {};
const attemptsInRange = [];

for (let a = 0; a < attempts.length; a++) {
  const row = attempts[a];
  const uid = row.user_id;
  if (uid) usersWithAttempts[uid] = true;
  if (inLastDays(row.createdAt, 1) && uid) activeTodaySet[uid] = true;
  if (inLastDays(row.createdAt, 7) && uid) activeWeekSet[uid] = true;
  if (inLastDays(row.createdAt, 30) && uid) activeMonthSet[uid] = true;
  if (inRange(row.createdAt)) {
    attemptsInRange.push(row);
    if (uid) activeRangeSet[uid] = true;
  }
}

let signupsToday = 0;
let signupsWeek = 0;
let signupsMonth = 0;
const signupsByDay = {};
for (let s = 0; s < users.length; s++) {
  const created = users[s].createdAt;
  if (inLastDays(created, 1)) signupsToday++;
  if (inLastDays(created, 7)) signupsWeek++;
  if (inLastDays(created, 30)) signupsMonth++;
  const key = toDateKey(created);
  if (key) signupsByDay[key] = (signupsByDay[key] || 0) + 1;
}

const seriesLabels = [];
const signupsSeries = [];
const cumulativeSeries = [];
let cursor = new Date(rangeStart.getTime());
const endExclusive = new Date(rangeEnd.getTime());
const maxSeriesDays = Math.min(400, Math.max(1, Math.ceil((endExclusive.getTime() - rangeStart.getTime()) / 86400000) + 1));
let safety = 0;
while (cursor < endExclusive && safety < maxSeriesDays) {
  seriesLabels.push(toDateKey(cursor));
  signupsSeries.push(signupsByDay[toDateKey(cursor)] || 0);
  cursor = addDays(cursor, 1);
  safety++;
}

const sortedSignupKeys = Object.keys(signupsByDay).sort();
let running = 0;
const cumByDay = {};
for (let c = 0; c < sortedSignupKeys.length; c++) {
  running += signupsByDay[sortedSignupKeys[c]];
  cumByDay[sortedSignupKeys[c]] = running;
}
let lastCum = 0;
for (let l = 0; l < seriesLabels.length; l++) {
  if (cumByDay[seriesLabels[l]] !== undefined) lastCum = cumByDay[seriesLabels[l]];
  else {
    for (let k = sortedSignupKeys.length - 1; k >= 0; k--) {
      if (sortedSignupKeys[k] <= seriesLabels[l]) { lastCum = cumByDay[sortedSignupKeys[k]]; break; }
    }
  }
  cumulativeSeries.push(lastCum);
}

function retentionRate(offsetDays) {
  const cohortEnd = addDays(todayStart, -offsetDays);
  let cohort = 0;
  let retained = 0;
  for (let i = 0; i < users.length; i++) {
    const signupDay = startOfUtcDay(new Date(users[i].createdAt));
    if (isNaN(signupDay.getTime()) || signupDay > cohortEnd) continue;
    cohort++;
    const targetDay = toDateKey(addDays(signupDay, offsetDays));
    const uid = users[i].user_id;
    let hit = false;
    for (let j = 0; j < attempts.length; j++) {
      if (attempts[j].user_id === uid && toDateKey(attempts[j].createdAt) === targetDay) { hit = true; break; }
    }
    if (hit) retained++;
  }
  if (cohort < 5) return null;
  return Math.round((retained / cohort) * 1000) / 10;
}

const dau = Object.keys(activeTodaySet).length;
const mau = Object.keys(activeMonthSet).length;
const stickiness = mau > 0 ? Math.round((dau / mau) * 1000) / 10 : 0;
const activeRangeCount = Object.keys(activeRangeSet).length;
const avgAttemptsPerActiveUser = activeRangeCount > 0 ? Math.round((attemptsInRange.length / activeRangeCount) * 10) / 10 : 0;

let bounced = 0;
for (let b = 0; b < users.length; b++) {
  const uid = users[b].user_id;
  if (!uid || !usersWithAttempts[uid]) bounced++;
}
const bounceRate = totalUsers > 0 ? Math.round((bounced / totalUsers) * 1000) / 10 : 0;

const userStats = {};
for (let i = 0; i < attempts.length; i++) {
  const uid = attempts[i].user_id;
  if (!uid) continue;
  if (!userStats[uid]) userStats[uid] = { total: 0, correct: 0 };
  userStats[uid].total++;
  if (attempts[i].is_correct) userStats[uid].correct++;
}

function accuracyToGrade(pct) {
  if (pct >= 85) return 'A1';
  if (pct >= 75) return 'A2';
  if (pct >= 70) return 'B3';
  if (pct >= 65) return 'B4';
  if (pct >= 60) return 'C5';
  if (pct >= 55) return 'C6';
  if (pct >= 50) return 'D7';
  if (pct >= 45) return 'E8';
  return 'F9';
}

const gradeOrder = ['A1', 'A2', 'B3', 'B4', 'C5', 'C6', 'D7', 'E8', 'F9'];
const gradeCounts = {};
for (let g = 0; g < gradeOrder.length; g++) gradeCounts[gradeOrder[g]] = 0;

let readinessSum = 0;
let readinessN = 0;
const userIdsList = Object.keys(userStats);
for (let i = 0; i < userIdsList.length; i++) {
  const st = userStats[userIdsList[i]];
  if (st.total < 1) continue;
  const pct = (st.correct / st.total) * 100;
  readinessSum += pct;
  readinessN++;
  gradeCounts[accuracyToGrade(pct)]++;
}
const avgReadinessScore = readinessN > 0 ? Math.round((readinessSum / readinessN) * 10) / 10 : 0;

let correctAll = 0;
for (let i = 0; i < attempts.length; i++) if (attempts[i].is_correct) correctAll++;
const avgAccuracy = attempts.length > 0 ? Math.round((correctAll / attempts.length) * 1000) / 10 : 0;

const topicStatsSource = attemptsInRange.length ? attemptsInRange : attempts;
const topicStats = {};
for (let i = 0; i < topicStatsSource.length; i++) {
  const q = questionById[topicStatsSource[i].question_id];
  if (!q || !q.topic_id) continue;
  if (!topicStats[q.topic_id]) topicStats[q.topic_id] = { attempts: 0, correct: 0 };
  topicStats[q.topic_id].attempts++;
  if (topicStatsSource[i].is_correct) topicStats[q.topic_id].correct++;
}

const topicRows = Object.keys(topicStats).map(function (tid) {
  const t = topicStats[tid];
  const name = (topicById[tid] && topicById[tid].name) || 'Unknown';
  const accuracy = t.attempts > 0 ? (t.correct / t.attempts) * 100 : 0;
  return { topicId: tid, name: name, attempts: t.attempts, accuracy: Math.round(accuracy * 10) / 10 };
});
topicRows.sort(function (a, b) { return b.attempts - a.attempts; });
const topTopics = topicRows.slice(0, 10);
const bottomTopics = topicRows.slice().sort(function (a, b) { return a.attempts - b.attempts; }).slice(0, 10);
const lowestAccuracyTopics = topicRows.filter(function (r) { return r.attempts >= 5; }).sort(function (a, b) { return a.accuracy - b.accuracy; }).slice(0, 10);

const qStats = {};
for (let i = 0; i < topicStatsSource.length; i++) {
  const qid = topicStatsSource[i].question_id;
  if (!qid) continue;
  if (!qStats[qid]) qStats[qid] = { attempts: 0, incorrect: 0 };
  qStats[qid].attempts++;
  if (!topicStatsSource[i].is_correct) qStats[qid].incorrect++;
}
const highestErrorQuestions = Object.keys(qStats).map(function (qid) {
  const st = qStats[qid];
  const prompt = (questionById[qid] && questionById[qid].prompt) || 'Question';
  const shortPrompt = prompt.length > 60 ? prompt.slice(0, 57) + '…' : prompt;
  const errorRate = st.attempts > 0 ? (st.incorrect / st.attempts) * 100 : 0;
  return { questionId: qid, label: shortPrompt, attempts: st.attempts, errorRate: Math.round(errorRate * 10) / 10 };
}).filter(function (r) { return r.attempts >= 3; }).sort(function (a, b) { return b.errorRate - a.errorRate; }).slice(0, 10);

const userTopic = {};
for (let i = 0; i < attempts.length; i++) {
  const uid = attempts[i].user_id;
  const q = questionById[attempts[i].question_id];
  if (!uid || !q || !q.topic_id) continue;
  const key = uid + '::' + q.topic_id;
  if (!userTopic[key]) userTopic[key] = { total: 0, correct: 0, userId: uid };
  userTopic[key].total++;
  if (attempts[i].is_correct) userTopic[key].correct++;
}
const criticalUsers = {};
const utKeys = Object.keys(userTopic);
for (let i = 0; i < utKeys.length; i++) {
  const row = userTopic[utKeys[i]];
  if (row.total >= 3 && (row.correct / row.total) * 100 <= 40) criticalUsers[row.userId] = true;
}
const usersWithPractice = Object.keys(userStats).length;
const criticalWeakTopicPct = usersWithPractice > 0 ? Math.round((Object.keys(criticalUsers).length / usersWithPractice) * 1000) / 10 : 0;

const weekBuckets = {};
for (let i = 0; i < attemptsInRange.length; i++) {
  const d = new Date(attemptsInRange[i].createdAt);
  if (isNaN(d.getTime())) continue;
  const weekStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
  const key = toDateKey(weekStart);
  if (!weekBuckets[key]) weekBuckets[key] = { total: 0, correct: 0 };
  weekBuckets[key].total++;
  if (attemptsInRange[i].is_correct) weekBuckets[key].correct++;
}
const readinessTrendLabels = Object.keys(weekBuckets).sort();
const readinessTrend = readinessTrendLabels.map(function (k) {
  const b = weekBuckets[k];
  return Math.round((b.correct / b.total) * 1000) / 10;
});

const schoolCounts = {};
const levelCounts = {};
const trackCounts = {};
for (let i = 0; i < settings.length; i++) {
  const school = String(settings[i].school || '').trim() || 'Unspecified';
  const level = String(settings[i].level || '').trim() || 'Unspecified';
  const track = String(settings[i].exam_track || '').trim() || 'Unspecified';
  schoolCounts[school] = (schoolCounts[school] || 0) + 1;
  levelCounts[level] = (levelCounts[level] || 0) + 1;
  trackCounts[track] = (trackCounts[track] || 0) + 1;
}
function toNamedCounts(mapObj, limit) {
  return Object.keys(mapObj).map(function (k) {
    return { name: k, count: mapObj[k] };
  }).sort(function (a, b) { return b.count - a.count; }).slice(0, limit || 50);
}

const gradeDistribution = gradeOrder.map(function (g) {
  return { name: g, count: gradeCounts[g] || 0 };
});

return {
  generatedAt: now.toISOString(),
  range: { preset: preset, start: toDateKey(rangeStart), end: toDateKey(addDays(rangeEnd, -1)) },
  overview: {
    totalUsers: totalUsers,
    activeToday: Object.keys(activeTodaySet).length,
    activeWeek: Object.keys(activeWeekSet).length,
    activeMonth: Object.keys(activeMonthSet).length,
    signupsToday: signupsToday,
    signupsWeek: signupsWeek,
    signupsMonth: signupsMonth,
    totalAttempts: attempts.length,
    notesViewed: null,
    avgSessionDuration: null,
    avgReadinessScore: avgReadinessScore
  },
  growth: {
    labels: seriesLabels,
    signupsSeries: signupsSeries,
    cumulativeUsersSeries: cumulativeSeries,
    retention: { d1: retentionRate(1), d7: retentionRate(7), d30: retentionRate(30) }
  },
  engagement: {
    dau: dau,
    mau: mau,
    stickiness: stickiness,
    avgAttemptsPerActiveUser: avgAttemptsPerActiveUser,
    avgStreak: null,
    activeStreakPct: null,
    bounceRate: bounceRate
  },
  content: {
    topTopics: topTopics,
    bottomTopics: bottomTopics,
    lowestAccuracyTopics: lowestAccuracyTopics,
    mostViewedNotes: null,
    highestErrorQuestions: highestErrorQuestions
  },
  outcomes: {
    gradeDistribution: gradeDistribution,
    avgAccuracy: avgAccuracy,
    criticalWeakTopicPct: criticalWeakTopicPct,
    readinessTrendLabels: readinessTrendLabels,
    readinessTrend: readinessTrend
  },
  traffic: null,
  demographics: {
    topSchools: toNamedCounts(schoolCounts, 10),
    byLevel: toNamedCounts(levelCounts, 20),
    byExamTrack: toNamedCounts(trackCounts, 20)
  }
};
}
