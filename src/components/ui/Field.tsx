import { CircleAlert } from 'lucide-react';
import { type ReactNode } from 'react';
import styled from 'styled-components';
import { color, font, space } from '@/theme/tokens';

interface FieldProps {
  id: string;
  label: string;
  /** Appended to the label in a lighter tone, e.g. "(opcional)". */
  optional?: string;
  hint?: string;
  error?: string | undefined;
  /** Extra visual element aligned with the hint (e.g. a character counter). */
  aside?: ReactNode;
  children: (describedBy: string | undefined) => ReactNode;
}

/**
 * Label + control + hint + error, wired with aria-describedby. The control is
 * rendered by the caller (input, textarea) so it can be registered with forms.
 */
export function Field({ id, label, optional, hint, error, aside, children }: FieldProps) {
  const hintId = hint ? `${id}-dica` : undefined;
  const errorId = error ? `${id}-erro` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
  return (
    <Wrapper>
      <Label htmlFor={id}>
        {label}
        {optional ? <span> {optional}</span> : null}
      </Label>
      {children(describedBy)}
      {hint || aside ? (
        <Below>
          {hint ? <Hint id={hintId}>{hint}</Hint> : <span />}
          {aside}
        </Below>
      ) : null}
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </Wrapper>
  );
}

export function ErrorText({ id, children }: { id?: string | undefined; children: ReactNode }) {
  return (
    <ErrorMessage id={id}>
      <CircleAlert size={15} aria-hidden="true" />
      {children}
    </ErrorMessage>
  );
}

const Wrapper = styled.div`
  display: grid;
  gap: ${space[2]};
`;

const Label = styled.label`
  font-size: ${font.size.small};
  font-weight: ${font.weight.semibold};
  color: ${color.text};

  span {
    font-weight: ${font.weight.regular};
    color: ${color.textSubtle};
  }
`;

const Below = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${space[3]};
  font-size: ${font.size.caption};
  color: ${color.textSubtle};
`;

const Hint = styled.p``;

const ErrorMessage = styled.p`
  display: flex;
  align-items: center;
  gap: ${space[2]};
  font-size: ${font.size.caption};
  font-weight: ${font.weight.medium};
  color: ${color.danger};

  svg {
    flex-shrink: 0;
  }
`;
