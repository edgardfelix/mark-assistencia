import styled, { css } from 'styled-components';
import { layout } from '@/theme/tokens';

export const Container = styled.div<{ $wide?: boolean; $narrow?: boolean }>`
  position: relative;
  width: 100%;
  margin-inline: auto;
  padding-inline: ${layout.gutter};
  max-width: calc(${layout.maxWidth} + 2 * ${layout.gutter});

  ${({ $wide }) =>
    $wide &&
    css`
      max-width: calc(${layout.wideWidth} + 2 * ${layout.gutter});
    `}

  ${({ $narrow }) =>
    $narrow &&
    css`
      max-width: calc(${layout.proseWidth} + 2 * ${layout.gutter});
    `}
`;

export const Section = styled.section<{ $flush?: 'top' | 'bottom' }>`
  position: relative;
  padding-block: ${layout.sectionY};

  ${({ $flush }) =>
    $flush === 'top' &&
    css`
      padding-top: 0;
    `}
  ${({ $flush }) =>
    $flush === 'bottom' &&
    css`
      padding-bottom: 0;
    `}
`;

/**
 * Below-the-fold wrapper: the browser skips layout and paint of its content
 * until it approaches the viewport (long pages stay cheap on modest phones).
 * `auto` in contain-intrinsic-size remembers the real height once rendered.
 */
export const DeferredSection = styled.div<{ $estimate?: number }>`
  content-visibility: auto;
  contain-intrinsic-size: auto ${({ $estimate = 900 }) => $estimate}px;
`;

export const VisuallyHidden = styled.span`
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;
