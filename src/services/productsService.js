import { api } from '@/api/axios';

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} category
 * @property {string|null} subcategory
 * @property {string|null} brand
 * @property {string|null} sku
 * @property {string|null} short_description
 * @property {string|null} description
 * @property {number} price
 * @property {number|null} discount_price
 * @property {number} stock
 * @property {string[]|null} images
 * @property {string|null} thumbnail
 * @property {string[]|null} tags
 * @property {string} status
 * @property {boolean} featured
 * @property {boolean} bestseller
 * @property {string|null} seo_title
 * @property {string|null} seo_description
 * @property {string|null} origin
 */

/** @param {{ page?: number, page_size?: number, search?: string, category?: string, status?: string }} params */
export async function listProducts(params = {}) {
  const query = {
  skip: params.skip ?? 0,
  limit: params.limit ?? 100,
    ...(params.search ? { search: params.search } : {}),
    ...(params.category ? { category: params.category } : {}),
    ...(params.featured != null ? { featured: params.featured } : {}),
    ...(params.bestseller != null ? { bestseller: params.bestseller } : {}),
  };


  const { data } = await api.get('/products/', { params: query });
  return data;
}

/** @param {string} idOrSlug */
export async function getProduct(idOrSlug) {
  const { data } = await api.get(`/products/${encodeURIComponent(idOrSlug)}`);
  return data;
}

/** @param {Record<string, unknown>} payload */
export async function createProduct(payload) {
  const { data } = await api.post('/admin/products', payload);
  return data;
}

/** @param {string} id @param {Record<string, unknown>} payload */
export async function updateProduct(id, payload) {
  const { data } = await api.put(`/admin/products/${id}`, payload);
  return data;
}

/** @param {string} id */
export async function deleteProduct(id) {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
}
