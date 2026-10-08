import { ArrowUp, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { type ReactNode } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { a11y, whatsappMessages } from '@/content/common';
import { legalNav, primaryNav } from '@/content/navigation';
import { business } from '@/config/business';
import { track, type AnalyticsEvent } from '@/lib/analytics';
import { display } from '@/lib/format';
import { directionsUrl, instagramUrl, mailtoUrl, telUrl, wazeUrl, whatsappUrl } from '@/lib/links';
import { smoothScroll } from '@/lib/smooth-scroll';
import { media } from '@/theme/media';
import { color, font, motion, rgb, space } from '@/theme/tokens';
import { LightSeam } from '../motion/LightSeam';
import { InstagramIcon, WhatsAppIcon } from '../ui/BrandIcons';
import { Container, VisuallyHidden } from '../ui/Layout';
import { Logo } from '../ui/Logo';

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <Wrapper>
      <Container $wide>
        <Top>
          <Brand>
            <Logo width={176} loading="lazy" />
            <p>
              Assistência de celulares na Vila Yolanda, em Osasco. Reparos e acessórios para iPhone e Android, com busca
              e entrega grátis.
            </p>
            <Socials>
              <SocialLink
                href={whatsappUrl(whatsappMessages.general)}
                event={{ name: 'whatsapp_click', placement: 'footer' }}
              >
                <WhatsAppIcon size={18} />
                <VisuallyHidden>WhatsApp</VisuallyHidden>
              </SocialLink>
              <SocialLink href={instagramUrl} event={{ name: 'instagram_click', placement: 'footer' }}>
                <InstagramIcon size={18} />
                <VisuallyHidden>Instagram</VisuallyHidden>
              </SocialLink>
            </Socials>
          </Brand>

          <Column>
            <ColumnTitle>Navegação</ColumnTitle>
            <nav aria-label={a11y.footerNav}>
              <NavList>
                {primaryNav.map((item) => (
                  <li key={item.to}>
                    <FooterLink to={item.to}>{item.label}</FooterLink>
                  </li>
                ))}
              </NavList>
            </nav>
          </Column>

          <Column>
            <ColumnTitle>Contato</ColumnTitle>
            <List>
              <li>
                <Detail
                  href={whatsappUrl(whatsappMessages.general)}
                  external
                  onClick={() => {
                    track({ name: 'whatsapp_click', placement: 'footer-list' });
                  }}
                >
                  <WhatsAppIcon size={16} /> WhatsApp {display.phone}
                </Detail>
              </li>
              <li>
                <Detail
                  href={telUrl}
                  onClick={() => {
                    track({ name: 'phone_click', placement: 'footer' });
                  }}
                >
                  <Phone size={16} aria-hidden="true" /> {display.phone}
                </Detail>
              </li>
              <li>
                <Detail
                  href={mailtoUrl()}
                  onClick={() => {
                    track({ name: 'email_click', placement: 'footer' });
                  }}
                >
                  <Mail size={16} aria-hidden="true" /> {business.email}
                </Detail>
              </li>
              <li>
                <Detail
                  href={instagramUrl}
                  external
                  onClick={() => {
                    track({ name: 'instagram_click', placement: 'footer-list' });
                  }}
                >
                  <InstagramIcon size={16} /> {display.instagramHandle}
                </Detail>
              </li>
            </List>
          </Column>

          <Column>
            <ColumnTitle>Visite</ColumnTitle>
            <Address>
              <MapPin size={16} aria-hidden="true" />
              <span>
                {display.addressLine1}
                <br />
                {display.addressLine2}
              </span>
            </Address>
            <Hours>
              <Clock size={16} aria-hidden="true" />
              <span>Atendimento das {display.hours}</span>
            </Hours>
            <RouteLinks>
              <Detail
                href={directionsUrl}
                external
                onClick={() => {
                  track({ name: 'directions_click', placement: 'footer', provider: 'google-maps' });
                }}
              >
                Google Maps
              </Detail>
              <Detail
                href={wazeUrl}
                external
                onClick={() => {
                  track({ name: 'directions_click', placement: 'footer', provider: 'waze' });
                }}
              >
                Waze
              </Detail>
            </RouteLinks>
          </Column>
        </Top>

        <LightSeam />

        <Bottom>
          <Legal>
            <p>
              © <span suppressHydrationWarning>{currentYear}</span> {business.name}. Todos os direitos reservados.
            </p>
            <p>CNPJ {display.cnpj}</p>
          </Legal>
          <nav aria-label={a11y.legalNav}>
            <LegalList>
              {legalNav.map((item) => (
                <li key={item.to}>
                  <FooterLink to={item.to}>{item.label}</FooterLink>
                </li>
              ))}
            </LegalList>
          </nav>
          <BackToTop
            type="button"
            onClick={() => {
              smoothScroll.scrollTo(0);
              document.getElementById('conteudo')?.focus({ preventScroll: true });
            }}
          >
            Voltar ao topo <ArrowUp size={16} aria-hidden="true" />
          </BackToTop>
        </Bottom>
        <Trademark>
          iPhone é marca da Apple Inc. e Android é marca da Google LLC. As marcas citadas pertencem aos seus titulares e
          indicam apenas os aparelhos atendidos.
        </Trademark>
      </Container>
    </Wrapper>
  );
}

function Detail({
  href,
  external = false,
  onClick,
  children,
}: {
  href: string;
  external?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <DetailAnchor href={href} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
      {external && <VisuallyHidden> {a11y.opensInNewTab}</VisuallyHidden>}
    </DetailAnchor>
  );
}

function SocialLink({ href, event, children }: { href: string; event: AnalyticsEvent; children: ReactNode }) {
  return (
    <SocialAnchor
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track(event);
      }}
    >
      {children}
      <VisuallyHidden> {a11y.opensInNewTab}</VisuallyHidden>
    </SocialAnchor>
  );
}

const Wrapper = styled.footer`
  position: relative;
  z-index: 1;
  padding-top: clamp(4rem, 3rem + 4vw, 6rem);
  padding-bottom: calc(${space[8]} + env(safe-area-inset-bottom));
  background: radial-gradient(60% 80% at 15% 0%, rgba(${rgb.brand}, 0.05), transparent 70%), ${color.ink950};
  border-top: 1px solid ${color.line};

  /* Room for the floating WhatsApp button on small screens. */
  ${media.down('lg')} {
    padding-bottom: calc(6.5rem + env(safe-area-inset-bottom));
  }
`;

const Top = styled.div`
  display: grid;
  gap: ${space[12]};
  padding-bottom: clamp(3rem, 2rem + 3vw, 4.5rem);

  ${media.up('md')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
    gap: ${space[10]};
  }
`;

const Brand = styled.div`
  display: grid;
  gap: ${space[5]};
  align-content: start;

  p {
    max-width: 22rem;
    color: ${color.textSubtle};
    font-size: ${font.size.small};
  }
`;

const Socials = styled.div`
  display: flex;
  gap: ${space[3]};
`;

const SocialAnchor = styled.a`
  display: inline-grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  color: ${color.text};
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition:
    color 0.3s,
    box-shadow 0.3s,
    background-color 0.3s;

  ${media.finePointer} {
    &:hover {
      color: ${color.onBrand};
      background: ${color.brand};
      box-shadow: inset 0 0 0 1px ${color.brand};
    }
  }
`;

/* Plain groups: the footer itself is the landmark (no duplicate "Contato" regions). */
const Column = styled.div`
  display: grid;
  gap: ${space[4]};
  align-content: start;
`;

const ColumnTitle = styled.h2`
  font-size: ${font.size.eyebrow};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.eyebrow};
  text-transform: uppercase;
  color: ${color.textSubtle};
`;

const List = styled.ul`
  display: grid;
  gap: ${space[1]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

/* Six destinations: two short columns on phones and tablets, one column in the desktop grid. */
const NavList = styled(List)`
  grid-template-columns: repeat(2, max-content);
  column-gap: ${space[12]};

  ${media.up('lg')} {
    grid-template-columns: none;
  }
`;

const linkStyles = `
  display: inline-flex;
  align-items: center;
  gap: ${space[2]};
  min-height: 2.25rem;
  font-size: ${font.size.small};
  color: ${color.textMuted};
  transition: color 0.3s;
`;

const FooterLink = styled(Link)`
  ${linkStyles}

  ${media.finePointer} {
    &:hover {
      color: ${color.brand};
    }
  }
`;

const DetailAnchor = styled.a`
  ${linkStyles}
  overflow-wrap: anywhere;

  ${media.finePointer} {
    &:hover {
      color: ${color.brand};
    }
  }
`;

const Address = styled.p`
  display: flex;
  gap: ${space[2]};
  font-size: ${font.size.small};
  color: ${color.textMuted};

  svg {
    margin-top: 0.3em;
    flex-shrink: 0;
  }
`;

const Hours = styled(Address)``;

const RouteLinks = styled.div`
  display: flex;
  gap: ${space[5]};

  a {
    color: ${color.text};
    text-decoration: underline;
    text-decoration-color: rgba(${rgb.brand}, 0.5);
    text-underline-offset: 4px;
  }
`;

const Bottom = styled.div`
  display: grid;
  gap: ${space[5]};
  padding-top: ${space[8]};
  font-size: ${font.size.caption};
  color: ${color.textSubtle};

  ${media.up('md')} {
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: ${space[8]};
  }
`;

const Legal = styled.div`
  display: grid;
  gap: ${space[1]};
`;

const LegalList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[1]} ${space[6]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const BackToTop = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${space[2]};
  justify-self: start;
  min-height: 2.75rem;
  padding-inline: ${space[4]};
  border-radius: 999px;
  color: ${color.text};
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition: box-shadow 0.3s;

  svg {
    transition: transform 0.45s ${motion.css.out};
  }

  ${media.finePointer} {
    &:hover {
      box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.6);
    }
    &:hover svg {
      transform: translateY(-2px);
    }
  }
`;

const Trademark = styled.p`
  margin-top: ${space[6]};
  max-width: 48rem;
  font-size: 0.75rem;
  color: ${color.textSubtle};
`;
