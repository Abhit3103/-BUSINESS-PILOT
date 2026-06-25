import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { AlertCircle, Box, CheckCircle2, TrendingDown } from 'lucide-react';

const mockInventory = [
  { id: 1, name: 'Wireless Headphones', sku: 'WH-001', stock: 124, capacity: 500, status: 'In Stock' },
  { id: 2, name: 'Mechanical Keyboard', sku: 'MK-002', stock: 12, capacity: 200, status: 'Low Stock' },
  { id: 3, name: 'Gaming Mouse', sku: 'GM-003', stock: 0, capacity: 150, status: 'Out of Stock' },
  { id: 4, name: 'USB-C Cable (2m)', sku: 'UC-004', stock: 850, capacity: 1000, status: 'In Stock' },
];

export default function Inventory() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground mt-1">Track your product stock levels and restock alerts.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-none bg-gradient-to-br from-background/60 to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,432</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-none bg-gradient-to-br from-background/60 to-yellow-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">24</div>
            <p className="text-xs text-muted-foreground mt-1">Items below threshold</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-none bg-gradient-to-br from-background/60 to-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">7</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate restock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {mockInventory.map((item, index) => {
          const percentage = (item.stock / item.capacity) * 100;
          let colorClass = 'bg-primary';
          if (item.status === 'Low Stock') colorClass = 'bg-yellow-500';
          if (item.status === 'Out of Stock') colorClass = 'bg-destructive';

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="glass-card border-none p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">{item.stock} / {item.capacity}</div>
                      <Badge variant={
                        item.status === 'In Stock' ? 'success' : 
                        item.status === 'Low Stock' ? 'warning' : 'destructive'
                      } className="mt-1">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 h-3 w-full bg-background/50 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                    className={`h-full rounded-full ${colorClass} shadow-[0_0_10px_rgba(var(--primary),0.5)]`}
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
