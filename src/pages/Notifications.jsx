import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, ShoppingCart, AlertCircle, CreditCard, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockNotifications = [
  { id: 1, type: 'order', title: 'New Order Received', message: 'Order #ORD-8902 has been placed by Olivia Martin.', time: '2 mins ago', unread: true, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 2, type: 'alert', title: 'Low Stock Alert', message: 'Mechanical Keyboard (MK-002) is running low on stock.', time: '1 hour ago', unread: true, icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 3, type: 'payment', title: 'Payment Successful', message: 'Subscription renewal for Professional Plan was successful.', time: '4 hours ago', unread: false, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 4, type: 'inventory', title: 'Inventory Restocked', facility: 'Warehouse A', message: 'USB-C Cable (2m) has been restocked with 500 units.', time: '1 day ago', unread: false, icon: Box, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 5, type: 'order', title: 'Order Shipped', message: 'Order #ORD-8900 has been shipped to customer.', time: '2 days ago', unread: false, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
];

export default function Notifications() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with important alerts and events.</p>
        </div>
        <Button variant="outline" className="border-white/10">Mark all as read</Button>
      </div>

      <Card className="glass-card border-none overflow-hidden">
        <div className="divide-y divide-white/5">
          {mockNotifications.map((notification, i) => (
            <motion.div 
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={cn(
                "p-4 sm:p-6 hover:bg-white/5 transition-colors flex gap-4 relative",
                notification.unread && "bg-white/[0.02]"
              )}
            >
              {notification.unread && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
              )}
              
              <div className={cn("mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center", notification.bg)}>
                <notification.icon className={cn("h-5 w-5", notification.color)} />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={cn("font-semibold", notification.unread ? "text-foreground" : "text-muted-foreground")}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{notification.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
