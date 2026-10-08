import { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from '@/theme/tokens';

interface EntranceWordsProps {
  text: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between consecutive words. */
  step?: number;
}

/**
 * Cinematic word-by-word entrance for page titles. Pure CSS, so it starts with
 * the prerendered HTML on first paint instead of waiting for JavaScript.
 * Spaces stay real text: the title wraps and reads like plain text.
 */
export function EntranceWords({ text, delay = 0.12, step = 0.055 }: EntranceWordsProps) {
  const words = text.split(' ');
  return words.map((word, index) => (
    <Fragment key={`${word}-${String(index)}`}>
      <Mask>
        <Word style={{ animationDelay: `${(delay + index * step).toFixed(3)}s` }}>{word}</Word>
      </Mask>
      {index < words.length - 1 ? ' ' : null}
    </Fragment>
  ));
}

const rise = keyframes`
  from { transform: translate3d(0, 108%, 0); }
  to { transform: none; }
`;

const Mask = styled.span`
  display: inline-block;
  overflow: clip;
  padding-block: 0.14em;
  margin-block: -0.14em;
  vertical-align: top;
`;

const Word = styled.span`
  display: inline-block;
  animation: ${rise} 1.05s ${motion.css.out} both;
`;
