import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PaceTrendChartProps {
  data: { week: number; pace: number }[];
}

export function PaceTrendChart({ data }: PaceTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Pace Trend (min/km)</h3>
        <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
          Log some runs to see your pace trend
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: `W${d.week}`,
    pace: d.pace,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Pace Trend (min/km)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            domain={['auto', 'auto']}
            reversed
            tickFormatter={(v: number) => {
              const m = Math.floor(v);
              const s = Math.round((v - m) * 60);
              return `${m}:${s.toString().padStart(2, '0')}`;
            }}
          />
          <Tooltip
            formatter={(value) => {
              const v = Number(value);
              const m = Math.floor(v);
              const s = Math.round((v - m) * 60);
              return [`${m}:${s.toString().padStart(2, '0')} /km`, 'Pace'];
            }}
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
            }}
          />
          <Line type="monotone" dataKey="pace" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
