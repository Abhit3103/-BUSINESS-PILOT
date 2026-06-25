import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { formatINR, formatINRAxis } from '@/lib/formatINR';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm shadow-xl">
      <p className="text-zinc-400">{label}</p>
      <p className="font-semibold text-orange-400">{formatINR(value)}</p>
    </div>
  );
}

export function SalesChart({ title, data, dataKey = 'sales', variant = 'line', height = 300 }) {
  const chartData = (data || []).map((row) => ({
    ...row,
    label: row.label || row.date,
  }));

  return (
    <Card className="border-zinc-800 bg-zinc-900/80">
      <CardHeader>
        <CardTitle className="text-zinc-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div style={{ height }} className="w-full min-h-[240px]">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">No sales data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {variant === 'bar' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={formatINRAxis} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey={dataKey} fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={formatINRAxis} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey={dataKey} stroke="#f97316" strokeWidth={2.5} dot={{ r: 3, fill: '#f97316' }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
