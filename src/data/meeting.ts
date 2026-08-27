export interface MeetingSchedule {
  slug: string;
  title: string;
  weekday: number; // 0=Sun ... 6=Sat
  hour: number; // 0-23
  minute: number;
  timeZone: string;
  durationMinutes: number;
}

export const FAMILY_PRAYER: MeetingSchedule = {
  slug: 'family-prayer-zoom-meeting',
  title: 'Family Prayer',
  weekday: 4, // Thursday
  hour: 20,
  minute: 30,
  timeZone: 'America/Los_Angeles',
  durationMinutes: 60,
};
