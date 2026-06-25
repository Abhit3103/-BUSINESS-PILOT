import { api } from '@/api/axios';

/** Extract orders array from various backend envelope shapes */
export function normalizeOrdersResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data?.orders)) return data.data.orders;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

/** @param {{ limit?: number, skip?: number, status?: string }} params */
export async function listOrders(params = {}) {
  const { data } = await api.get('/admin/orders', {
    params: {
      limit: params.limit ?? 100,
      skip: params.skip ?? 0,
      ...(params.status ? { status: params.status } : {}),
    },
  });
  return normalizeOrdersResponse(data);
}

/** @param {string} orderId @param {{ status: string, tracking_note?: string }} payload */
export async function updateOrderStatus(orderId, payload) {
  const { data } = await api.put(`/admin/orders/${orderId}/status`, payload);
  return data;
}
