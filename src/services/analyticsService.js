import {
  buildDailySales,
  buildWeeklySales,
  buildMonthlyRevenue,
  computeOrderStats,
  buildTopSellingProducts,
  getRecentOrders,
  buildCategoryDistribution,
} from '@/lib/analytics';
import { api } from '@/api/axios';
import { listOrders } from '@/services/ordersService';
import { listProducts } from '@/services/productsService';

/**
 * Tries optional backend analytics endpoint, then aggregates from orders.
 * Expected backend shape: [{ date, sales }]
 */
export async function fetchSalesSeries(period = 'daily') {
  const endpoints = {
    daily: '/admin/analytics/sales/daily',
    weekly: '/admin/analytics/sales/weekly',
    monthly: '/admin/analytics/sales/monthly',
  };

  try {
    const { data } = await api.get(endpoints[period] || endpoints.daily);
    const series = Array.isArray(data) ? data : (data?.data || data?.items || []);
    if (series.length && series[0]?.date != null && series[0]?.sales != null) {
      return series.map((row) => ({
        date: row.date,
        sales: Number(row.sales) || 0,
        label: row.label || new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      }));
    }
  } catch {
    // use client aggregation
  }

  const orders = await listOrders({ limit: 100 });
  if (period === 'weekly') return buildWeeklySales(orders);
  if (period === 'monthly') return buildMonthlyRevenue(orders);
  return buildDailySales(orders, 30);
}

export async function fetchDashboardAnalytics() {
  const [orders, productsRes] = await Promise.all([
    listOrders({ limit: 100 }),
    listProducts({ limit: 100, skip: 0 }),
  ]);

  const products = productsRes?.items || [];
  const orderStats = computeOrderStats(orders);

  return {
    orderStats,
    dailySales: buildDailySales(orders, 30),
    weeklySales: buildWeeklySales(orders),
    monthlyRevenue: buildMonthlyRevenue(orders),
    topProducts: buildTopSellingProducts(orders),
    recentOrders: getRecentOrders(orders, 8),
    categoryDistribution: buildCategoryDistribution(products),
    statusDistribution: [
      { name: 'Pending', value: orderStats.pending, color: '#eab308' },
      { name: 'Shipped', value: orderStats.shipped, color: '#3b82f6' },
      { name: 'Delivered', value: orderStats.delivered, color: '#22c55e' },
      { name: 'Cancelled', value: orderStats.cancelled, color: '#ef4444' },
    ],
    totalProducts: productsRes?.total ?? products.length,
  };
}
