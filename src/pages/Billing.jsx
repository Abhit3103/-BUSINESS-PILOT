import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { Check, CreditCard, Download, Zap } from 'lucide-react';

import { formatINR } from '@/lib/formatINR';

const mockInvoices = [
  { id: 'INV-001', date: 'Oct 24, 2026', amount: formatINR(4900), status: 'Paid' },
  { id: 'INV-002', date: 'Sep 24, 2026', amount: formatINR(4900), status: 'Paid' },
  { id: 'INV-003', date: 'Aug 24, 2026', amount: formatINR(4900), status: 'Paid' },
];

export default function Billing() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your billing information and subscription plans.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Current Plan */}
        <Card className="glass-card border-none lg:col-span-2 bg-gradient-to-br from-primary/10 to-purple-600/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Professional Plan
            </CardTitle>
            <CardDescription>You are currently on the Professional plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">{formatINR(4900)}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">API Requests</span>
                  <span className="text-muted-foreground">45,000 / 100,000</span>
                </div>
                <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Storage Used</span>
                  <span className="text-muted-foreground">12GB / 50GB</span>
                </div>
                <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '24%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <Button>Upgrade Plan</Button>
            <Button variant="outline" className="border-white/10">Cancel Subscription</Button>
          </CardFooter>
        </Card>

        {/* Payment Methods */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Primary payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
              <CreditCard className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/28</p>
              </div>
              <Badge variant="default" className="hidden sm:inline-flex">Default</Badge>
            </div>
            <Button variant="outline" className="w-full border-white/10">Add Payment Method</Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Billing History</h2>
        <Card className="glass-card border-none">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice, i) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="success">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="space-y-4 pt-8 border-t border-white/5">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Pricing Plans</h2>
          <p className="text-muted-foreground">Choose the perfect plan for your business.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Starter */}
          <Card className="glass-card border-none relative opacity-70 hover:opacity-100 transition-opacity">
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <div className="text-3xl font-bold mt-2">{formatINR(1900)}<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 5 users</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 10GB Storage</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Support</li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Pro */}
          <Card className="glass-card border-primary/50 relative scale-105 shadow-2xl shadow-primary/10 bg-gradient-to-b from-primary/10 to-transparent">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <div className="text-3xl font-bold mt-2">{formatINR(4900)}<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2 text-foreground"><Check className="h-4 w-4 text-primary" /> Unlimited users</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="h-4 w-4 text-primary" /> 50GB Storage</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="h-4 w-4 text-primary" /> Advanced Analytics</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>Current Plan</Button>
            </CardFooter>
          </Card>
          
          {/* Enterprise */}
          <Card className="glass-card border-none relative opacity-70 hover:opacity-100 transition-opacity">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="text-3xl font-bold mt-2">{formatINR(19900)}<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom limits</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Storage</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 24/7 Dedicated Support</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom integrations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
