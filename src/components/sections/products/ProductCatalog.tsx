import { Info } from 'lucide-react';
import { m } from 'motion/react';
import styled from 'styled-components';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { staggerVariants, viewportOnce } from '@/components/motion/variants';
import { Container, Section } from '@/components/ui/Layout';
import { Eyebrow } from '@/components/ui/Typography';
import { productsContent } from '@/content/pages';
import { products } from '@/data/products';
import { useProductSelection } from '@/hooks/useProductSelection';
import { media } from '@/theme/media';
import { color, font, radius, rgb, space } from '@/theme/tokens';
import { ProductCard } from './ProductCard';
import { ProductSheet } from './ProductSheet';

const copy = productsContent.catalog;

/**
 * The catalog: one column on phones, two on tablets, three from 1024 px.
 * Cards reveal in reading order; opening a card shows its details in a sheet
 * whose state lives in the URL (see useProductSelection).
 */
export function ProductCatalog() {
  const { selected, open, close } = useProductSelection();

  return (
    <Wrapper aria-labelledby="catalogo-titulo" $flush="top">
      <Container>
        <Head>
          <div>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <Title id="catalogo-titulo" text={copy.title} />
          </div>
          <Reveal delay={0.1}>
            <Note>
              <NoteIcon aria-hidden="true">
                <Info size={18} />
              </NoteIcon>
              <span>{copy.note}</span>
            </Note>
          </Reveal>
        </Head>

        <Grid
          role="list"
          variants={staggerVariants(0.08, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={open} />
          ))}
        </Grid>
      </Container>
      <ProductSheet product={selected} onClose={close} />
    </Wrapper>
  );
}

const Wrapper = styled(Section)`
  padding-top: clamp(2.5rem, 1.5rem + 3vw, 4.5rem);
`;

const Head = styled.header`
  display: grid;
  gap: ${space[6]};
  margin-bottom: clamp(2rem, 1.25rem + 2.5vw, 3.5rem);

  & > div:first-child {
    display: grid;
    gap: ${space[5]};
  }

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    align-items: end;
    gap: ${space[16]};
  }
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  /* em, not ch: stays the same when the web font replaces the fallback (no re-wrap). */
  max-width: 10.5em;
`;

const Note = styled.p`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${space[4]};
  align-items: start;
  padding: ${space[4]} ${space[5]};
  border-radius: ${radius.lg};
  font-size: ${font.size.small};
  color: ${color.textMuted};
  background: rgba(${rgb.white}, 0.02);
  box-shadow: inset 0 0 0 1px ${color.line};
`;

const NoteIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${radius.md};
  color: ${color.brand};
  background: ${color.brandTint};
  box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.22);
`;

/*
 * Intrinsic grid: as many 15rem columns as fit, never more than three
 * (each column is at least a third of the row). One column on phones in
 * portrait, two on large phones and tablets, three on desktops — and 15rem
 * keeps the WhatsApp button inside its card at every width.
 */
const Grid = styled(m.ul)`
  --gap: clamp(1rem, 0.75rem + 0.9vw, 1.5rem);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(max(15rem, calc((100% - 2 * var(--gap)) / 3)), 1fr));
  gap: var(--gap);
  margin: 0;
  padding: 0;
  list-style: none;
`;
