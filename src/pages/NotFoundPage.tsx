import { Link } from 'react-router';
import styled from 'styled-components';
import { WhatsAppButton } from '@/components/common/ContactActions';
import { entrance } from '@/components/motion/css';
import { EntranceWords } from '@/components/motion/EntranceWords';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Layout';
import { Body, H1 } from '@/components/ui/Typography';
import { cta } from '@/content/common';
import { primaryNav } from '@/content/navigation';
import { notFoundContent } from '@/content/pages';
import { color, font, layout, radius, rgb, space } from '@/theme/tokens';

export default function NotFoundPage() {
  const shortcuts = primaryNav.filter((item) => item.to !== '/');
  return (
    <Wrapper>
      <Glow aria-hidden="true" />
      <Container $narrow>
        <Content>
          <Code aria-hidden="true">{notFoundContent.code}</Code>
          <H1>
            <EntranceWords text={notFoundContent.title} delay={0.1} />
          </H1>
          <Body className="enter">{notFoundContent.text}</Body>
          <Shortcuts className="enter" aria-label="Atalhos">
            <ul>
              {shortcuts.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </Shortcuts>
          <Actions className="enter">
            <ButtonLink to="/" size="md">
              {notFoundContent.home}
            </ButtonLink>
            <WhatsAppButton variant="secondary" size="md" placement="404" message="general">
              {cta.whatsapp}
            </WhatsAppButton>
          </Actions>
        </Content>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  position: relative;
  display: grid;
  align-items: center;
  min-height: 88svh;
  padding-top: calc(${layout.headerHeight} + ${space[16]});
  padding-bottom: ${space[16]};
  overflow: clip;

  .enter {
    ${entrance(0.4)}
  }
`;

const Glow = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(50% 50% at 50% 35%, rgba(${rgb.brand}, 0.12), transparent 70%);
`;

const Content = styled.div`
  display: grid;
  gap: ${space[6]};
  justify-items: center;
  text-align: center;
`;

/** Outlined numerals lit from within: the brand's neon, at rest. */
const Code = styled.p`
  font-size: clamp(6rem, 4rem + 12vw, 12rem);
  font-weight: ${font.weight.heavy};
  line-height: 0.85;
  letter-spacing: -0.06em;
  color: transparent;
  -webkit-text-stroke: 2px ${color.brand};
  text-shadow: 0 0 60px rgba(${rgb.brand}, 0.35);
  ${entrance(0)}
`;

const Shortcuts = styled.nav`
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${space[2]};
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    padding-inline: ${space[4]};
    border-radius: ${radius.pill};
    font-size: ${font.size.small};
    color: ${color.textMuted};
    box-shadow: inset 0 0 0 1px ${color.lineStrong};
    transition:
      color 0.3s,
      box-shadow 0.3s;

    &:hover {
      color: ${color.text};
      box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.55);
    }
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${space[3]};
`;
