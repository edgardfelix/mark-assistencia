import { Clock, MapPin, X } from 'lucide-react';
import { type CSSProperties, useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import { a11y, cta } from '@/content/common';
import { primaryNav } from '@/content/navigation';
import { display } from '@/lib/format';
import { smoothScroll } from '@/lib/smooth-scroll';
import { queries } from '@/theme/media';
import { color, font, layout, motion, rgb, space } from '@/theme/tokens';
import { PhoneButton, WhatsAppButton } from '../common/ContactActions';
import { Container, VisuallyHidden } from '../ui/Layout';
import { Logo } from '../ui/Logo';

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

/**
 * Native modal <dialog>: focus is trapped and restored by the browser, Escape
 * closes it and the page behind becomes inert. Animations use @starting-style.
 */
export function MobileMenu({ id, open, onClose }: MobileMenuProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      smoothScroll.stop();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // The menu only exists below the desktop breakpoint: close it if the viewport grows past it.
  useEffect(() => {
    const desktop = window.matchMedia(queries.up('lg'));
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    desktop.addEventListener('change', handleChange);
    return () => {
      desktop.removeEventListener('change', handleChange);
    };
  }, [onClose]);

  return (
    <Dialog
      ref={ref}
      id={id}
      aria-label="Menu"
      onClose={() => {
        smoothScroll.start();
        onClose();
      }}
    >
      <Panel>
        <Top $wide>
          <Logo width={112} loading="lazy" />
          <CloseButton type="button" onClick={onClose}>
            <X size={22} aria-hidden="true" />
            <VisuallyHidden>{a11y.closeMenu}</VisuallyHidden>
          </CloseButton>
        </Top>

        <Body $wide>
          <nav aria-label={a11y.mainNav}>
            <Links>
              {primaryNav.map((item, index) => (
                <li key={item.to} style={{ '--i': index } as CSSProperties}>
                  <MenuLink to={item.to} end={item.to === '/'} onClick={onClose}>
                    <Index aria-hidden="true">{String(index + 1).padStart(2, '0')}</Index>
                    {item.label}
                  </MenuLink>
                </li>
              ))}
            </Links>
          </nav>

          <Footer>
            <Actions>
              <WhatsAppButton placement="mobile-menu" message="general" block>
                {cta.whatsapp}
              </WhatsAppButton>
              <PhoneButton placement="mobile-menu" variant="secondary" block>
                {`${cta.call} ${display.phone}`}
              </PhoneButton>
            </Actions>
            <Meta>
              <span>
                <MapPin size={16} aria-hidden="true" /> {display.addressLine1} · {display.addressLine2}
              </span>
              <span>
                <Clock size={16} aria-hidden="true" /> Atendimento das {display.hours}
              </span>
            </Meta>
          </Footer>
        </Body>
      </Panel>
    </Dialog>
  );
}

const Dialog = styled.dialog`
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-12px);
  transition:
    opacity 0.35s ${motion.css.out},
    transform 0.5s ${motion.css.out},
    overlay 0.5s allow-discrete,
    display 0.5s allow-discrete;

  &[open] {
    opacity: 1;
    transform: none;
  }

  @starting-style {
    &[open] {
      opacity: 0;
      transform: translateY(-12px);
    }
  }

  &::backdrop {
    background: rgba(${rgb.ink}, 0.6);
  }
`;

const Panel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-top: env(safe-area-inset-top);
  padding-bottom: max(${space[6]}, env(safe-area-inset-bottom));
  background: radial-gradient(90% 60% at 100% 0%, rgba(${rgb.brand}, 0.12), transparent 60%), ${color.glassStrong};
  backdrop-filter: blur(24px) saturate(1.3);
  -webkit-backdrop-filter: blur(24px) saturate(1.3);
`;

const Top = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: ${layout.headerHeight};
`;

const CloseButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: rgba(${rgb.white}, 0.06);
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
`;

const Body = styled(Container)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${space[10]};
  padding-top: ${space[8]};
`;

const Links = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    border-bottom: 1px solid ${color.line};
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 0.5s ${motion.css.out},
      transform 0.6s ${motion.css.out};
    transition-delay: calc(0.06s * var(--i) + 0.08s);
  }

  dialog[open] & li {
    opacity: 1;
    transform: none;
  }

  @starting-style {
    dialog[open] & li {
      opacity: 0;
      transform: translateY(14px);
    }
  }
`;

const MenuLink = styled(NavLink)`
  display: flex;
  align-items: baseline;
  gap: ${space[4]};
  padding-block: ${space[4]};
  font-size: clamp(1.75rem, 1.2rem + 3vw, 2.5rem);
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.tight};
  color: ${color.textMuted};
  transition: color 0.3s;

  &.active {
    color: ${color.text};
  }

  &.active > span {
    color: ${color.brand};
  }
`;

const Index = styled.span`
  font-size: ${font.size.caption};
  font-weight: ${font.weight.medium};
  letter-spacing: ${font.tracking.wide};
  color: ${color.textSubtle};
  font-variant-numeric: tabular-nums;
`;

const Footer = styled.div`
  display: grid;
  gap: ${space[6]};
`;

const Actions = styled.div`
  display: grid;
  gap: ${space[3]};
`;

const Meta = styled.div`
  display: grid;
  gap: ${space[2]};
  font-size: ${font.size.caption};
  color: ${color.textSubtle};

  span {
    display: inline-flex;
    align-items: center;
    gap: ${space[2]};
  }
`;
