import { Mail, Phone } from 'lucide-react';
import styled from 'styled-components';
import { JumpLink } from '@/components/common/JumpLink';
import { PageHero } from '@/components/sections/shared/PageHero';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { Container, Section, VisuallyHidden } from '@/components/ui/Layout';
import { business } from '@/config/business';
import { a11y, whatsappMessages } from '@/content/common';
import { type LegalDocument } from '@/content/legal';
import { display } from '@/lib/format';
import { mailtoUrl, telUrl, whatsappUrl } from '@/lib/links';
import { media } from '@/theme/media';
import { color, font, layout, radius, rgb, space } from '@/theme/tokens';

/** Long-form legal text: readable measure, table of contents, plain language. */
export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <>
      <PageHero eyebrow={document.eyebrow} title={document.title} lead={document.lead}>
        <Updated>
          Última atualização: <time dateTime={document.updatedAt.iso}>{document.updatedAt.label}</time>
        </Updated>
      </PageHero>
      <Section $flush="top">
        <Container>
          <Layout>
            <Toc aria-labelledby="indice-titulo">
              <TocTitle id="indice-titulo">{document.tocLabel}</TocTitle>
              <ol>
                {document.sections.map((section) => (
                  <li key={section.id}>
                    <JumpLink targetId={section.id}>{section.title}</JumpLink>
                  </li>
                ))}
              </ol>
            </Toc>
            <Article>
              {document.sections.map((section) => (
                <Block key={section.id} id={section.id} tabIndex={-1} aria-labelledby={`${section.id}-titulo`}>
                  <h2 id={`${section.id}-titulo`}>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items ? (
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.withContact ? <ContactLinks /> : null}
                </Block>
              ))}
            </Article>
          </Layout>
        </Container>
      </Section>
    </>
  );
}

function ContactLinks() {
  return (
    <Contacts>
      <li>
        <a href={mailtoUrl()}>
          <Mail size={16} aria-hidden="true" />
          {business.email}
        </a>
      </li>
      <li>
        <a href={telUrl}>
          <Phone size={16} aria-hidden="true" />
          {display.phone}
        </a>
      </li>
      <li>
        <a href={whatsappUrl(whatsappMessages.general)} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={16} />
          WhatsApp
          <VisuallyHidden> {a11y.opensInNewTab}</VisuallyHidden>
        </a>
      </li>
    </Contacts>
  );
}

const Updated = styled.p`
  font-size: ${font.size.small};
  color: ${color.textSubtle};

  time {
    color: ${color.textMuted};
  }
`;

const Layout = styled.div`
  display: grid;
  gap: ${space[10]};
  padding-top: ${space[10]};

  ${media.up('lg')} {
    grid-template-columns: 16rem minmax(0, ${layout.proseWidth});
    justify-content: space-between;
    gap: ${space[16]};
  }
`;

const Toc = styled.nav`
  align-self: start;
  padding: ${space[6]};
  border-radius: ${radius.lg};
  background: ${color.ink850};
  box-shadow: inset 0 0 0 1px ${color.line};

  ${media.up('lg')} {
    position: sticky;
    top: calc(${layout.headerHeight} + ${space[6]});
  }

  ol {
    display: grid;
    gap: ${space[1]};
    margin: ${space[3]} 0 0;
    padding: 0;
    list-style: none;
    counter-reset: toc;
  }

  li {
    counter-increment: toc;
  }

  a {
    display: flex;
    gap: ${space[3]};
    padding-block: ${space[1]};
    font-size: ${font.size.small};
    color: ${color.textMuted};
    transition: color 0.3s;

    &::before {
      content: counter(toc, decimal-leading-zero);
      font-variant-numeric: tabular-nums;
      color: ${color.textSubtle};
    }

    &:hover {
      color: ${color.brand};
    }
  }
`;

const TocTitle = styled.h2`
  font-size: ${font.size.eyebrow};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.eyebrow};
  text-transform: uppercase;
  color: ${color.textSubtle};
`;

const Article = styled.div`
  display: grid;
  gap: ${space[12]};
`;

const Block = styled.section`
  display: grid;
  gap: ${space[4]};
  scroll-margin-top: calc(${layout.headerHeight} + ${space[8]});

  &:focus {
    outline: none;
  }

  h2 {
    font-size: ${font.size.h3};
    font-weight: ${font.weight.semibold};
  }

  p,
  li {
    color: ${color.textMuted};
    line-height: ${font.leading.relaxed};
  }

  ul {
    display: grid;
    gap: ${space[2]};
    margin: 0;
    padding-left: 1.25rem;
  }

  li::marker {
    color: ${color.brand};
  }
`;

const Contacts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[3]};
  margin-top: ${space[2]} !important;
  padding: 0 !important;
  list-style: none;

  a {
    display: inline-flex;
    align-items: center;
    gap: ${space[2]};
    min-height: 2.75rem;
    padding-inline: ${space[4]};
    border-radius: ${radius.pill};
    font-size: ${font.size.small};
    color: ${color.text};
    box-shadow: inset 0 0 0 1px ${color.lineStrong};
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.55);
    }
  }
`;
