import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '@app/components/Icon';

export type ButtonStyle = 'primary' | 'outline' | 'navy';

const STYLES: Record<ButtonStyle, string> = {
  primary: 'bg-secondary text-on-secondary',
  outline: 'border border-gold text-gold',
  navy: 'bg-navy text-white border border-gold',
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  label: string;
  /** Visual style (not CSS style). */
  style?: ButtonStyle;
  icon?: string;
}

/** DESIGN.md buttons: 0px radius, uppercase Space Grotesk label, optional trailing icon. */
export function Button({ label, style = 'primary', icon = 'arrow_forward', className = '', ...rest }: ButtonProps) {
  return (
    <button type="button" className={`inline-flex items-center gap-2 font-chrome text-[14px] font-bold uppercase tracking-[0.1em] px-6 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary ${STYLES[style]} ${className}`} {...rest}>
      {label}
      {icon ? <Icon name={icon} size={18} /> : null}
    </button>
  );
}
