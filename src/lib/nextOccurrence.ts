import type { MeetingSchedule } from '@app/data/meeting';

export interface NextMeeting {
  label: string;
  isLive: boolean;
}

export function nextOccurrence(schedule: MeetingSchedule, now: Date = new Date()): NextMeeting {
  const { weekday, hour, minute, timeZone, durationMinutes } = schedule;

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
      return { label: formatTime(hour, minute, timeZone), isLive: true };
    }
    if (nowInZoneMs >= endTodayMs) {
      daysUntil = 7;
    }
  }

  const nextDate = new Date(Date.UTC(currentYear, currentMonth, currentDay + daysUntil, hour, minute));
  const label = formatLabel(nextDate, timeZone);
  return { label, isLive: false };
}

function formatTime(hour: number, minute: number, timeZone: string): string {
  const d = new Date(Date.UTC(2024, 0, 1, hour, minute));
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(d) + ` ${shortZone(timeZone)}`;
}

function formatLabel(utcDate: Date, timeZone: string): string {
  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(utcDate);
  return `${formatted} ${shortZone(timeZone)}`;
}

function shortZone(timeZone: string): string {
  const map: Record<string, string> = {
    'America/Los_Angeles': 'PT',
    'America/Denver': 'MT',
    'America/Chicago': 'CT',
    'America/New_York': 'ET',
  };
  return map[timeZone] ?? timeZone.split('/').pop()?.replace(/_/g, ' ') ?? '';
}
