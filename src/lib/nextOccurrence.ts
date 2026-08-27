import type { MeetingSchedule } from '@app/data/meeting';

export interface NextMeeting {
  label: string;
  isLive: boolean;
}

export function nextOccurrence(
  schedule: MeetingSchedule,
  now: Date = new Date(),
  hour12 = true,
  displayTimeZone?: string,
): NextMeeting {
  const { weekday, hour, minute, timeZone, durationMinutes } = schedule;
  const showTz = displayTimeZone || timeZone;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const currentWeekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const currentHour = parseInt(get('hour'), 10);
  const currentMinute = parseInt(get('minute'), 10);
  const currentYear = parseInt(get('year'), 10);
  const currentMonth = parseInt(get('month'), 10) - 1;
  const currentDay = parseInt(get('day'), 10);

  const nowInZoneMs = Date.UTC(currentYear, currentMonth, currentDay, currentHour, currentMinute);
  const startTodayMs = Date.UTC(currentYear, currentMonth, currentDay, hour, minute);
  const endTodayMs = startTodayMs + durationMinutes * 60_000;

  let daysUntil = (weekday - currentWeekday + 7) % 7;

  if (daysUntil === 0) {
    if (nowInZoneMs >= startTodayMs && nowInZoneMs < endTodayMs) {
      const realStart = buildRealDate(currentYear, currentMonth, currentDay, hour, minute, timeZone);
      return { label: formatTimeInZone(realStart, showTz, hour12), isLive: true };
    }
    if (nowInZoneMs >= endTodayMs) {
      daysUntil = 7;
    }
  }

  const realStart = buildRealDate(currentYear, currentMonth, currentDay + daysUntil, hour, minute, timeZone);
  const label = formatLabelInZone(realStart, showTz, hour12);
  return { label, isLive: false };
}

function buildRealDate(year: number, month: number, day: number, hour: number, minute: number, timeZone: string): Date {
  const guess = new Date(Date.UTC(year, month, day, hour, minute));
  const offsetParts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(guess);

  const g = (type: Intl.DateTimeFormatPartTypes) =>
    parseInt(offsetParts.find((p) => p.type === type)?.value ?? '0', 10);

  const diffMinutes = (g('hour') * 60 + g('minute')) - (hour * 60 + minute);
  const diffDays = g('day') - day;
  const totalDiffMin = diffDays * 1440 + diffMinutes;

  return new Date(guess.getTime() - totalDiffMin * 60_000);
}

function formatTimeInZone(date: Date, timeZone: string, hour12: boolean): string {
  const formatted = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12,
    timeZone,
  }).format(date);
  return `${formatted} ${shortZone(timeZone, date)}`;
}

function formatLabelInZone(date: Date, timeZone: string, hour12: boolean): string {
  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12,
    timeZone,
  }).format(date);
  return `${formatted} ${shortZone(timeZone, date)}`;
}

function shortZone(timeZone: string, date: Date): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (tzPart) return tzPart.value;
  } catch { /* fallback below */ }

  const map: Record<string, string> = {
    'America/Los_Angeles': 'PT',
    'America/Denver': 'MT',
    'America/Chicago': 'CT',
    'America/New_York': 'ET',
  };
  return map[timeZone] ?? timeZone.split('/').pop()?.replace(/_/g, ' ') ?? '';
}
