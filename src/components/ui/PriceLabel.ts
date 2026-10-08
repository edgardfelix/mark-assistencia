import styled, { css } from 'styled-components';
import { color, font } from '@/theme/tokens';

/** Small label above a price ("A partir de", "Valor de referência"). */
export const priceLabelStyles = css`
  font-weight: ${font.weight.semibold};
  letter-spacing: 0.01em;
  line-height: 1.3;
  color: ${color.textMuted};
`;

/**
 * Label set above a `display` price ("Valor de referência"), sized like the
 * built-in "A partir de" prefix so every price in the system aligns the same way.
 */
export const PriceLabel = styled.span`
  ${priceLabelStyles}
  font-size: max(calc(${font.size.price} * 0.2), ${font.size.caption});
`;
