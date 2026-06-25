import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/Skeleton';
import { formatINR } from '@/lib/formatINR';
import { getProductThumbnail } from '@/lib/productDefaults';
import { listProducts, deleteProduct } from '@/services/productsService';
import { useToast } from '@/context/ToastContext';

const PAGE_SIZE = 10;

export default function Products() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listProducts({ page_size: 200, search: search || undefined });
      setProducts(data?.items || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch = !q
        || p.name?.toLowerCase().includes(q)
        || p.sku?.toLowerCase().includes(q)
        || p.category?.toLowerCase().includes(q);
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your full catalog with INR pricing and inventory."
        actions={(
          <Button asChild>
            <Link to="/products/new"><Plus className="mr-2 h-4 w-4" />Add product</Link>
          </Button>
        )}
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, SKU, category..."
            className="pl-9 bg-background/50 border-white/5"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="h-11 rounded-xl border border-white/10 bg-background/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-11 rounded-xl border border-white/10 bg-background/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="out_of_stock">Out of stock</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="glass-card border-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price (INR)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}><TableSkeleton rows={6} cols={1} /></TableCell></TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    icon={Package}
                    title="No products found"
                    description="Create your first product or adjust filters."
                    action={(
                      <Button asChild>
                        <Link to="/products/new">Add product</Link>
                      </Button>
                    )}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((product) => {
                const thumb = getProductThumbnail(product);
                return (
                  <TableRow key={product.id} className="border-white/5 group hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {thumb ? (
                          <img src={thumb} alt="" className="h-11 w-11 rounded-lg border border-zinc-700 object-cover" />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-zinc-100">{product.name}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {product.featured && <Badge variant="warning">Featured</Badge>}
                            {product.bestseller && <Badge variant="info">Bestseller</Badge>}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-300">{product.category}</TableCell>
                    <TableCell className={product.stock <= 5 ? 'text-amber-400 font-medium' : 'text-zinc-300'}>
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatINR(product.discount_price || product.price)}</p>
                      {product.discount_price != null && (
                        <p className="text-xs text-muted-foreground line-through">{formatINR(product.price)}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'active' ? 'success' : 'default'}>{product.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/products/${product.id}/edit`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(product.id, product.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
