import { m, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import styled from 'styled-components';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Layout';
import { Eyebrow } from '@/components/ui/Typography';
import { cta } from '@/content/common';
import { homeContent } from '@/content/home';
import { feedbackQuotes, getShot } from '@/data/feedback';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, motion, space } from '@/theme/tokens';
import { QuoteCard, ShotFigure } from '../shared/Feedback';

const content = homeContent.proof;
const stack = [getShot('feedback-5'), getShot('feedback-4'), getShot('feedback-6')] as const;

/** Act 4 — Proof: a verbatim review, backed by the original screenshots. */
export function ProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const back = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);
  const front = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [70, -70]);

  return (
    <Section aria-labelledby="avaliacoes-titulo">
      <Container>
        <Grid>
          <Copy>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <Title id="avaliacoes-titulo" text={content.title} />
            <Reveal delay={0.15}>
              <QuoteCard quote={feedbackQuotes.serviceAndPrice} size="lg" />
            </Reveal>
            <Reveal delay={0.25}>
              <ButtonLink to={paths.reviews} variant="secondary" size="md">
                {cta.reviews}
              </ButtonLink>
            </Reveal>
          </Copy>

          <Stack ref={ref}>
            <Card $slot="left" style={{ y: back }}>
              <ShotFigure shot={stack[0]} sizes="(min-width: 1024px) 240px, 45vw" showCaption={false} />
            </Card>
            <Card $slot="right" style={{ y: back }}>
              <ShotFigure shot={stack[2]} sizes="(min-width: 1024px) 240px, 45vw" showCaption={false} />
            </Card>
            <Card $slot="center" style={{ y: front }}>
              <ShotFigure shot={stack[1]} sizes="(min-width: 1024px) 280px, 60vw" showCaption={false} />
            </Card>
          </Stack>
        </Grid>
      </Container>
    </Section>
  );
}

const Grid = styled.div`
  display: grid;
  gap: clamp(3rem, 2rem + 4vw, 5rem);

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
  }
`;

const Copy = styled.div`
  display: grid;
  gap: ${space[6]};
  justify-items: start;
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  max-width: 18ch;
`;

const Stack = styled.div`
  position: relative;
  height: clamp(24rem, 18rem + 30vw, 36rem);

  &::before {
    content: '';
    position: absolute;
    inset: 15% 10%;
    background: radial-gradient(closest-side, rgba(252, 220, 18, 0.14), transparent);
  }
`;

const slots = {
  left: `left: 0; top: 12%; width: 42%; rotate: -7deg; z-index: 1;`,
  right: `right: 0; top: 16%; width: 42%; rotate: 6deg; z-index: 1;`,
  center: `left: 50%; top: 0; width: 50%; translate: -50% 0; z-index: 2;`,
} as const;

const Card = styled(m.div)<{ $slot: keyof typeof slots }>`
  position: absolute;
  ${({ $slot }) => slots[$slot]}
  transition: rotate 0.7s ${motion.css.out};

  ${Stack}:hover & {
    rotate: ${({ $slot }) => ($slot === 'left' ? '-10deg' : $slot === 'right' ? '9deg' : '0deg')};
  }

  figure > div {
    box-shadow:
      0 0 0 1px ${color.lineStrong},
      0 40px 80px -30px rgba(0, 0, 0, 0.95);
  }
`;
