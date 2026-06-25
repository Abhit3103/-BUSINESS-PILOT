import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/common/PageHeader';
import { Skeleton } from '@/components/common/Skeleton';
import { FormSection } from '@/components/products/FormSection';
import { ImageUploader } from '@/components/products/ImageUploader';
import { EMPTY_PRODUCT_FORM, PRODUCT_STATUSES, formToPayload, productToForm } from '@/lib/productDefaults';
import { slugify } from '@/lib/slug';
import { formatINR, parseAmount } from '@/lib/formatINR';
import { createProduct, getProduct, updateProduct } from '@/services/productsService';
import { useToast } from '@/context/ToastContext';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ ...EMPTY_PRODUCT_FORM });
  const [slugManual, setSlugManual] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const product = await getProduct(id);
        setForm(productToForm(product));
        setSlugManual(true);
      } catch {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate, toast]);

  const setField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !slugManual) {
        next.slug = slugify(value);
      }
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Product name is required';
    if (!form.slug.trim()) next.slug = 'Slug is required';
    if (!form.category.trim()) next.category = 'Category is required';
    if (parseAmount(form.price) <= 0) next.price = 'Price must be greater than 0';
    if (form.discount_price !== '' && parseAmount(form.discount_price) >= parseAmount(form.price)) {
      next.discount_price = 'Discount must be less than price';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) return;
    setField('tags', [...form.tags, tag]);
    setTagInput('');
  };

  const removeTag = (tag) => setField('tags', form.tags.filter((t) => t !== tag));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix validation errors');
      return;
    }
    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (isEdit) {
        await updateProduct(id, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      navigate('/products');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || err.message || 'Save failed';
      toast.error(typeof msg === 'string' ? msg : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const displayPrice = parseAmount(form.discount_price || form.price);

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-12">
      <PageHeader
        title={isEdit ? 'Edit product' : 'Create product'}
        description="Full catalog fields mapped to your backend schema."
        actions={(
          <>
            <Button type="button" variant="outline" asChild className="border-zinc-700">
              <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
            </Button>
            <Button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? 'Saving...' : 'Save product'}
            </Button>
          </>
        )}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FormSection title="Basic information" description="Name, identifiers, and categorization">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name *" error={errors.name}>
                <Input value={form.name} onChange={(e) => setField('name', e.target.value)} className="border-zinc-700 bg-zinc-950" />
              </Field>
              <Field label="Slug *" error={errors.slug}>
                <Input
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setField('slug', e.target.value); }}
                  className="border-zinc-700 bg-zinc-950"
                />
              </Field>
              <Field label="Brand">
                <Input value={form.brand} onChange={(e) => setField('brand', e.target.value)} className="border-zinc-700 bg-zinc-950" />
              </Field>
              <Field label="SKU">
                <Input value={form.sku} onChange={(e) => setField('sku', e.target.value)} className="border-zinc-700 bg-zinc-950" />
              </Field>
              <Field label="Category *" error={errors.category}>
                <Input value={form.category} onChange={(e) => setField('category', e.target.value)} className="border-zinc-700 bg-zinc-950" />
              </Field>
              <Field label="Subcategory">
                <Input value={form.subcategory} onChange={(e) => setField('subcategory', e.target.value)} className="border-zinc-700 bg-zinc-950" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Descriptions" description="Short summary and full product copy">
            <Field label="Short description">
              <Textarea
                value={form.short_description}
                onChange={(e) => setField('short_description', e.target.value)}
                className="min-h-[80px] border-zinc-800 bg-zinc-950"
                placeholder="Brief summary for listings..."
              />
            </Field>
            <Field label="Full description">
              <Textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                className="min-h-[220px] border-zinc-800 bg-zinc-950 font-normal leading-relaxed"
                placeholder="Detailed product description for your storefront..."
              />
            </Field>
          </FormSection>

          <FormSection title="Images" description="Thumbnail and gallery — URLs stored in database">
            <ImageUploader
              thumbnail={form.thumbnail}
              images={form.images}
              onThumbnailChange={(v) => setField('thumbnail', v)}
              onImagesChange={(v) => setField('images', v)}
            />
          </FormSection>

          <FormSection title="SEO & origin">
            <Field label="SEO title">
              <Input value={form.seo_title} onChange={(e) => setField('seo_title', e.target.value)} className="border-zinc-700 bg-zinc-950" />
            </Field>
            <Field label="SEO description">
              <Textarea value={form.seo_description} onChange={(e) => setField('seo_description', e.target.value)} className="min-h-[100px] border-zinc-800 bg-zinc-950" />
            </Field>
            <Field label="Origin">
              <Input value={form.origin} onChange={(e) => setField('origin', e.target.value)} placeholder="e.g. India" className="border-zinc-700 bg-zinc-950" />
            </Field>
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="Pricing & inventory">
            <Field label="Price (INR) *" error={errors.price}>
              <Input type="number" min="0" step="1" value={form.price} onChange={(e) => setField('price', e.target.value)} className="border-zinc-700 bg-zinc-950" />
            </Field>
            <Field label="Discount price (INR)" error={errors.discount_price}>
              <Input type="number" min="0" step="1" value={form.discount_price} onChange={(e) => setField('discount_price', e.target.value)} className="border-zinc-700 bg-zinc-950" placeholder="Optional" />
            </Field>
            <Field label="Stock quantity">
              <Input type="number" min="0" value={form.stock} onChange={(e) => setField('stock', e.target.value)} className="border-zinc-700 bg-zinc-950" />
            </Field>
            <div className="rounded-xl bg-orange-500/10 px-4 py-3 text-sm">
              <span className="text-zinc-400">Customer sees: </span>
              <span className="font-bold text-orange-400">{formatINR(displayPrice)}</span>
            </div>
          </FormSection>

          <FormSection title="Visibility & tags">
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setField('status', e.target.value)}>
                {PRODUCT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </Field>
            <Switch label="Featured product" checked={form.featured} onCheckedChange={(v) => setField('featured', v)} />
            <Switch label="Bestseller" checked={form.bestseller} onCheckedChange={(v) => setField('bestseller', v)} />
            <Field label="Tags">
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="border-zinc-700 bg-zinc-950" placeholder="Add tag" />
                <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200">
                    {tag}
                    <button type="button" className="text-zinc-500 hover:text-red-400" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            </Field>
          </FormSection>
        </div>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
