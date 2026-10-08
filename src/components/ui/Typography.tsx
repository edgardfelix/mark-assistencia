import styled from 'styled-components';
import { color, font, rgb, space } from '@/theme/tokens';

/** Small uppercase label with a light-tick, introducing a section. */
export const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: ${space[3]};
  font-size: ${font.size.eyebrow};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.eyebrow};
  text-transform: uppercase;
  color: ${color.brand};

  &::before {
    content: '';
    width: 1.75rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${color.brand});
    box-shadow: 0 0 10px rgba(${rgb.brand}, 0.7);
  }
`;

export const H1 = styled.h1`
  font-size: ${font.size.h1};
  font-weight: ${font.weight.bold};
  line-height: ${font.leading.tight};
  letter-spacing: ${font.tracking.tight};
`;

export const H2 = styled.h2`
  font-size: ${font.size.h2};
  font-weight: ${font.weight.bold};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
`;

export const H3 = styled.h3`
  font-size: ${font.size.h3};
  font-weight: ${font.weight.semibold};
  line-height: ${font.leading.heading};
  letter-spacing: ${font.tracking.snug};
`;

export const Lead = styled.p`
  font-size: ${font.size.lead};
  line-height: ${font.leading.relaxed};
  color: ${color.textMuted};
  max-width: 38rem;
`;

export const Body = styled.p`
  color: ${color.textMuted};
  max-width: 38rem;
`;

/** Brand-colored emphasis inside headings. */
export const Accent = styled.span`
  color: ${color.brand};
  text-shadow: 0 0 34px rgba(${rgb.brand}, 0.28);
`;

/** Standard section header: eyebrow, heading and optional intro, with rhythm. */
export const SectionHeader = styled.header<{ $align?: 'start' | 'center' }>`
  display: grid;
  gap: ${space[5]};
  justify-items: ${({ $align }) => ($align === 'center' ? 'center' : 'start')};
  text-align: ${({ $align }) => ($align === 'center' ? 'center' : 'start')};
  margin-bottom: clamp(2.5rem, 1.6rem + 3vw, 4.5rem);

  & > p:last-child:not(:first-child) {
    margin-top: ${space[1]};
  }
`;
