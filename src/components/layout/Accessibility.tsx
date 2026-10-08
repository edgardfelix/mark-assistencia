import styled, { keyframes } from 'styled-components';
import { useNavigation } from 'react-router';
import { a11y } from '@/content/common';
import { color, font, motion, radius, rgb, space, zIndex } from '@/theme/tokens';
import { VisuallyHidden } from '../ui/Layout';

/** First focusable element: jumps keyboard users past the header. */
export function SkipLink() {
  return <SkipAnchor href="#conteudo">{a11y.skipToContent}</SkipAnchor>;
}

const SkipAnchor = styled.a`
  position: fixed;
  top: ${space[3]};
  left: ${space[3]};
  z-index: ${zIndex.modal};
  padding: ${space[3]} ${space[5]};
  border-radius: ${radius.pill};
  font-weight: ${font.weight.semibold};
  color: ${color.onBrand};
  background: ${color.brand};
  transform: translateY(-160%);
  transition: transform 0.3s ${motion.css.out};

  &:focus-visible {
    transform: none;
  }
`;

/** Announces client-side page changes to screen readers (not the initial load). */
export function RouteAnnouncer({ title }: { title: string }) {
  return (
    <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
      {a11y.routeChanged(title)}
    </VisuallyHidden>
  );
}

/**
 * Thin top bar while a route's code is still loading. It only becomes visible
 * after 200 ms (CSS delay), so fast navigations never flash it.
 */
export function NavigationProgress() {
  const navigation = useNavigation();
  if (navigation.state === 'idle') return null;
  return (
    <Track role="progressbar" aria-label={a11y.pageLoading}>
      <Bar />
    </Track>
  );
}

const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const travel = keyframes`
  0% { transform: translateX(-100%) scaleX(0.4); }
  50% { transform: translateX(10%) scaleX(0.6); }
  100% { transform: translateX(110%) scaleX(0.4); }
`;

const Track = styled.div`
  position: fixed;
  inset: 0 0 auto;
  z-index: ${zIndex.progress};
  height: 2px;
  overflow: hidden;
  animation: ${appear} 0.2s linear 0.2s both;
`;

const Bar = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, ${color.brand}, transparent);
  box-shadow: 0 0 12px rgba(${rgb.brand}, 0.8);
  animation: ${travel} 1.1s ${motion.css.inOut} infinite;
`;
