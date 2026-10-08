import styled from 'styled-components';
import { PhoneButton, WhatsAppButton } from '@/components/common/ContactActions';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { Container, Section } from '@/components/ui/Layout';
import { Body, Eyebrow } from '@/components/ui/Typography';
import { cta, type WhatsappMessageKey } from '@/content/common';
import { useSpotlight } from '@/hooks/useSpotlight';
import { display } from '@/lib/format';
import { media } from '@/theme/media';
import { font, space } from '@/theme/tokens';
import { CtaFlare, CtaPanel } from './CtaPanel';

interface CtaBandProps {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  message?: WhatsappMessageKey;
  placement: string;
}

/** Act 5 — Action. Closing call to action shared by every page. */
export function CtaBand({ id, eyebrow, title, text, message = 'general', placement }: CtaBandProps) {
  const spotlight = useSpotlight<HTMLDivElement>();
  return (
    <Section aria-labelledby={id}>
      <Container $wide>
        <CtaPanel {...spotlight}>
          <CtaFlare aria-hidden="true" />
          <Copy>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Title id={id} text={title} />
            <Reveal delay={0.15}>
              <Body>{text}</Body>
            </Reveal>
          </Copy>
          <Reveal delay={0.25}>
            <Actions>
              <Magnetic>
                <WhatsAppButton message={message} placement={placement}>
                  {cta.whatsapp}
                </WhatsAppButton>
              </Magnetic>
              <PhoneButton variant="secondary" placement={placement}>
                {`${cta.call} ${display.phone}`}
              </PhoneButton>
            </Actions>
          </Reveal>
        </CtaPanel>
      </Container>
    </Section>
  );
}

const Copy = styled.div`
  display: grid;
  gap: ${space[5]};
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  max-width: 20ch;
`;

const Actions = styled.div`
  display: grid;
  gap: ${space[3]};

  ${media.up('sm')} {
    display: flex;
    flex-wrap: wrap;
  }

  ${media.up('lg')} {
    flex-direction: column;
    align-items: stretch;
  }
`;
