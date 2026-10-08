import { type ReactNode } from 'react';
import styled from 'styled-components';
import { entrance, entranceRise } from '@/components/motion/css';
import { EntranceWords } from '@/components/motion/EntranceWords';
import { LightSeam } from '@/components/motion/LightSeam';
import { Container } from '@/components/ui/Layout';
import { Eyebrow, H1, Lead } from '@/components/ui/Typography';
import { media } from '@/theme/media';
import { color, layout, rgb, space } from '@/theme/tokens';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Second sentence of the title, set on its own line in brand yellow (as on the home hero). */
  titleAccent?: string;
  lead: string;
  /** Extra content under the lead (chips, meta). */
  children?: ReactNode;
  /** Optional media column on large screens. */
  aside?: ReactNode;
}

/** Opening of every inner page: same lighting, rhythm and entrance as the home hero. */
export function PageHero({ eyebrow, title, titleAccent, lead, children, aside }: PageHeroProps) {
  const accentDelay = 0.18 + title.split(' ').length * 0.055;
  return (
    <Hero aria-labelledby="page-title">
      <Backdrop aria-hidden="true" />
      <Container $wide>
        <Grid $hasAside={Boolean(aside)}>
          <Copy>
            <Eyebrow style={{ animationDelay: '0.05s' }} className="enter">
              {eyebrow}
            </Eyebrow>
            <H1 id="page-title">
              <EntranceWords text={title} delay={0.12} />
              {titleAccent ? (
                <>
                  {' '}
                  <TitleAccent>
                    <EntranceWords text={titleAccent} delay={accentDelay} />
                  </TitleAccent>
                </>
              ) : null}
            </H1>
            <Lead className="rise" style={{ animationDelay: '0.3s' }}>
              {lead}
            </Lead>
            {children ? (
              <Extra className="enter" style={{ animationDelay: '0.56s' }}>
                {children}
              </Extra>
            ) : null}
          </Copy>
          {aside ? <Aside>{aside}</Aside> : null}
        </Grid>
      </Container>
      <Seam />
    </Hero>
  );
}

const Hero = styled.section`
  position: relative;
  padding-top: calc(${layout.headerHeight} + clamp(3.5rem, 2rem + 6vw, 7rem));
  padding-bottom: clamp(3.5rem, 2.5rem + 4vw, 6rem);
  overflow: clip;

  .enter {
    ${entrance(0)}
  }

  /* LCP candidates (lead paragraph): movement only, never invisible. */
  .rise {
    ${entranceRise(0)}
  }
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(70% 90% at 85% -10%, rgba(${rgb.brand}, 0.11), transparent 60%),
    radial-gradient(50% 60% at 0% 0%, rgba(${rgb.white}, 0.04), transparent 70%);

  /* Precision grid, fading out toward the content. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(${rgb.white}, 0.045) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(${rgb.white}, 0.045) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(80% 70% at 75% 10%, #000 10%, transparent 70%);
  }
`;

const Grid = styled.div<{ $hasAside: boolean }>`
  display: grid;
  gap: ${space[12]};
  align-items: end;

  ${media.up('lg')} {
    grid-template-columns: ${({ $hasAside }) => ($hasAside ? 'minmax(0, 1.15fr) minmax(0, 0.85fr)' : 'minmax(0, 1fr)')};
    gap: ${space[16]};
  }
`;

const Copy = styled.div`
  display: grid;
  gap: ${space[6]};
  max-width: 52rem;

  /*
   * em, not ch: "ch" is the width of "0" in the current font (0.555em in the
   * fallback, 0.661em in Manrope), so a ch measure changes when the web font
   * arrives, re-wraps the title and shifts the page. 14.5em ≈ 22ch in Manrope.
   */
  ${H1} {
    max-width: 14.5em;
  }
`;

const TitleAccent = styled.span`
  display: block;
  color: ${color.brand};
  text-shadow: 0 0 34px rgba(${rgb.brand}, 0.28);
`;

const Extra = styled.div`
  margin-top: ${space[2]};
`;

const Aside = styled.div`
  ${entranceRise(0.15, 1.2)}
`;

const Seam = styled(LightSeam)`
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 0.7;
  background: linear-gradient(
    90deg,
    transparent,
    ${color.lineStrong} 30%,
    rgba(${rgb.brand}, 0.4) 50%,
    ${color.lineStrong} 70%,
    transparent
  );
`;
