import type { OverallStats } from '../../utils/stats';

interface StreakCardProps {
  stats: OverallStats;
}

export function StreakCard({ stats }: StreakCardProps) {
  const feelingEmojis = ['', '😫', '😕', '😐', '🙂', '🤩'];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Runs</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalRuns}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Distance</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalDistanceKm} km</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Streak</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.currentStreak}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Completion</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.completionPercent}%</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg Feeling</p>
        <p className="text-2xl mt-1">{stats.avgFeeling > 0 ? feelingEmojis[Math.round(stats.avgFeeling)] : '--'}</p>
      </div>
    </div>
  );
}
