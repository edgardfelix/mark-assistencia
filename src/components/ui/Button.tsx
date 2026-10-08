import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import styled, { css } from 'styled-components';
import { a11y } from '@/content/common';
import { isSafeContactUri, isSafeExternalUrl } from '@/lib/links';
import { prefetchRoute } from '@/routes/prefetch';
import { media } from '@/theme/media';
import { color, font, glow, motion, radius, rgb, space } from '@/theme/tokens';
import { VisuallyHidden } from './Layout';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'md' | 'lg';

interface StyleProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $block: boolean;
}

const primary = css`
  color: ${color.onBrand};
  background: ${color.brand};
  box-shadow:
    0 0 0 1px rgba(${rgb.brand}, 0.6),
    0 10px 30px -12px rgba(${rgb.brand}, 0.55);

  /* Sheen that sweeps across on hover. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.55) 50%, transparent 70%);
    transform: translateX(-120%);
    pointer-events: none;
  }

  ${media.finePointer} {
    &:hover {
      background: ${color.brandHover};
      box-shadow:
        ${glow.ring},
        0 16px 40px -14px rgba(${rgb.brand}, 0.75);
    }
    &:hover::after {
      transform: translateX(120%);
      transition: transform 0.9s ${motion.css.out};
    }
  }

  &:active {
    background: ${color.brandPressed};
  }
`;

const secondary = css`
  color: ${color.text};
  background: rgba(${rgb.ink}, 0.55);
  box-shadow: inset 0 0 0 1px ${color.lineStrong};

  ${media.finePointer} {
    &:hover {
      background: rgba(${rgb.white}, 0.07);
      box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.5);
    }
  }
`;

const tertiary = css`
  min-height: auto;
  padding: ${space[1]} 0;
  border-radius: ${radius.xs};
  color: ${color.text};
  background: none;

  /* Underline that draws in from the left. */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 1px;
    background: ${color.brand};
    transform: scaleX(0.35);
    transform-origin: left center;
    opacity: 0.6;
    transition:
      transform 0.5s ${motion.css.out},
      opacity 0.3s;
  }

  ${media.finePointer} {
    &:hover::before {
      transform: scaleX(1);
      opacity: 1;
    }
  }
`;

/* min-height (not height): long labels may wrap on narrow phones instead of overflowing. */
const sizes = {
  md: css`
    min-height: 2.75rem;
    padding: ${space[2]} ${space[5]};
    font-size: ${font.size.small};
  `,
  lg: css`
    min-height: 3.375rem;
    padding: ${space[3]} ${space[7]};
    font-size: 1rem;
  `,
};

const buttonStyles = css<StyleProps>`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${space[3]};
  border-radius: ${radius.pill};
  font-weight: ${font.weight.semibold};
  letter-spacing: -0.005em;
  line-height: 1.25;
  text-align: center;
  max-width: 100%;
  user-select: none;

  ${media.up('sm')} {
    white-space: nowrap;
  }
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 0.3s ${motion.css.out},
    box-shadow 0.4s ${motion.css.out},
    transform 0.25s ${motion.css.out};

  ${({ $size }) => sizes[$size]}
  ${({ $variant }) => ($variant === 'primary' ? primary : $variant === 'secondary' ? secondary : tertiary)}
  ${({ $variant }) =>
    $variant === 'tertiary' &&
    css`
      overflow: visible;
    `}

  width: ${({ $block }) => ($block ? '100%' : 'auto')};

  &:active {
    transform: scale(0.975);
  }

  &:focus-visible {
    outline: 2px solid ${color.brand};
    outline-offset: 3px;
  }

  &[aria-disabled='true'],
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .btn-trailing {
    transition: transform 0.45s ${motion.css.out};
  }

  ${media.finePointer} {
    &:hover .btn-trailing[data-dir='right'] {
      transform: translateX(3px);
    }
    &:hover .btn-trailing[data-dir='diagonal'] {
      transform: translate(2px, -2px);
    }
  }

  svg {
    flex-shrink: 0;
  }
`;

const StyledLink = styled(Link)<StyleProps>`
  ${buttonStyles}
`;
const StyledAnchor = styled.a<StyleProps>`
  ${buttonStyles}
`;
const StyledButton = styled.button<StyleProps>`
  ${buttonStyles}
`;

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  /** Trailing arrow: `right` for internal, `diagonal` for external destinations. */
  trailing?: 'right' | 'diagonal' | 'none';
  children: ReactNode;
}

function Content({ icon, trailing, children }: Pick<CommonProps, 'icon' | 'trailing' | 'children'>) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {trailing === 'right' && <ArrowRight className="btn-trailing" data-dir="right" size={18} aria-hidden="true" />}
      {trailing === 'diagonal' && (
        <ArrowUpRight className="btn-trailing" data-dir="diagonal" size={18} aria-hidden="true" />
      )}
    </>
  );
}

type ButtonLinkProps = CommonProps & Omit<LinkProps, 'children' | 'to'> & { to: string };

/** Internal navigation. Prefetches the destination route on intent. */
export function ButtonLink({
  variant = 'primary',
  size = 'lg',
  block = false,
  icon,
  trailing = 'right',
  children,
  to,
  onPointerEnter,
  onFocus,
  ...rest
}: ButtonLinkProps) {
  return (
    <StyledLink
      to={to}
      $variant={variant}
      $size={size}
      $block={block}
      onPointerEnter={(event) => {
        prefetchRoute(to);
        onPointerEnter?.(event);
      }}
      onFocus={(event) => {
        prefetchRoute(to);
        onFocus?.(event);
      }}
      {...rest}
    >
      <Content icon={icon} trailing={trailing}>
        {children}
      </Content>
    </StyledLink>
  );
}

type ButtonAnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & { href: string };

/**
 * Outbound link (https on allowed hosts, tel:, mailto:). Unsafe URLs are not
 * rendered as links at all. External https links open in a new tab, isolated.
 */
export function ButtonAnchor({
  variant = 'primary',
  size = 'lg',
  block = false,
  icon,
  trailing,
  children,
  href,
  ...rest
}: ButtonAnchorProps) {
  const external = href.startsWith('https:');
  const safe = external ? isSafeExternalUrl(href) : isSafeContactUri(href);
  if (!safe) {
    if (import.meta.env.DEV) console.error(`[ButtonAnchor] blocked unsafe href: ${href}`);
    return null;
  }
  return (
    <StyledAnchor
      href={href}
      $variant={variant}
      $size={size}
      $block={block}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <Content icon={icon} trailing={trailing ?? (external ? 'diagonal' : 'none')}>
        {children}
      </Content>
      {external && <VisuallyHidden> {a11y.opensInNewTab}</VisuallyHidden>}
    </StyledAnchor>
  );
}

type NativeButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function Button({
  variant = 'primary',
  size = 'lg',
  block = false,
  icon,
  trailing = 'none',
  children,
  type = 'button',
  ...rest
}: NativeButtonProps) {
  return (
    <StyledButton type={type} $variant={variant} $size={size} $block={block} {...rest}>
      <Content icon={icon} trailing={trailing}>
        {children}
      </Content>
    </StyledButton>
  );
}
