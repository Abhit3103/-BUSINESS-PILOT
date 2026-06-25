export const PRODUCT_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'out_of_stock', label: 'Out of stock' },
  { value: 'archived', label: 'Archived' },
];

export const EMPTY_PRODUCT_FORM = {
  name: '',
  slug: '',
  category: '',
  subcategory: '',
  brand: '',
  sku: '',
  short_description: '',
  description: '',
  price: 0,
  discount_price: '',
  stock: 0,
  images: [],
  thumbnail: '',
  tags: [],
  status: 'active',
  featured: false,
  bestseller: false,
  seo_title: '',
  seo_description: '',
  origin: '',
};

/** @param {import('@/services/productsService').Product | null | undefined} product */
export function productToForm(product) {
  if (!product) return { ...EMPTY_PRODUCT_FORM };

  return {
    name: product.name ?? '',
    slug: product.slug ?? '',
    category: product.category ?? '',
    subcategory: product.subcategory ?? '',
    brand: product.brand ?? '',
    sku: product.sku ?? '',
    short_description: product.short_description ?? '',
    description: product.description ?? '',
    price: product.price ?? 0,
    discount_price: product.discount_price ?? '',
    stock: product.stock ?? 0,
    images: Array.isArray(product.images) ? [...product.images] : [],
    thumbnail: product.thumbnail ?? '',
    tags: Array.isArray(product.tags) ? [...product.tags] : [],
    status: product.status ?? 'active',
    featured: Boolean(product.featured),
    bestseller: Boolean(product.bestseller),
    seo_title: product.seo_title ?? '',
    seo_description: product.seo_description ?? '',
    origin: product.origin ?? '',
  };
}

/** @param {typeof EMPTY_PRODUCT_FORM} form */
export function formToPayload(form) {
  const discount = form.discount_price === '' || form.discount_price == null
    ? null
    : Number(form.discount_price);

  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    category: form.category.trim(),
    subcategory: form.subcategory?.trim() || null,
    brand: form.brand?.trim() || null,
    sku: form.sku?.trim() || null,
    short_description: form.short_description?.trim() || null,
    description: form.description?.trim() || null,
    price: Number(form.price),
    discount_price: discount,
    stock: Number(form.stock) || 0,
    images: form.images.filter(Boolean),
    thumbnail: form.thumbnail?.trim() || null,
    tags: form.tags.filter(Boolean),
    status: form.status,
    featured: Boolean(form.featured),
    bestseller: Boolean(form.bestseller),
    seo_title: form.seo_title?.trim() || null,
    seo_description: form.seo_description?.trim() || null,
    origin: form.origin?.trim() || null,
  };
}

export function getProductThumbnail(product) {
  if (!product) return null;
  return product.thumbnail || (Array.isArray(product.images) && product.images[0]) || null;
}
