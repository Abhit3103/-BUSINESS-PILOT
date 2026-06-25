import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileText, Download, FileSpreadsheet, FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reports() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and download comprehensive data reports.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileIcon className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold">PDF Report</h3>
              <p className="text-sm text-muted-foreground mt-1">Download monthly summary in PDF format.</p>
            </div>
            <Button variant="outline" className="w-full mt-4 border-white/10 group-hover:bg-red-500/10 group-hover:text-red-400 group-hover:border-red-500/20">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold">Excel Export</h3>
              <p className="text-sm text-muted-foreground mt-1">Detailed transaction logs in Excel format.</p>
            </div>
            <Button variant="outline" className="w-full mt-4 border-white/10 group-hover:bg-green-500/10 group-hover:text-green-400 group-hover:border-green-500/20">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">CSV Data</h3>
              <p className="text-sm text-muted-foreground mt-1">Raw customer and product data for import.</p>
            </div>
            <Button variant="outline" className="w-full mt-4 border-white/10 group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/20">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="pt-8">
        <h2 className="text-xl font-semibold mb-4">Scheduled Reports</h2>
        <EmptyState 
          icon={FileText} 
          title="No scheduled reports" 
          description="You haven't scheduled any automated reports yet. Set one up to receive data periodically via email."
          actionLabel="Create Schedule"
          onAction={() => {}}
        />
      </div>
    </motion.div>
  );
}
