import { useRef, useState } from 'react';
import { Form } from 'react-router';
import styled from 'styled-components';
import { WhatsAppButton } from '@/components/common/ContactActions';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { markSelectionSource, useSelectionTransition } from '@/components/motion/viewTransition';
import { Button } from '@/components/ui/Button';
import { ErrorText } from '@/components/ui/Field';
import { Container, Section, VisuallyHidden } from '@/components/ui/Layout';
import { PriceTag } from '@/components/ui/Price';
import { Body, Eyebrow } from '@/components/ui/Typography';
import { cta } from '@/content/common';
import { pricingContent } from '@/content/pages';
import { pricingOptions, pricingQueryParam, resolvePricingOption } from '@/data/pricing';
import { useSpotlight } from '@/hooks/useSpotlight';
import { track } from '@/lib/analytics';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';
import { CtaFlare, CtaPanel } from '../shared/CtaPanel';

const copy = pricingContent.cta;
const errorId = 'precos-cta-erro';

/**
 * Act 5 — Action. A last, compact choice of option that leads into the same
 * contact flow. It is a real GET form (`/contato?servico=…`), so it works even
 * before JavaScript loads; with JavaScript it navigates client-side.
 */
export function PricingCta() {
  const spotlight = useSpotlight<HTMLDivElement>();
  const transition = useSelectionTransition();
  const [invalid, setInvalid] = useState(false);
  const firstOption = useRef<HTMLInputElement>(null);

  /** False (and the reason shown) when no option is chosen; otherwise the GET submission goes ahead. */
  const confirmChoice = (form: HTMLFormElement): boolean => {
    const checked = form.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    const option = resolvePricingOption(checked?.value);
    if (!checked || !option) {
      setInvalid(true);
      firstOption.current?.focus();
      return false;
    }
    track({ name: 'pricing_select', option: option.id, placement: 'precos-final' });
    const tile = checked.closest('label');
    if (tile && transition) markSelectionSource(tile);
    return true;
  };

  return (
    <Section aria-labelledby="precos-cta-titulo">
      <Container $wide>
        <Panel {...spotlight}>
          <CtaFlare aria-hidden="true" />
          <Copy>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <Title id="precos-cta-titulo" text={copy.title} />
            <Reveal delay={0.15}>
              <Body>{copy.text}</Body>
            </Reveal>
          </Copy>

          <Reveal delay={0.25}>
            <Form
              method="get"
              action={paths.contact}
              noValidate
              viewTransition={transition}
              onSubmit={(event) => {
                if (!confirmChoice(event.currentTarget)) event.preventDefault();
              }}
            >
              <Options aria-describedby={invalid ? errorId : undefined}>
                <legend>
                  <VisuallyHidden>{copy.legend}</VisuallyHidden>
                </legend>
                <Tiles data-invalid={invalid}>
                  {pricingOptions.map((option, index) => (
                    <Tile key={option.id}>
                      <input
                        ref={index === 0 ? firstOption : undefined}
                        type="radio"
                        name={pricingQueryParam}
                        value={option.id}
                        onChange={() => {
                          setInvalid(false);
                        }}
                      />
                      <TileBody>
                        <TileName>{option.name}</TileName>
                        <PriceTag price={option.price} size="inline" />
                      </TileBody>
                    </Tile>
                  ))}
                </Tiles>
                <Alert role="alert">{invalid ? <ErrorText id={errorId}>{copy.error}</ErrorText> : null}</Alert>
              </Options>

              <Actions>
                <Magnetic>
                  <Button type="submit" trailing="right">
                    {copy.submit}
                  </Button>
                </Magnetic>
                <Unsure>
                  <span>{copy.unsure}</span>
                  <WhatsAppButton variant="tertiary" size="md" placement="precos-final" message="general">
                    {cta.whatsapp}
                  </WhatsAppButton>
                </Unsure>
              </Actions>
            </Form>
          </Reveal>
        </Panel>
      </Container>
    </Section>
  );
}

const Panel = styled(CtaPanel)`
  /* Phones: a little less frame, so the options and the button get the width. */
  ${media.down('sm')} {
    padding: ${space[8]} ${space[5]};
  }

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: center;
    gap: ${space[16]};
  }
`;

const Copy = styled.div`
  display: grid;
  gap: ${space[5]};
  align-content: start;
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  /* em, not ch: stays the same when the web font replaces the fallback (no re-wrap). */
  max-width: 10.5em;
`;

const Options = styled.fieldset`
  display: grid;
  gap: ${space[3]};
  min-width: 0;
  margin: 0 0 ${space[6]};
  padding: 0;
  border: 0;

  legend {
    padding: 0;
  }
`;

const Tiles = styled.div`
  display: grid;
  gap: ${space[2]};

  ${media.up('sm')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const TileBody = styled.span`
  display: grid;
  gap: ${space[1]};
  height: 100%;
  min-height: 4.25rem;
  padding: ${space[3]} ${space[4]} ${space[3]} ${space[10]};
  border-radius: ${radius.lg};
  font-size: ${font.size.small};
  color: ${color.textMuted};
  background: rgba(${rgb.white}, 0.025);
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition:
    color 0.3s,
    background-color 0.35s ${motion.css.out},
    box-shadow 0.35s ${motion.css.out};

  /* Radio indicator, drawn on the tile (the native input stays for keyboard and screen readers). */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: ${space[4]};
    width: 1rem;
    height: 1rem;
    margin-top: -0.5rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1.5px ${color.textSubtle};
    transition:
      box-shadow 0.3s ${motion.css.out},
      background-color 0.3s;
  }
`;

const TileName = styled.span`
  font-size: ${font.size.body};
  font-weight: ${font.weight.semibold};
  color: ${color.text};
`;

const Tile = styled.label`
  position: relative;
  display: block;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  ${media.finePointer} {
    &:hover ${TileBody} {
      background: rgba(${rgb.white}, 0.05);
      box-shadow: inset 0 0 0 1px rgba(${rgb.white}, 0.28);
    }
  }

  input:checked + ${TileBody} {
    background: ${color.brandTint};
    box-shadow:
      inset 0 0 0 1px rgba(${rgb.brand}, 0.6),
      0 0 30px -12px rgba(${rgb.brand}, 0.7);
  }

  input:checked + ${TileBody}::before {
    background: ${color.brand};
    box-shadow:
      inset 0 0 0 3px ${color.ink850},
      0 0 0 1.5px ${color.brand},
      0 0 12px rgba(${rgb.brand}, 0.6);
  }

  input:focus-visible + ${TileBody} {
    outline: 2px solid ${color.brand};
    outline-offset: 3px;
  }

  [data-invalid='true'] & input:not(:checked) + ${TileBody} {
    box-shadow: inset 0 0 0 1px rgba(255, 143, 128, 0.55);
  }
`;

const Alert = styled.div`
  &:empty {
    display: none;
  }
`;

const Actions = styled.div`
  display: grid;
  gap: ${space[5]};

  /* Phones: the main button spans the panel (the magnetic wrapper is inline by default). */
  & > span:first-child,
  & > span:first-child > button {
    width: 100%;
  }

  /* Narrow phones: a slightly tighter button keeps "Escolher e falar com a MARK" on one line from 360 px. */
  ${media.down('sm')} {
    & > span:first-child > button {
      padding-inline: ${space[4]};
      font-size: ${font.size.small};
    }
  }

  ${media.up('sm')} {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${space[4]} ${space[8]};

    & > span:first-child,
    & > span:first-child > button {
      width: auto;
    }
  }
`;

const Unsure = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space[1]} ${space[3]};
  font-size: ${font.size.small};
  color: ${color.textSubtle};
`;
