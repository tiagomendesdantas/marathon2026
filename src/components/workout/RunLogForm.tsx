import { useState } from 'react';
import type { RunLog } from '../../types';

interface RunLogFormProps {
  date: string;
  existingLog?: RunLog;
  onSave: (log: RunLog) => void;
  onDelete?: () => void;
}

const feelingEmojis = ['😫', '😕', '😐', '🙂', '🤩'];

export function RunLogForm({ date, existingLog, onSave, onDelete }: RunLogFormProps) {
  const [distance, setDistance] = useState(existingLog?.actualDistanceKm?.toString() || '');
  const [minutes, setMinutes] = useState(
    existingLog ? Math.floor(existingLog.actualTimeMinutes).toString() : ''
  );
  const [seconds, setSeconds] = useState(
    existingLog ? Math.round((existingLog.actualTimeMinutes % 1) * 60).toString() : ''
  );
  const [feeling, setFeeling] = useState<number>(existingLog?.feeling || 3);
  const [notes, setNotes] = useState(existingLog?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dist = parseFloat(distance);
    const mins = parseInt(minutes || '0');
    const secs = parseInt(seconds || '0');
    if (isNaN(dist) || dist <= 0) return;

    onSave({
      date,
      actualDistanceKm: dist,
      actualTimeMinutes: mins + secs / 60,
      feeling: feeling as RunLog['feeling'],
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Distance (km)
        </label>
        <input
          type="number"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. 10.5"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Time
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="min"
          />
          <span className="text-gray-500">:</span>
          <input
            type="number"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="sec"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          How did it feel?
        </label>
        <div className="flex flex-wrap gap-2">
          {feelingEmojis.map((emoji, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFeeling(i + 1)}
              className={`w-10 h-10 text-xl rounded-lg transition-all ${
                feeling === i + 1
                  ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500 scale-110'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          placeholder="How was the run?"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {existingLog ? 'Update' : 'Log Run'}
        </button>
        {existingLog && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
