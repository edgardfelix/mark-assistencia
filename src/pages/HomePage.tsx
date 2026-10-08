import { Suspense } from 'react';
import styled from 'styled-components';
import { HeroSection } from '@/components/sections/home/HeroSection';
import { ProcessSection } from '@/components/sections/home/ProcessSection';
import { ProofSection } from '@/components/sections/home/ProofSection';
import { ServicesIndex } from '@/components/sections/home/ServicesIndex';
import { VisitSection } from '@/components/sections/home/VisitSection';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FactsStrip } from '@/components/sections/shared/FactsStrip';
import { LightSeam } from '@/components/motion/LightSeam';
import { Container, DeferredSection } from '@/components/ui/Layout';
import { homeContent } from '@/content/home';

/**
 * Home, told as a short story:
 * impact (hero) → trust (facts) → experience (services, process) →
 * proof (reviews) → presence (visit) → action (CTA).
 *
 * Below-the-fold chapters sit in their own Suspense boundaries (React hydrates
 * each one as a separate, interruptible task) and in deferred sections (the
 * browser skips their layout and paint until they approach the viewport).
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBand>
        <Container $wide>
          <FactsStrip title={homeContent.trust.title} />
        </Container>
      </TrustBand>
      <DeferredSection $estimate={1100}>
        <Suspense>
          <ServicesIndex />
          <Container>
            <LightSeam />
          </Container>
        </Suspense>
      </DeferredSection>
      <DeferredSection $estimate={1300}>
        <Suspense>
          <ProcessSection />
        </Suspense>
      </DeferredSection>
      <DeferredSection $estimate={1000}>
        <Suspense>
          <ProofSection />
          <Container>
            <LightSeam />
          </Container>
        </Suspense>
      </DeferredSection>
      <DeferredSection $estimate={1000}>
        <Suspense>
          <VisitSection />
        </Suspense>
      </DeferredSection>
      <DeferredSection $estimate={700}>
        <Suspense>
          <CtaBand
            id="cta-final"
            eyebrow={homeContent.finalCta.eyebrow}
            title={homeContent.finalCta.title}
            text={homeContent.finalCta.text}
            message="service"
            placement="home-final"
          />
        </Suspense>
      </DeferredSection>
    </>
  );
}

/** Pulls the facts panel up so it overlaps the hero edge (layered depth). */
const TrustBand = styled.section`
  position: relative;
  z-index: 2;
  margin-top: clamp(-3rem, -2rem - 1vw, -1.5rem);
`;
