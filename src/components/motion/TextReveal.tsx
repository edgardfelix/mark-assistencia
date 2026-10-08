import { m } from 'motion/react';
import { Fragment } from 'react';
import styled from 'styled-components';
import { motion as tokens } from '@/theme/tokens';
import { viewportOnce } from './variants';

type HeadingTag = 'h1' | 'h2' | 'h3';

interface TextRevealProps {
  text: string;
  as?: HeadingTag;
  id?: string;
  className?: string;
  delay?: number;
}

const headings = { h1: m.h1, h2: m.h2, h3: m.h3 } as const;

const wordVariants = {
  hidden: { y: '108%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: tokens.ease.out } },
};

/**
 * Word-by-word masked reveal for section headings. Words are split on spaces
 * only (never letters) and the spaces stay real text, so the heading wraps and
 * is read by screen readers exactly like plain text.
 */
export function TextReveal({ text, as = 'h2', id, className, delay = 0 }: TextRevealProps) {
  const Heading = headings[as];
  const words = text.split(' ');
  return (
    <Heading
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: delay } } }}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${String(index)}`}>
          <Mask>
            <m.span data-reveal="" style={{ display: 'inline-block' }} variants={wordVariants}>
              {word}
            </m.span>
          </Mask>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Heading>
  );
}

/* Padding keeps accents (Ê, Ç) and descenders inside the clipping box. */
const Mask = styled.span`
  display: inline-block;
  overflow: clip;
  padding-block: 0.14em;
  margin-block: -0.14em;
  vertical-align: top;
`;
