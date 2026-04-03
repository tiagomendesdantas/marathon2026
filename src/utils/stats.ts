import type { TrainingPlan, RunLog } from '../types';

export interface WeeklyStats {
  weekNumber: number;
  phase: string;
  plannedKm: number;
  actualKm: number;
  completedRuns: number;
  totalRuns: number;
}

export interface OverallStats {
  totalRuns: number;
  totalDistanceKm: number;
  currentStreak: number;
  completionPercent: number;
  avgFeeling: number;
}

export function computeWeeklyStats(plan: TrainingPlan, logs: Record<string, RunLog>): WeeklyStats[] {
  return plan.weeks.map((week) => {
    const runnableWorkouts = week.workouts.filter((w) => w.type !== 'rest');
    const completedRuns = runnableWorkouts.filter((w) => logs[w.date]).length;
    const actualKm = runnableWorkouts.reduce((sum, w) => {
      const log = logs[w.date];
      return sum + (log ? log.actualDistanceKm : 0);
    }, 0);

    return {
      weekNumber: week.weekNumber,
      phase: week.phaseLabel,
      plannedKm: week.totalDistanceKm,
      actualKm: Math.round(actualKm * 10) / 10,
      completedRuns,
      totalRuns: runnableWorkouts.length,
    };
  });
}

export function computeOverallStats(plan: TrainingPlan, logs: Record<string, RunLog>): OverallStats {
  const allLogs = Object.values(logs);
  const totalRuns = allLogs.length;
  const totalDistanceKm = Math.round(allLogs.reduce((sum, l) => sum + l.actualDistanceKm, 0) * 10) / 10;

  const allRunnableDates = plan.weeks
    .flatMap((w) => w.workouts)
    .filter((w) => w.type !== 'rest')
    .map((w) => w.date)
    .filter((d) => new Date(d) < new Date())
    .sort();

  const pastRunnable = allRunnableDates.length;
  const pastCompleted = allRunnableDates.filter((d) => logs[d]).length;
  const completionPercent = pastRunnable > 0 ? Math.round((pastCompleted / pastRunnable) * 100) : 0;

  let currentStreak = 0;
  for (let i = allRunnableDates.length - 1; i >= 0; i--) {
    if (logs[allRunnableDates[i]]) {
      currentStreak++;
    } else {
      break;
    }
  }

  const avgFeeling =
    totalRuns > 0 ? Math.round((allLogs.reduce((sum, l) => sum + l.feeling, 0) / totalRuns) * 10) / 10 : 0;

  return { totalRuns, totalDistanceKm, currentStreak, completionPercent, avgFeeling };
}

export function getLongRunData(plan: TrainingPlan, logs: Record<string, RunLog>) {
  return plan.weeks.map((week) => {
    const longRun = week.workouts.find((w) => w.type === 'long' || w.type === 'race');
    const log = longRun ? logs[longRun.date] : undefined;
    return {
      week: week.weekNumber,
      planned: longRun?.distanceKm || 0,
      actual: log?.actualDistanceKm || null,
    };
  });
}

export function getPaceTrendData(plan: TrainingPlan, logs: Record<string, RunLog>) {
  return plan.weeks
    .map((week) => {
      const weekLogs = week.workouts
        .map((w) => logs[w.date])
        .filter((l): l is RunLog => !!l && l.actualDistanceKm > 0 && l.actualTimeMinutes > 0);
      if (weekLogs.length === 0) return null;
      const totalDist = weekLogs.reduce((s, l) => s + l.actualDistanceKm, 0);
      const totalTime = weekLogs.reduce((s, l) => s + l.actualTimeMinutes, 0);
      return {
        week: week.weekNumber,
        pace: Math.round((totalTime / totalDist) * 100) / 100,
      };
    })
    .filter((d): d is { week: number; pace: number } => d !== null);
}
