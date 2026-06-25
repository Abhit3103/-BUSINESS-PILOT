import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import { formatINR } from '@/lib/formatINR';

const mockCustomers = [
  { id: 'CUS-001', name: 'Olivia Martin', email: 'olivia.martin@email.com', orders: 12, total: formatINR(129900), status: 'Active', avatar: 'OM' },
  { id: 'CUS-002', name: 'Jackson Lee', email: 'jackson.lee@email.com', orders: 5, total: formatINR(45050), status: 'Active', avatar: 'JL' },
  { id: 'CUS-003', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', orders: 1, total: formatINR(12000), status: 'Inactive', avatar: 'IN' },
  { id: 'CUS-004', name: 'William Chen', email: 'william.chen@email.com', orders: 24, total: formatINR(340000), status: 'Active', avatar: 'WC' },
  { id: 'CUS-005', name: 'Sophia Smith', email: 'sophia.smith@email.com', orders: 3, total: formatINR(29999), status: 'Active', avatar: 'SS' },
];

export default function Customers() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships and view their purchase history.</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card className="glass-card border-none">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-9 bg-background/50 border-white/5" />
          </div>
          <Button variant="outline" className="hidden sm:flex border-white/10">Filter</Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer, i) => (
              <TableRow key={customer.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                      {customer.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell>{customer.total}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
