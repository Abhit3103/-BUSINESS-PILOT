import { useEffect, useState } from 'react';
import { Package, ShoppingCart, TrendingUp, AlertCircle, Truck, CheckCircle, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/layout/StatCard';
import { StatCardSkeleton } from '@/components/common/Skeleton';
import { SalesChart } from '@/components/analytics/SalesChart';
import { TopProductsList } from '@/components/analytics/TopProductsList';
import { RecentOrdersList } from '@/components/analytics/RecentOrdersList';
import { formatINR } from '@/lib/formatINR';
import { fetchDashboardAnalytics } from '@/services/analyticsService';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('daily');

  useEffect(() => {
    (async () => {
      try {
        const analytics = await fetchDashboardAnalytics();
        setData(analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = data?.orderStats;
  const chartData = chartPeriod === 'weekly'
    ? data?.weeklySales
    : chartPeriod === 'monthly'
      ? data?.monthlyRevenue
      : data?.dailySales;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Loading overview..." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total revenue', value: formatINR(stats?.revenue), icon: TrendingUp },
    { title: 'Total orders', value: stats?.totalOrders ?? 0, icon: ShoppingCart },
    { title: 'Products', value: data?.totalProducts ?? 0, icon: Package },
    { title: 'Pending', value: stats?.pending ?? 0, icon: AlertCircle },
    { title: 'Shipped', value: stats?.shipped ?? 0, icon: Truck },
    { title: 'Delivered', value: stats?.delivered ?? 0, icon: CheckCircle },
    { title: 'Paid orders', value: stats?.paid ?? 0, icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard overview"
        description="Sales, orders, and catalog performance in INR."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {['daily', 'weekly', 'monthly'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setChartPeriod(p)}
            className={`rounded-xl px-5 py-2 text-sm font-medium capitalize transition-all duration-200 ${
              chartPeriod === p
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesChart
            title={chartPeriod === 'monthly' ? 'Monthly revenue' : `${chartPeriod.charAt(0).toUpperCase() + chartPeriod.slice(1)} sales`}
            data={chartData}
            dataKey="sales"
          />
        </div>

        <div className="glass-card border-none p-6 lg:col-span-3">
          <h3 className="mb-4 font-semibold text-foreground">Order status</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.statusDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {(data?.statusDistribution || []).map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopProductsList products={data?.topProducts} />
        <RecentOrdersList orders={data?.recentOrders} />
      </div>
    </div>
  );
}
