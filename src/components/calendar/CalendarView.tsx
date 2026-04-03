import type { TrainingPlan, RunLog } from '../../types';
import { WeekRow } from './WeekRow';
import { useCurrentWeek } from '../../hooks/useCurrentWeek';
import { useCallback } from 'react';

interface CalendarViewProps {
  plan: TrainingPlan;
  logs: Record<string, RunLog>;
  onDayClick: (date: string) => void;
}

export function CalendarView({ plan, logs, onDayClick }: CalendarViewProps) {
  const currentWeek = useCurrentWeek();

  const scrollToCurrentWeek = useCallback(() => {
    const el = document.getElementById(`week-${currentWeek}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentWeek]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Training Calendar</h2>
        {currentWeek > 0 && currentWeek <= 26 && (
          <button
            onClick={scrollToCurrentWeek}
            className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Today
          </button>
        )}
      </div>
      <div className="space-y-1">
        {plan.weeks.map((week) => (
          <WeekRow
            key={week.weekNumber}
            week={week}
            logs={logs}
            isCurrentWeek={week.weekNumber === currentWeek}
            onDayClick={onDayClick}
          />
        ))}
      </div>
    </div>
  );
}
