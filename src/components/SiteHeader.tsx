import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Icon } from '@app/components/Icon';
import { SearchOverlay } from '@app/components/SearchOverlay';
import { useAuth } from '@app/lib/auth';

const NAV: { label: string; to: string }[] = [
  { label: 'Journey', to: ROUTES.studyHome },
  { label: 'Waypoints', to: ROUTES.waypoints },
  { label: 'Reflections', to: ROUTES.reflection },
  { label: 'Community', to: ROUTES.community },
  { label: 'Lexicon', to: ROUTES.lexicon },
];

export function SiteHeader({ title = 'Walk Before Me', progress = 0 }: { title?: string; progress?: number }) {
  const { user, displayName } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-navy border-b-2 border-gold relative">
        <div className="max-w-container mx-auto h-16 px-margin-mobile md:px-0 flex items-center justify-between">
          <div className="flex items-center gap-4 shrink-0 whitespace-nowrap">
            <Icon name="menu" className="text-gold md:hidden" />
            <NavLink to={ROUTES.landing} className="font-chrome text-[12px] font-bold uppercase tracking-[0.2em] text-gold hover:text-secondary">Emmaus Road</NavLink>
            <span className="text-outline-variant hidden md:inline">|</span>
            <span className="font-chrome text-[14px] font-bold uppercase tracking-[0.12em] text-parchment hidden md:inline">{title}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end className={({ isActive }) => `font-chrome text-[12px] font-bold uppercase tracking-[0.1em] ${isActive ? 'text-gold border-b-2 border-gold pb-1' : 'text-on-surface-variant'}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hidden md:inline-block text-gold hover:text-secondary">
              <Icon name="search" />
            </button>
            <NavLink to={ROUTES.profile} aria-label="Profile" className="flex flex-col items-center gap-0.5">
              <Icon name="account_circle" filled className="text-gold" />
              {user && displayName && (
                <span className="font-chrome text-[9px] font-bold uppercase tracking-[0.05em] text-gold leading-none">{displayName}</span>
              )}
            </NavLink>
          </div>
        </div>
        <div className="absolute left-0 -bottom-[2px] h-[2px] bg-secondary" style={{ width: `${Math.round(progress * 100)}%` }} aria-hidden="true" />
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
