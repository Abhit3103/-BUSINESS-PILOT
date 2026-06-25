import { parseAmount } from '@/lib/formatINR';

/** @typedef {{ id: string, status?: string, total?: number, subtotal?: number, created_at?: string, order_items?: Array<{ product_id?: string, name?: string, quantity?: number, price?: number }> }} Order */

function orderRevenue(order) {
  if (!order || order.status === 'cancelled') return 0;
  const total = parseAmount(order.total);
  if (total > 0) return total;
  return parseAmount(order.subtotal);
}

function parseDateKey(createdAt) {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Daily sales for charts — shape: { date, sales }
 * @param {Order[]} orders
 * @param {number} days
 */
export function buildDailySales(orders, days = 30) {
  const map = new Map();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    map.set(d.toISOString().slice(0, 10), 0);
  }

  (orders || []).forEach((order) => {
    const key = parseDateKey(order.created_at);
    if (!key) return;
    if (!map.has(key)) map.set(key, 0);
    map.set(key, map.get(key) + orderRevenue(order));
  });

  return Array.from(map.entries()).map(([date, sales]) => ({
    date,
    sales: Math.round(sales * 100) / 100,
    label: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }));
}

/** @param {Order[]} orders */
export function buildWeeklySales(orders, weeks = 8) {
  const map = new Map();
  const now = new Date();
  const currentWeekStart = startOfWeek(now);

  for (let i = weeks - 1; i >= 0; i -= 1) {
    const w = new Date(currentWeekStart);
    w.setDate(w.getDate() - i * 7);
    map.set(w.toISOString().slice(0, 10), 0);
  }

  (orders || []).forEach((order) => {
    if (!order.created_at) return;
    const d = new Date(order.created_at);
    if (Number.isNaN(d.getTime())) return;
    const weekKey = startOfWeek(d).toISOString().slice(0, 10);
    if (!map.has(weekKey)) map.set(weekKey, 0);
    map.set(weekKey, map.get(weekKey) + orderRevenue(order));
  });

  return Array.from(map.entries()).map(([date, sales]) => ({
    date,
    sales: Math.round(sales * 100) / 100,
    label: `W/C ${new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
  }));
}

/** @param {Order[]} orders */
export function buildMonthlyRevenue(orders, months = 6) {
  const map = new Map();
  const now = new Date();

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map.set(key, 0);
  }

  (orders || []).forEach((order) => {
    if (!order.created_at) return;
    const d = new Date(order.created_at);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, 0);
    map.set(key, map.get(key) + orderRevenue(order));
  });

  return Array.from(map.entries()).map(([date, sales]) => ({
    date,
    sales: Math.round(sales * 100) / 100,
    label: new Date(`${date}-01`).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
  }));
}

/** @param {Order[]} orders */
export function computeOrderStats(orders) {
  const list = orders || [];
  let revenue = 0;
  let pending = 0;
  let shipped = 0;
  let delivered = 0;
  let cancelled = 0;
  let paid = 0;

  list.forEach((order) => {
    const status = (order.status || '').toLowerCase();
    if (status === 'pending') pending += 1;
    if (status === 'shipped') shipped += 1;
    if (status === 'delivered') delivered += 1;
    if (status === 'cancelled') cancelled += 1;

    const payment = (order.payment_status || '').toLowerCase();
    if (payment === 'paid' || payment === 'completed') paid += 1;

    revenue += orderRevenue(order);
  });

  return {
    totalOrders: list.length,
    revenue: Math.round(revenue * 100) / 100,
    pending,
    shipped,
    delivered,
    cancelled,
    paid,
  };
}

/** @param {Order[]} orders */
export function buildTopSellingProducts(orders, limit = 5) {
  const counts = new Map();

  (orders || []).forEach((order) => {
    if (order.status === 'cancelled') return;
    const items = order.order_items || [];
    items.forEach((item) => {
      const key = item.name || item.product_id || 'Unknown';
      const qty = Number(item.quantity) || 1;
      const existing = counts.get(key) || { name: key, quantity: 0, revenue: 0 };
      existing.quantity += qty;
      existing.revenue += parseAmount(item.price) * qty;
      counts.set(key, existing);
    });
  });

  return Array.from(counts.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

/** @param {Order[]} orders */
export function getRecentOrders(orders, limit = 8) {
  return [...(orders || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

/** @param {import('@/services/productsService').Product[]} products */
export function buildCategoryDistribution(products) {
  const map = {};
  (products || []).forEach((p) => {
    const cat = p.category || 'Uncategorized';
    map[cat] = (map[cat] || 0) + 1;
  });
  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#ea580c', '#c2410c', '#9a3412'];
  return Object.entries(map).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));
}
