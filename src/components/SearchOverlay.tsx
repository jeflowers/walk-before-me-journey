import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { PSALM_26, COMMUNITY_REFLECTIONS } from '@app/data/psalm26';
import { Icon } from '@app/components/Icon';

interface SearchResult {
  category: 'Waypoint' | 'Lexicon' | 'Reflection' | 'Community';
  title: string;
  subtitle: string;
  icon: string;
  to: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const wp of PSALM_26.waypoints) {
    results.push({
      category: 'Waypoint',
      title: `${wp.numeral}. ${wp.name}`,
      subtitle: `${wp.verses} — ${wp.summary}`,
      icon: 'flag',
      to: ROUTES.waypoint.replace(':number', String(wp.number)),
    });
  }

  for (const entry of PSALM_26.lexicon) {
    results.push({
      category: 'Lexicon',
      title: entry.term,
      subtitle: `${entry.language} — ${entry.transliteration}`,
      icon: 'menu_book',
      to: ROUTES.lexicon,
    });
  }

  for (const prompt of PSALM_26.reflectionPrompts) {
    results.push({
      category: 'Reflection',
      title: prompt.label,
      subtitle: prompt.prompt,
      icon: 'lightbulb',
      to: ROUTES.reflection,
    });
  }

  results.push({
    category: 'Reflection',
    title: PSALM_26.prayerPrompt.label,
    subtitle: PSALM_26.prayerPrompt.prompt,
    icon: 'lightbulb',
    to: ROUTES.reflection,
  });

  for (const post of COMMUNITY_REFLECTIONS) {
    results.push({
      category: 'Community',
      title: `${post.author} — ${post.tag}`,
      subtitle: post.quote.slice(0, 120),
      icon: 'group',
      to: ROUTES.community,
    });
  }

  return results;
}

const ALL_RESULTS = buildIndex();

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const terms = query.toLowerCase().split(/\s+/);
    return ALL_RESULTS.filter((r) => {
      const hay = `${r.category} ${r.title} ${r.subtitle}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [query]);

  function handleSelect(result: SearchResult) {
    onClose();
    navigate(result.to);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search">
      <div className="max-w-container w-full mx-auto px-margin-mobile md:px-0 pt-6">
        <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
          <Icon name="search" className="text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search waypoints, lexicon, reflections, community..."
            className="flex-1 bg-transparent text-body-lg text-on-surface placeholder:text-outline-variant font-narrative outline-none"
          />
          <button onClick={onClose} aria-label="Close search" className="text-on-surface-variant hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
            <Icon name="close" />
          </button>
        </div>

        <div className="mt-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {query.trim() && filtered.length === 0 && (
            <p className="font-narrative text-body-md text-on-surface-variant text-center py-12">No results found for "{query}"</p>
          )}

          {!query.trim() && (
            <div className="py-12 text-center">
              <p className="font-narrative text-body-md text-on-surface-variant">Start typing to search across your study</p>
            </div>
          )}

          {filtered.length > 0 && (
            <ul className="flex flex-col gap-1">
              {filtered.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-start gap-4 p-4 text-left hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary border border-transparent hover:border-outline-variant"
                  >
                    <Icon name={r.icon} className="text-secondary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-chrome text-[10px] uppercase tracking-[0.15em] text-secondary">{r.category}</span>
                      </div>
                      <p className="font-chrome text-body-md text-on-surface mt-1 truncate">{r.title}</p>
                      <p className="font-narrative text-[14px] text-on-surface-variant mt-0.5 line-clamp-2">{r.subtitle}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
