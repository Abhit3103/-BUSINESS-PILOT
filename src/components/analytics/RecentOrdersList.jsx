import { Link } from 'react-router-dom';
import { formatINR } from '@/lib/formatINR';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function statusVariant(status) {
  const map = { pending: 'warning', shipped: 'info', delivered: 'success', cancelled: 'destructive' };
  return map[status] || 'default';
}

export function RecentOrdersList({ orders = [] }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-zinc-100">Recent orders</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/orders" className="text-orange-400 hover:text-orange-300">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-500">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                <div>
                  <p className="font-medium text-zinc-100">#{order.order_number || order.id}</p>
                  <p className="text-xs text-zinc-500">{order.customer_name || order.email || 'Guest'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  <span className="text-sm font-semibold text-zinc-100">{formatINR(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
