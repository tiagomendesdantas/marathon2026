import { useCurrentWeek } from '../../hooks/useCurrentWeek';

const phases = [
  { name: 'Base', weeks: 8, color: 'bg-green-500' },
  { name: 'Endurance', weeks: 8, color: 'bg-blue-500' },
  { name: 'Peak', weeks: 6, color: 'bg-orange-500' },
  { name: 'Taper', weeks: 4, color: 'bg-purple-500' },
];

export function PhaseProgress() {
  const currentWeek = useCurrentWeek();
  const totalWeeks = 26;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Training Progress</p>
      <div className="flex rounded-full overflow-hidden h-6">
        {phases.map((phase) => {
          const widthPercent = (phase.weeks / totalWeeks) * 100;
          return (
            <div
              key={phase.name}
              className={`${phase.color} relative flex items-center justify-center`}
              style={{ width: `${widthPercent}%` }}
            >
              <span className="text-[10px] text-white font-medium hidden sm:inline">{phase.name}</span>
            </div>
          );
        })}
      </div>
      {currentWeek > 0 && currentWeek <= totalWeeks && (
        <div className="relative mt-1" style={{ paddingLeft: `${((currentWeek - 0.5) / totalWeeks) * 100}%` }}>
          <div className="text-xs text-gray-500 dark:text-gray-400">▲ Week {currentWeek}</div>
        </div>
      )}
      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
        <span>Week 1</span>
        <span>Week 26</span>
      </div>
    </div>
  );
}
