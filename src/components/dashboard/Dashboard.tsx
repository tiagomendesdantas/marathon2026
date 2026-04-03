import type { TrainingPlan, RunLog } from '../../types';
import { computeWeeklyStats, computeOverallStats, getLongRunData, getPaceTrendData } from '../../utils/stats';
import { useCurrentWeek } from '../../hooks/useCurrentWeek';
import { StreakCard } from './StreakCard';
import { PhaseProgress } from './PhaseProgress';
import { WeeklyMileageChart } from './WeeklyMileageChart';
import { LongRunChart } from './LongRunChart';
import { PaceTrendChart } from './PaceTrendChart';

interface DashboardProps {
  plan: TrainingPlan;
  logs: Record<string, RunLog>;
}

export function Dashboard({ plan, logs }: DashboardProps) {
  const currentWeek = useCurrentWeek();
  const weeklyStats = computeWeeklyStats(plan, logs);
  const overallStats = computeOverallStats(plan, logs);
  const longRunData = getLongRunData(plan, logs);
  const paceTrendData = getPaceTrendData(plan, logs);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Dashboard</h2>
      <StreakCard stats={overallStats} />
      <PhaseProgress />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyMileageChart data={weeklyStats} currentWeek={currentWeek} />
        <LongRunChart data={longRunData} />
      </div>
      <PaceTrendChart data={paceTrendData} />
    </div>
  );
}
