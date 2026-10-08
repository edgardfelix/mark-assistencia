import { ProductCatalog } from '@/components/sections/products/ProductCatalog';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { PageHero } from '@/components/sections/shared/PageHero';
import { productsContent } from '@/content/pages';

/**
 * Products: the promise (hero) → the catalog (cards and details) → action.
 * Every product has its own WhatsApp message with its name, price and context.
 */
export default function ProductsPage() {
  const { hero, cta } = productsContent;
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} titleAccent={hero.titleAccent} lead={hero.lead} />
      <ProductCatalog />
      <CtaBand
        id="produtos-cta"
        eyebrow={cta.eyebrow}
        title={cta.title}
        text={cta.text}
        message="accessories"
        placement="produtos-final"
      />
    </>
  );
}
