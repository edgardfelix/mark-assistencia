import { type ReactNode } from 'react';
import { smoothScroll } from '@/lib/smooth-scroll';

interface JumpLinkProps {
  targetId: string;
  className?: string;
  children: ReactNode;
}

/**
 * In-page anchor that scrolls smoothly (or instantly with reduced motion) and
 * then moves keyboard focus to the target section, so tabbing continues there.
 */
export function JumpLink({ targetId, className, children }: JumpLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={className}
      onClick={(event) => {
        const target = document.getElementById(targetId);
        if (!target) return;
        event.preventDefault();
        smoothScroll.scrollTo(target, { offset: -96 });
        window.history.replaceState(window.history.state, '', `#${targetId}`);
        target.focus({ preventScroll: true });
      }}
    >
      {children}
    </a>
  );
}
