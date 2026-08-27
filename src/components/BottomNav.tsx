import { NavLink } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Icon } from '@app/components/Icon';

const TABS = [
  { label: 'Journey', icon: 'auto_stories', to: ROUTES.studyHome },
  { label: 'Waypoints', icon: 'explore', to: ROUTES.waypoints },
  { label: 'Reflections', icon: 'edit_note', to: ROUTES.reflection },
  { label: 'Community', icon: 'group', to: ROUTES.community },
];

/** Mobile-only fixed bottom navigation (four tabs; the Stitch export used four different tab sets, this is the unified one). */
export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface border-t border-outline-variant grid grid-cols-4" aria-label="Sections">
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `flex flex-col items-center justify-center h-20 gap-1 ${isActive ? 'text-secondary border-t-2 border-secondary' : 'text-on-surface-variant'}`}>
          {({ isActive }) => (
            <>
              <Icon name={tab.icon} filled={isActive} />
              <span className="font-chrome text-[10px] uppercase tracking-[0.15em]">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
