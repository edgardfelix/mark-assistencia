import styled, { css } from 'styled-components';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

/** Shared look of text inputs: a lit border that "draws in" on focus. */
export const controlStyles = css`
  width: 100%;
  min-height: 3.25rem;
  padding: ${space[3]} ${space[4]};
  border: 0;
  border-radius: ${radius.md};
  font-size: 1rem;
  color: ${color.text};
  background: rgba(${rgb.white}, 0.035);
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition:
    box-shadow 0.35s ${motion.css.out},
    background-color 0.35s ${motion.css.out};

  &::placeholder {
    color: ${color.textSubtle};
    opacity: 1;
  }

  &:hover {
    box-shadow: inset 0 0 0 1px rgba(${rgb.white}, 0.24);
  }

  &:focus-visible {
    outline: none;
    background: rgba(${rgb.white}, 0.05);
    box-shadow:
      inset 0 0 0 1px ${color.brand},
      0 0 0 4px rgba(${rgb.brand}, 0.16);
  }

  &[aria-invalid='true'] {
    box-shadow: inset 0 0 0 1px ${color.danger};
    background: ${color.dangerTint};
  }
`;

export const Input = styled.input`
  ${controlStyles}
`;

export const Textarea = styled.textarea`
  ${controlStyles}
  min-height: 9rem;
  resize: vertical;
  line-height: ${font.leading.normal};
`;
