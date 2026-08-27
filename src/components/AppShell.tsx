import { Outlet } from 'react-router-dom';
import { BottomNav } from '@app/components/BottomNav';

/** Page frame shared by every route. Pages render their own SiteHeader (title and progress differ per page). */
export function AppShell() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-narrative antialiased">
      <Outlet />
      <BottomNav />
    </div>
  );
}
