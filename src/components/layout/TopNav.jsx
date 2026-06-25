import { Menu, Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

export function TopNav({ toggleMobileSidebar }) {
  const { user } = useAuth();
  
  // Format current date e.g., "Monday, Oct 24"
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const initials = (user?.email?.[0] || user?.full_name?.[0] || 'A').toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-background/60 backdrop-blur-2xl px-6 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:flex items-center relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search anything..." 
            className="pl-10 h-10 rounded-full bg-black/20 border-white/5 hover:border-white/10 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:block text-sm font-medium text-muted-foreground">
          {currentDate}
        </div>
        
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full border border-white/5 bg-card/50 hover:bg-white/10">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
        </Button>

        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-foreground leading-none">{user?.full_name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground mt-1">{user?.email || 'admin@mokshita.com'}</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-sm font-bold text-white shadow-lg shadow-primary/20 ring-2 ring-background hover:ring-primary/50 transition-all">
            {initials}
          </button>
        </div>
      </div>
    </header>
  );
}
