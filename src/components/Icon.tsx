interface IconProps {
  /** Material Symbols name, e.g. "menu_book" */
  name: string;
  filled?: boolean;
  className?: string;
  size?: number;
}

/** Material Symbols Outlined glyph. The font is loaded in index.html. */
export function Icon({ name, filled = false, className = '', size = 24 }: IconProps) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${filled ? 'is-filled' : ''} ${className}`} style={{ fontSize: size }}>
      {name}
    </span>
  );
}
