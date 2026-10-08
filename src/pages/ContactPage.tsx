import styled from 'styled-components';
import { Reveal } from '@/components/motion/Reveal';
import { ContactChannels } from '@/components/sections/contact/ContactChannels';
import { ContactForm } from '@/components/sections/contact/ContactForm';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Container, Section } from '@/components/ui/Layout';
import { Eyebrow, H2 } from '@/components/ui/Typography';
import { contactContent } from '@/content/pages';
import { usePricingSelection } from '@/hooks/usePricingSelection';
import { media } from '@/theme/media';
import { color, radius, rgb, space } from '@/theme/tokens';

/**
 * Contact. When the visitor arrives from the prices page (`?servico=`), the
 * chosen option leads the channels and frames the composed message; without it
 * (or with an unknown value) this is the regular contact page.
 */
export default function ContactPage() {
  const { hero, form } = contactContent;
  const selection = usePricingSelection();
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />
      <Section $flush="top">
        <Container>
          <Grid>
            {/* Arriving with a selection, the chosen option morphs in (View Transition): no second entrance on top. */}
            {selection ? (
              <ContactChannels selection={selection} />
            ) : (
              <Reveal>
                <ContactChannels selection={null} />
              </Reveal>
            )}
            <Reveal delay={0.12}>
              <FormPanel aria-labelledby="mensagem-titulo">
                <Eyebrow>{form.eyebrow}</Eyebrow>
                <H2 id="mensagem-titulo">{form.title}</H2>
                <ContactForm selection={selection} />
              </FormPanel>
            </Reveal>
          </Grid>
        </Container>
      </Section>
    </>
  );
}

const Grid = styled.div`
  display: grid;
  gap: ${space[8]};
  padding-top: ${space[10]};

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    align-items: start;
    gap: ${space[10]};
  }
`;

const FormPanel = styled.section`
  display: grid;
  gap: ${space[5]};
  padding: clamp(1.5rem, 1rem + 2.5vw, 3rem);
  border-radius: ${radius.xxl};
  background: radial-gradient(70% 60% at 100% 0%, rgba(${rgb.brand}, 0.08), transparent 60%), ${color.ink850};
  box-shadow: inset 0 0 0 1px ${color.line};

  ${H2} {
    font-size: clamp(1.6rem, 1.3rem + 1.2vw, 2.2rem);
    margin-bottom: ${space[2]};
  }
`;
