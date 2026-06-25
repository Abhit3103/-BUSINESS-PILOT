import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/layout/StatCard';
import { StatCardSkeleton } from '@/components/common/Skeleton';
import { SalesChart } from '@/components/analytics/SalesChart';
import { formatINR } from '@/lib/formatINR';
import { fetchDashboardAnalytics, fetchSalesSeries } from '@/services/analyticsService';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [salesSeries, setSalesSeries] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const analytics = await fetchDashboardAnalytics();
        setData(analytics);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const series = await fetchSalesSeries(period);
      setSalesSeries(series);
    })();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Loading metrics..." />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const stats = data?.orderStats;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Revenue trends, categories, and order distribution." />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total revenue" value={formatINR(stats?.revenue)} />
        <StatCard title="Orders" value={stats?.totalOrders ?? 0} />
        <StatCard title="Delivered" value={stats?.delivered ?? 0} />
      </div>

      <div className="flex flex-wrap gap-2">
        {['daily', 'weekly', 'monthly'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`rounded-xl px-5 py-2 text-sm font-medium capitalize transition-all duration-200 ${
              period === p ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <SalesChart
        title={period === 'monthly' ? 'Monthly revenue (INR)' : `Sales (${period})`}
        data={salesSeries}
        variant={period === 'monthly' ? 'bar' : 'line'}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-card border-none p-6">
          <h3 className="mb-4 font-semibold text-foreground">Order status distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(data?.statusDistribution || []).map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <SalesChart
          title="Products by category"
          data={(data?.categoryDistribution || []).map((c) => ({ label: c.name, sales: c.value }))}
          dataKey="sales"
          variant="bar"
          height={320}
        />
      </div>
    </div>
  );
}
