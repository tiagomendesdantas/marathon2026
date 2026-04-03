import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { WeeklyStats } from '../../utils/stats';

interface WeeklyMileageChartProps {
  data: WeeklyStats[];
  currentWeek: number;
}

export function WeeklyMileageChart({ data, currentWeek }: WeeklyMileageChartProps) {
  const chartData = data.map((d) => ({
    name: `W${d.weekNumber}`,
    planned: d.plannedKm,
    actual: d.actualKm || undefined,
    isCurrent: d.weekNumber === currentWeek,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Weekly Mileage (km)</h3>
      <div className="h-[200px] sm:h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={1} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="planned" fill="#d1d5db" name="Planned" radius={[2, 2, 0, 0]} />
          <Bar dataKey="actual" fill="#3b82f6" name="Actual" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
