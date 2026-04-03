import { format, parseISO, differenceInCalendarWeeks, isBefore, isToday, startOfDay } from 'date-fns';

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function formatDateFull(dateStr: string): string {
  return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
}

export function getDayName(dayOfWeek: number): string {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[dayOfWeek];
}

export function getCurrentWeekNumber(planStartDate: string): number {
  const start = parseISO(planStartDate);
  const today = startOfDay(new Date());
  if (isBefore(today, start)) return 0;
  return differenceInCalendarWeeks(today, start, { weekStartsOn: 1 }) + 1;
}

export function isDateToday(dateStr: string): boolean {
  return isToday(parseISO(dateStr));
}

export function isDatePast(dateStr: string): boolean {
  const date = parseISO(dateStr);
  const today = startOfDay(new Date());
  return isBefore(date, today);
}

export function formatPace(distanceKm: number, timeMinutes: number): string {
  if (distanceKm <= 0) return '--';
  const paceMin = timeMinutes / distanceKm;
  const mins = Math.floor(paceMin);
  const secs = Math.round((paceMin - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /km`;
}
