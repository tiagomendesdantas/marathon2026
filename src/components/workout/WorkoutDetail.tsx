import type { Workout, RunLog } from '../../types';
import { formatDateFull, formatPace } from '../../utils/dates';
import { RunLogForm } from './RunLogForm';

interface WorkoutDetailProps {
  workout: Workout;
  log?: RunLog;
  onSave: (log: RunLog) => void;
  onDelete: () => void;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  rest: 'text-gray-600 bg-gray-100 dark:bg-gray-700',
  easy: 'text-green-700 bg-green-100 dark:bg-green-900/40 dark:text-green-400',
  long: 'text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400',
  tempo: 'text-orange-700 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400',
  intervals: 'text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400',
  recovery: 'text-lime-700 bg-lime-100 dark:bg-lime-900/40 dark:text-lime-400',
  race: 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-400',
};

export function WorkoutDetail({ workout, log, onSave, onDelete, onClose }: WorkoutDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateFull(workout.date)}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeColors[workout.type]}`}>
                  {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                </span>
                {workout.distanceKm && (
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {workout.distanceKm} km
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">{workout.description}</p>
            {workout.paceGuidance && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{workout.paceGuidance}</p>
            )}
          </div>

          {log && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Completed</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Distance</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{log.actualDistanceKm} km</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Pace</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {formatPace(log.actualDistanceKm, log.actualTimeMinutes)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Feeling</span>
                  <p className="font-medium">{['😫', '😕', '😐', '🙂', '🤩'][log.feeling - 1]}</p>
                </div>
              </div>
              {log.notes && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{log.notes}</p>}
            </div>
          )}

          {workout.type !== 'rest' && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {log ? 'Update Log' : 'Log This Run'}
              </h3>
              <RunLogForm
                date={workout.date}
                existingLog={log}
                onSave={onSave}
                onDelete={log ? onDelete : undefined}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
