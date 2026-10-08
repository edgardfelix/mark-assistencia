import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router';
import styled from 'styled-components';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { Button, ButtonAnchor } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/controls';
import { ErrorText, Field } from '@/components/ui/Field';
import { business } from '@/config/business';
import { PriceTag } from '@/components/ui/Price';
import { contactContent } from '@/content/pages';
import { type PricingOption } from '@/data/pricing';
import { track } from '@/lib/analytics';
import { buildContactUrl, type ContactChannel, type ContactContext } from '@/lib/contact/compose';
import {
  contactLimits,
  contactSchema,
  contactSubjects,
  type ContactFormData,
  type ContactFormInput,
} from '@/lib/contact/schema';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

const copy = contactContent.form;

interface Composed {
  channel: ContactChannel;
  url: string;
}

interface ContactFormProps {
  /** Option chosen on the prices page: it opens the composed message and adapts one hint. */
  selection?: PricingOption | null;
}

/**
 * Message composer. There is no form backend: on submit the validated,
 * sanitized message opens in the visitor's WhatsApp (new tab) or e-mail app,
 * where they review and send it. The success state says exactly that.
 */
export function ContactForm({ selection = null }: ContactFormProps) {
  const [composed, setComposed] = useState<Composed | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<ContactFormInput, unknown, ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', device: '', message: '' },
    mode: 'onTouched',
  });

  const message = useWatch({ control, name: 'message' });

  // Registered up front in DOM order: React Hook Form focuses the first invalid
  // field in registration order, which must match what keyboard users see.
  const fields = {
    name: register('name'),
    device: register('device'),
    subject: register('subject'),
    message: register('message'),
  };

  // Read at submit time, so the message always matches the URL the visitor is on.
  const context: ContactContext | null = selection ? { opening: selection.message, topic: selection.name } : null;

  const compose = (channel: ContactChannel) =>
    handleSubmit((data) => {
      const url = buildContactUrl(channel, data, context);
      track({ name: 'contact_form_compose', channel });
      if (channel === 'whatsapp') window.open(url, '_blank', 'noopener,noreferrer');
      else window.location.href = url;
      setComposed({ channel, url });
    });

  if (composed) {
    return (
      <Success
        composed={composed}
        onAgain={() => {
          reset();
          setComposed(null);
        }}
      />
    );
  }

  const messageLength = message.length;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form
      noValidate
      aria-describedby="form-intro"
      onSubmit={(event) => {
        void compose('whatsapp')(event);
      }}
    >
      <Intro id="form-intro">{copy.intro}</Intro>

      {selection ? (
        <Context>
          <span>{contactContent.selection.formContext}</span>
          <strong>{selection.name}</strong>
          <PriceTag price={selection.price} size="inline" />
        </Context>
      ) : null}

      {submitCount > 0 && hasErrors ? (
        <Summary role="alert">
          <ErrorText>{copy.errorSummary}</ErrorText>
        </Summary>
      ) : null}

      <Field id="nome" label={copy.fields.name.label} error={errors.name?.message}>
        {(describedBy) => (
          <Input
            id="nome"
            type="text"
            autoComplete="name"
            placeholder={copy.fields.name.placeholder}
            maxLength={contactLimits.name.max + 20}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy}
            {...fields.name}
          />
        )}
      </Field>

      <Field
        id="aparelho"
        label={copy.fields.device.label}
        optional={copy.fields.device.optional}
        error={errors.device?.message}
      >
        {(describedBy) => (
          <Input
            id="aparelho"
            type="text"
            autoComplete="off"
            placeholder={selection?.devicePlaceholder ?? copy.fields.device.placeholder}
            maxLength={contactLimits.device.max + 20}
            aria-invalid={Boolean(errors.device)}
            aria-describedby={describedBy}
            {...fields.device}
          />
        )}
      </Field>

      <Subjects aria-describedby={errors.subject ? 'assunto-erro' : undefined}>
        <legend>{copy.fields.subject.legend}</legend>
        <ChipRow data-invalid={Boolean(errors.subject)}>
          {contactSubjects.map((subject) => (
            <Chip key={subject}>
              <input type="radio" value={subject} {...fields.subject} />
              <span>{subject}</span>
            </Chip>
          ))}
        </ChipRow>
        {errors.subject?.message ? <ErrorText id="assunto-erro">{errors.subject.message}</ErrorText> : null}
      </Subjects>

      <Field
        id="mensagem"
        label={copy.fields.message.label}
        hint={copy.fields.message.hint}
        error={errors.message?.message}
        aside={
          <Counter aria-hidden="true" data-over={messageLength > contactLimits.message.max}>
            {messageLength}/{contactLimits.message.max}
          </Counter>
        }
      >
        {(describedBy) => (
          <Textarea
            id="mensagem"
            rows={5}
            placeholder={copy.fields.message.placeholder}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy}
            {...fields.message}
          />
        )}
      </Field>

      <Actions>
        <Button type="submit" icon={<WhatsAppIcon size={19} />} disabled={isSubmitting}>
          {copy.submitWhatsapp}
        </Button>
        <Button
          variant="secondary"
          icon={<Mail size={18} aria-hidden="true" />}
          disabled={isSubmitting}
          onClick={(event) => {
            void compose('email')(event);
          }}
        >
          {copy.submitEmail}
        </Button>
      </Actions>

      <Note>
        {copy.note} <Link to={paths.privacy}>{copy.privacyLink}</Link>.
      </Note>
    </Form>
  );
}

function Success({ composed, onAgain }: { composed: Composed; onAgain: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const text = copy.success[composed.channel];

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <SuccessPanel>
      <CheckCircle2 size={40} aria-hidden="true" />
      <h3 ref={heading} tabIndex={-1}>
        {text.title}
      </h3>
      <p>{text.text}</p>
      <p>{text.fallback}</p>
      {composed.channel === 'email' ? <Email>{business.email}</Email> : null}
      <SuccessActions>
        <ButtonAnchor
          href={composed.url}
          size="md"
          icon={composed.channel === 'whatsapp' ? <WhatsAppIcon size={18} /> : <Mail size={17} aria-hidden="true" />}
        >
          {text.action}
        </ButtonAnchor>
        <Button variant="tertiary" size="md" onClick={onAgain}>
          {copy.success.again}
        </Button>
      </SuccessActions>
    </SuccessPanel>
  );
}

const Form = styled.form`
  display: grid;
  gap: ${space[6]};
`;

const Intro = styled.p`
  color: ${color.textMuted};
`;

/* "Opção escolhida": the selected price option, carried into the message. */
const Context = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${space[1]} ${space[3]};
  padding: ${space[3]} ${space[4]};
  border-radius: ${radius.md};
  font-size: ${font.size.small};
  color: ${color.text};
  background: ${color.brandTint};
  box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.3);

  & > span:first-child {
    font-size: ${font.size.eyebrow};
    font-weight: ${font.weight.semibold};
    letter-spacing: ${font.tracking.eyebrow};
    text-transform: uppercase;
    color: ${color.brand};
  }

  & > span:last-child {
    color: ${color.textMuted};
  }
`;

const Summary = styled.div`
  padding: ${space[3]} ${space[4]};
  border-radius: ${radius.md};
  background: ${color.dangerTint};
  box-shadow: inset 0 0 0 1px rgba(255, 143, 128, 0.35);
`;

const Subjects = styled.fieldset`
  display: grid;
  gap: ${space[3]};
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;

  legend {
    margin-bottom: ${space[3]};
    padding: 0;
    font-size: ${font.size.small};
    font-weight: ${font.weight.semibold};
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[2]};
`;

const Chip = styled.label`
  position: relative;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  span {
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
      background-color 0.35s ${motion.css.out},
      box-shadow 0.3s;
  }

  &:hover span {
    color: ${color.text};
    box-shadow: inset 0 0 0 1px rgba(${rgb.white}, 0.28);
  }

  input:checked + span {
    color: ${color.onBrand};
    background: ${color.brand};
    box-shadow: 0 0 22px -8px rgba(${rgb.brand}, 0.8);
  }

  input:focus-visible + span {
    outline: 2px solid ${color.brand};
    outline-offset: 3px;
  }

  [data-invalid='true'] & input:not(:checked) + span {
    box-shadow: inset 0 0 0 1px rgba(255, 143, 128, 0.55);
  }
`;

const Counter = styled.span`
  font-variant-numeric: tabular-nums;

  &[data-over='true'] {
    color: ${color.danger};
  }
`;

const Actions = styled.div`
  display: grid;
  gap: ${space[3]};

  ${media.up('sm')} {
    display: flex;
    flex-wrap: wrap;
  }
`;

const Note = styled.p`
  font-size: ${font.size.caption};
  color: ${color.textSubtle};

  a {
    color: ${color.textMuted};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const SuccessPanel = styled.div`
  display: grid;
  gap: ${space[4]};
  justify-items: start;

  & > svg {
    color: ${color.success};
  }

  h3 {
    font-size: ${font.size.h3};
    font-weight: ${font.weight.semibold};
    outline: none;
  }

  p {
    color: ${color.textMuted};
  }
`;

const Email = styled.p`
  font-weight: ${font.weight.semibold};
  color: ${color.text} !important;
`;

const SuccessActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space[4]};
  margin-top: ${space[2]};
`;
