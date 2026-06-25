import { formatINR } from '@/lib/formatINR';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export function TopProductsList({ products = [] }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/80">
      <CardHeader>
        <CardTitle className="text-zinc-100">Top selling products</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-zinc-500">No order line items yet. Sales rank appears after orders include items.</p>
        ) : (
          <ul className="space-y-3">
            {products.map((item, index) => (
              <li key={item.name} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-bold text-orange-400">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-100">{item.name}</p>
                  <p className="text-xs text-zinc-500">{item.quantity} units sold</p>
                </div>
                <span className="text-sm font-semibold text-orange-400">{formatINR(item.revenue)}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function TopProductsEmpty() {
  return <Package className="h-5 w-5 text-zinc-500" />;
}
