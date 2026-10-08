import { Menu } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router';
import styled from 'styled-components';
import { a11y, cta } from '@/content/common';
import { primaryNav } from '@/content/navigation';
import { prefetchRoute } from '@/routes/prefetch';
import { media } from '@/theme/media';
import { color, font, layout, motion, rgb, space, zIndex } from '@/theme/tokens';
import { WhatsAppButton } from '../common/ContactActions';
import { ScrollProgress } from '../motion/ScrollProgress';
import { Container, VisuallyHidden } from '../ui/Layout';
import { Logo } from '../ui/Logo';
import { MobileMenu } from './MobileMenu';

interface SiteHeaderProps {
  /** True once the page has scrolled past the top sentinel. */
  solid: boolean;
}

export function SiteHeader({ solid }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <Bar data-solid={solid}>
      <Inner $wide>
        <HomeLink
          to="/"
          onPointerEnter={() => {
            prefetchRoute('/');
          }}
        >
          <Logo width={128} />
          <VisuallyHidden>, página inicial</VisuallyHidden>
        </HomeLink>

        <DesktopNav aria-label={a11y.mainNav}>
          <NavList>
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavItem
                  to={item.to}
                  end={item.to === '/'}
                  onPointerEnter={() => {
                    prefetchRoute(item.to);
                  }}
                  onFocus={() => {
                    prefetchRoute(item.to);
                  }}
                >
                  {item.label}
                </NavItem>
              </li>
            ))}
          </NavList>
        </DesktopNav>

        <Actions>
          <DesktopCta>
            <WhatsAppButton size="md" placement="header" message="general">
              <LabelFull>{cta.whatsapp}</LabelFull>
              <LabelShort>{cta.whatsappShort}</LabelShort>
            </WhatsAppButton>
          </DesktopCta>
          <MenuButton
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => {
              setMenuOpen(true);
            }}
          >
            <Menu size={22} aria-hidden="true" />
            <VisuallyHidden>{a11y.openMenu}</VisuallyHidden>
          </MenuButton>
        </Actions>
      </Inner>
      <ScrollProgress />
      <MobileMenu id="menu-mobile" open={menuOpen} onClose={closeMenu} />
    </Bar>
  );
}

const Bar = styled.header`
  position: fixed;
  inset: 0 0 auto;
  z-index: ${zIndex.header};
  height: ${layout.headerHeight};
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;

  /* Two stacked backgrounds cross-fade (opacity only) between states. */
  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    transition: opacity 0.5s ${motion.css.out};
  }

  &::before {
    background: linear-gradient(to bottom, rgba(${rgb.ink}, 0.75), rgba(${rgb.ink}, 0));
  }

  &::after {
    opacity: 0;
    background: ${color.glass};
    backdrop-filter: blur(18px) saturate(1.4);
    -webkit-backdrop-filter: blur(18px) saturate(1.4);
    box-shadow:
      inset 0 -1px 0 ${color.line},
      0 18px 40px -24px rgba(0, 0, 0, 0.9);
  }

  &[data-solid='true']::before {
    opacity: 0;
  }

  &[data-solid='true']::after {
    opacity: 1;
  }
`;

const Inner = styled(Container)`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${space[6]};
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  border-radius: 6px;
  transition: opacity 0.3s;

  img {
    width: 112px;
    height: auto;

    ${media.up('md')} {
      width: 128px;
    }
  }

  ${media.finePointer} {
    &:hover {
      opacity: 0.88;
    }
  }
`;

const DesktopNav = styled.nav`
  display: none;

  ${media.up('lg')} {
    display: block;
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: ${space[1]};
  margin: 0;
  padding: ${space[1]};

  /* 1024–1279 px: seven destinations plus the WhatsApp button must share one row. */
  ${media.down('xl')} {
    gap: 0;
  }
  list-style: none;
  border-radius: 999px;
  background: rgba(${rgb.white}, 0.025);
  box-shadow: inset 0 0 0 1px ${color.line};
`;

const NavItem = styled(NavLink)`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 2.375rem;
  padding-inline: ${space[4]};
  border-radius: 999px;

  ${media.down('xl')} {
    padding-inline: ${space[3]};
  }
  font-size: ${font.size.small};
  font-weight: ${font.weight.medium};
  color: ${color.textMuted};
  transition:
    color 0.3s,
    background-color 0.3s;

  /* Active-route indicator: a lit dot under the label. */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 4px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${color.brand};
    box-shadow: 0 0 10px rgba(${rgb.brand}, 0.9);
    transform: translateX(-50%) scale(0);
    transition: transform 0.45s ${motion.css.out};
  }

  ${media.finePointer} {
    &:hover {
      color: ${color.text};
      background: rgba(${rgb.white}, 0.05);
    }
  }

  &.active {
    color: ${color.text};
  }

  &.active::after {
    transform: translateX(-50%) scale(1);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${space[3]};
`;

const DesktopCta = styled.div`
  display: none;

  ${media.up('lg')} {
    display: block;
  }
`;

/* The full label from 1280 px; below that the button keeps the icon and "WhatsApp". */
const LabelFull = styled.span`
  ${media.down('xl')} {
    display: none;
  }
`;

const LabelShort = styled.span`
  ${media.up('xl')} {
    display: none;
  }
`;

const MenuButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  color: ${color.text};
  background: rgba(${rgb.ink}, 0.6);
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition: background-color 0.3s;

  &:active {
    background: rgba(${rgb.white}, 0.1);
  }

  ${media.up('lg')} {
    display: none;
  }
`;
