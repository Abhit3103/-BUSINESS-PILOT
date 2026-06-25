import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';

export const AdminLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check if screen is mobile size to manage responsive state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen} 
        isMobile={isMobile}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopNav toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto bg-background/50 relative">
          {/* Subtle background glow effect for premium feel */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 p-6 lg:p-8 max-w-[1600px] mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
