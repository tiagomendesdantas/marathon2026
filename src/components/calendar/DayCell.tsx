import type { Workout, RunLog } from '../../types';
import { formatDate, isDateToday, isDatePast, getDayName } from '../../utils/dates';

interface DayCellProps {
  workout: Workout;
  log?: RunLog;
  onClick: () => void;
}

const typeColors: Record<string, string> = {
  rest: 'bg-gray-100 dark:bg-gray-800 text-gray-400',
  easy: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  long: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  tempo: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  intervals: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  recovery: 'bg-lime-50 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
  strength: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  race: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
};

const typeLabels: Record<string, string> = {
  rest: 'Rest',
  easy: 'Easy',
  long: 'Long',
  tempo: 'Tempo',
  intervals: 'Intervals',
  recovery: 'Recovery',
  strength: 'Strength',
  race: 'Race!',
};

export function DayCell({ workout, log, onClick }: DayCellProps) {
  const today = isDateToday(workout.date);
  const past = isDatePast(workout.date);
  const isRest = workout.type === 'rest';
  const completed = !!log;
  const missed = past && !completed && !isRest;

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg text-left text-xs transition-all hover:ring-2 hover:ring-blue-400
        ${typeColors[workout.type]}
        ${today ? 'ring-2 ring-blue-500 shadow-md' : ''}
        ${missed ? 'opacity-60' : ''}
        min-h-[70px] w-full`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">{getDayName(workout.dayOfWeek)}</span>
        <span className="text-[10px] opacity-70">{formatDate(workout.date)}</span>
      </div>
      <div className="font-semibold text-[11px]">{typeLabels[workout.type]}</div>
      {workout.distanceKm && (
        <div className="text-[11px] mt-0.5">{workout.distanceKm} km</div>
      )}
      {completed && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-[10px]">✓</span>
        </div>
      )}
      {missed && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
          <span className="text-white text-[10px]">✗</span>
        </div>
      )}
    </button>
  );
}
