import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Box,
  BarChart3,
  CreditCard,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Hexagon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Box },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ open, setOpen, isMobile, setMobileOpen }) {
  const { logout } = useAuth();
  const [hovered, setHovered] = useState(null);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(false);
    } else {
      setOpen(!open);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isMobile ? (open ? 280 : 0) : (open ? 280 : 80),
        x: isMobile ? (open ? 0 : -280) : 0
      }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-background/80 backdrop-blur-2xl transition-all duration-300 lg:static",
        isMobile && !open && "pointer-events-none"
      )}
    >
      <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
            <Hexagon className="h-6 w-6" />
          </div>
          <motion.div
            animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
            className="flex flex-col whitespace-nowrap"
          >
            <span className="text-lg font-bold text-foreground tracking-tight">Mokshita</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Workspace</span>
          </motion.div>
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-white/5 bg-card hover:bg-white/10 shrink-0 ml-2"
            onClick={toggleSidebar}
          >
            {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-1 custom-scrollbar">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => isMobile && setMobileOpen(false)}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <motion.span
                  animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
                
                {/* Tooltip for collapsed state */}
                {!open && hovered === item.name && !isMobile && (
                  <div className="absolute left-14 rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in zoom-in-95 z-50">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            !open && "justify-center px-0"
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <motion.span
            animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
            className="ml-3 whitespace-nowrap overflow-hidden"
          >
            Logout
          </motion.span>
        </Button>
      </div>
    </motion.aside>
  );
}
