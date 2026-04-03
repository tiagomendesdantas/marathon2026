import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LongRunChartProps {
  data: { week: number; planned: number; actual: number | null }[];
}

export function LongRunChart({ data }: LongRunChartProps) {
  const chartData = data.map((d) => ({
    name: `W${d.week}`,
    planned: d.planned,
    actual: d.actual ?? undefined,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Long Run Progression (km)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
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
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#d1d5db"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Planned"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Actual"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
