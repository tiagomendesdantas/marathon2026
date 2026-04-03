import type { TrainingWeek, RunLog } from '../../types';
import { DayCell } from './DayCell';

interface WeekRowProps {
  week: TrainingWeek;
  logs: Record<string, RunLog>;
  isCurrentWeek: boolean;
  onDayClick: (date: string) => void;
}

const phaseColors: Record<string, string> = {
  base: 'bg-green-600',
  endurance: 'bg-blue-600',
  peak: 'bg-orange-600',
  taper: 'bg-purple-600',
};

export function WeekRow({ week, logs, isCurrentWeek, onDayClick }: WeekRowProps) {
  const actualKm = week.workouts.reduce((sum, w) => {
    const log = logs[w.date];
    return sum + (log ? log.actualDistanceKm : 0);
  }, 0);

  return (
    <div
      id={`week-${week.weekNumber}`}
      className={`rounded-xl p-3 mb-3 transition-all ${
        isCurrentWeek
          ? 'bg-white dark:bg-gray-800 shadow-lg ring-2 ring-blue-500'
          : 'bg-white dark:bg-gray-800 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-[10px] text-white font-bold px-2 py-0.5 rounded-full ${phaseColors[week.phase]}`}>
          {week.phaseLabel}
        </span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Week {week.weekNumber}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          {actualKm > 0 && <span className="font-medium text-green-600 dark:text-green-400">{Math.round(actualKm * 10) / 10} / </span>}
          {week.totalDistanceKm} km
        </span>
        {isCurrentWeek && (
          <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
            Current
          </span>
        )}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {week.workouts.map((workout) => (
          <DayCell
            key={workout.date}
            workout={workout}
            log={logs[workout.date]}
            onClick={() => onDayClick(workout.date)}
          />
        ))}
      </div>
    </div>
  );
}
