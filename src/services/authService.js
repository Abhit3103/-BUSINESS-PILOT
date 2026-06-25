import { api } from '@/api/axios';

/**
 * Change the password for the currently authenticated admin user.
 * @param {{ currentPassword: string, newPassword: string }} credentials
 * @returns {Promise<{ message: string }>}
 */
export async function changePassword(credentials) {
  const { data } = await api.put('/auth/change-password', credentials);
  return data;
}

/**
 * Update the profile information for the currently authenticated admin user.
 * @param {{ name?: string, email?: string }} payload
 * @returns {Promise<{ message: string, user: object }>}
 */
export async function updateProfile(payload) {
  const { data } = await api.put('/auth/profile', payload);
  return data;
}