import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { a11y, whatsappMessages } from '@/content/common';
import { track } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/links';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, motion, rgb, zIndex } from '@/theme/tokens';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { VisuallyHidden } from '../ui/Layout';

/**
 * Persistent WhatsApp access on phones and tablets only (the desktop header
 * already carries the CTA). Appears once the hero CTA has scrolled away and is
 * omitted on the contact page, where WhatsApp is the primary action.
 */
export function FloatingWhatsApp() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setPastHero(y > window.innerHeight * 0.7);
  });

  const show = pastHero && pathname !== paths.contact;

  return (
    <AnimatePresence>
      {show && (
        <Fab
          key="fab"
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 16 }}
          transition={{ duration: 0.45, ease: motion.ease.out }}
        >
          <a
            href={whatsappUrl(whatsappMessages.general)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track({ name: 'whatsapp_click', placement: 'floating' });
            }}
          >
            <WhatsAppIcon size={26} />
            <VisuallyHidden>Conversar no WhatsApp {a11y.opensInNewTab}</VisuallyHidden>
          </a>
        </Fab>
      )}
    </AnimatePresence>
  );
}

const Fab = styled(m.div)`
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: ${zIndex.floating};

  a {
    display: grid;
    place-items: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    color: ${color.onBrand};
    background: ${color.brand};
    box-shadow:
      0 0 0 1px rgba(${rgb.brand}, 0.6),
      0 12px 32px -8px rgba(0, 0, 0, 0.8),
      0 0 28px -6px rgba(${rgb.brand}, 0.7);
  }

  a:active {
    background: ${color.brandPressed};
  }

  ${media.up('lg')} {
    display: none;
  }
`;
