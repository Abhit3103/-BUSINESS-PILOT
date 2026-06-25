import { useEffect, useMemo, useState } from 'react';
import { Search, Eye, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/Skeleton';
import { formatINR } from '@/lib/formatINR';
import { listOrders, updateOrderStatus } from '@/services/ordersService';
import { useToast } from '@/context/ToastContext';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

function statusVariant(status) {
  const map = { pending: 'warning', shipped: 'info', delivered: 'success', cancelled: 'destructive' };
  return map[status] || 'default';
}

function paymentVariant(status) {
  const s = (status || '').toLowerCase();
  if (s === 'paid' || s === 'completed') return 'success';
  if (s === 'failed') return 'destructive';
  return 'warning';
}

export default function Orders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await listOrders({ limit: 100 });
      setOrders(data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch = !q
        || String(o.id).includes(q)
        || String(o.order_number || '').toLowerCase().includes(q)
        || (o.email && o.email.toLowerCase().includes(q))
        || (o.customer_name && o.customer_name.toLowerCase().includes(q));
      const matchesTab = activeTab === 'all' || o.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, search, activeTab]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Manage customer orders, payment and fulfillment status." />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-xl bg-background/50 border border-white/5 p-1 backdrop-blur-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order #, email, name..."
            className="pl-9 bg-background/50 border-white/5"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card border-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total (INR)</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}><TableSkeleton rows={5} cols={1} /></TableCell></TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState icon={ShoppingBag} title="No orders" description="Orders will appear here after checkout." />
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-white/5 group hover:bg-white/5">
                  <TableCell className="font-medium">#{order.order_number || order.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{order.customer_name || 'Guest'}</p>
                    <p className="text-xs text-muted-foreground">{order.email || order.phone}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : '—'}
                  </TableCell>
                  <TableCell className="font-semibold">{formatINR(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={paymentVariant(order.payment_status)}>{order.payment_status || 'pending'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}>
                      <Eye className="mr-2 h-4 w-4" />View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Order #${selectedOrder?.order_number || selectedOrder?.id}`}>
        {selectedOrder && (
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-zinc-500">Customer</p>
                <p className="font-medium text-zinc-100">{selectedOrder.customer_name}</p>
                <p className="text-zinc-400">{selectedOrder.email}</p>
                <p className="text-zinc-400">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-zinc-500">Total</p>
                <p className="text-lg font-bold text-orange-400">{formatINR(selectedOrder.total)}</p>
                <p className="mt-1 text-zinc-500">Subtotal: {formatINR(selectedOrder.subtotal)} · Shipping: {formatINR(selectedOrder.shipping_cost)}</p>
              </div>
              <div>
                <p className="text-zinc-500">Payment</p>
                <Badge variant={paymentVariant(selectedOrder.payment_status)}>{selectedOrder.payment_status}</Badge>
                <p className="mt-1 text-zinc-400">{selectedOrder.payment_method}</p>
              </div>
              <div>
                <p className="text-zinc-500">Shipping address</p>
                <p className="text-zinc-300">{selectedOrder.address_line}</p>
                <p className="text-zinc-300">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}</p>
                <p className="text-zinc-300">{selectedOrder.country}</p>
              </div>
            </div>

            {selectedOrder.order_items?.length > 0 && (
              <div>
                <p className="mb-2 font-medium text-zinc-200">Items</p>
                <ul className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                  {selectedOrder.order_items.map((item, i) => (
                    <li key={i} className="flex justify-between text-zinc-300">
                      <span>{item.name || item.product_id} × {item.quantity}</span>
                      <span>{formatINR((item.price || item.price_at_time || 0) * (item.quantity || 1))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="mb-2 font-medium text-zinc-200">Update status</p>
              <div className="flex flex-wrap gap-2">
                {['pending', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selectedOrder.status === s ? 'default' : 'outline'}
                    className={selectedOrder.status === s ? 'bg-orange-500' : 'border-zinc-600'}
                    disabled={selectedOrder.status === s}
                    onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

