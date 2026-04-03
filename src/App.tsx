import { useState, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { TabNav } from './components/TabNav';
import { CalendarView } from './components/calendar/CalendarView';
import { Dashboard } from './components/dashboard/Dashboard';
import { WorkoutDetail } from './components/workout/WorkoutDetail';
import { trainingPlan } from './data/trainingPlan';
import { useRunLogs } from './hooks/useRunLogs';
import { exportData, importData, getAppState } from './utils/storage';
import type { Workout } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('marathon2026-dark') === 'true';
    }
    return false;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { logs, logRun, deleteLog, importState } = useRunLogs();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDark = useCallback(() => {
    setDarkMode((prev) => {
      localStorage.setItem('marathon2026-dark', String(!prev));
      return !prev;
    });
  }, []);

  const selectedWorkout: Workout | undefined = selectedDate
    ? trainingPlan.weeks.flatMap((w) => w.workouts).find((w) => w.date === selectedDate)
    : undefined;

  const handleExport = useCallback(() => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marathon2026-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const success = importData(reader.result as string);
        if (success) {
          importState(getAppState());
          alert('Data imported successfully!');
        } else {
          alert('Invalid backup file.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [importState]
  );

  return (
    <Layout darkMode={darkMode} onToggleDark={toggleDark}>
      <div className="flex items-center justify-between mb-4">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Export
          </button>
          <button
            onClick={handleImport}
            className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Import
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      {activeTab === 'calendar' && (
        <CalendarView plan={trainingPlan} logs={logs} onDayClick={(date) => setSelectedDate(date)} />
      )}

      {activeTab === 'dashboard' && <Dashboard plan={trainingPlan} logs={logs} />}

      {selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          log={logs[selectedWorkout.date]}
          onSave={(log) => {
            logRun(log);
            setSelectedDate(null);
          }}
          onDelete={() => {
            deleteLog(selectedWorkout.date);
            setSelectedDate(null);
          }}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </Layout>
  );
}

export default App;
