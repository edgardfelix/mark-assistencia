import { RefreshCw } from 'lucide-react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import styled from 'styled-components';
import { cta } from '@/content/common';
import { errorContent } from '@/content/pages';
import { color, layout, space } from '@/theme/tokens';
import { WhatsAppButton } from '../common/ContactActions';
import { Button } from '../ui/Button';
import { Container } from '../ui/Layout';
import { Body, Eyebrow, H1 } from '../ui/Typography';

/** After a deploy, an open tab may request code chunks that no longer exist. */
function isStaleChunkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(
      error.message,
    )
  );
}

function ErrorView() {
  const error = useRouteError();
  const stale = isStaleChunkError(error);
  if (!isRouteErrorResponse(error)) console.error('[route error]', error);

  return (
    <Wrapper>
      <Container $narrow>
        <Eyebrow>{stale ? 'Atualização' : 'Erro'}</Eyebrow>
        <H1>{stale ? errorContent.outdatedTitle : errorContent.title}</H1>
        <Body>{stale ? errorContent.outdatedText : errorContent.text}</Body>
        <Actions>
          <Button
            icon={<RefreshCw size={18} aria-hidden="true" />}
            onClick={() => {
              window.location.reload();
            }}
          >
            {errorContent.retry}
          </Button>
          <WhatsAppButton variant="secondary" placement="error" message="general">
            {cta.whatsapp}
          </WhatsAppButton>
        </Actions>
      </Container>
    </Wrapper>
  );
}

/** Page-level errors: rendered inside the layout, header and footer stay. */
export function RouteErrorBoundary() {
  return <ErrorView />;
}

/** Last resort if the layout itself fails. */
export function RootErrorBoundary() {
  return (
    <main id="conteudo">
      <ErrorView />
    </main>
  );
}

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  min-height: 80svh;
  padding-top: calc(${layout.headerHeight} + ${space[16]});
  padding-bottom: ${space[16]};

  ${Container} {
    display: grid;
    gap: ${space[5]};
  }

  p {
    color: ${color.textMuted};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[3]};
  margin-top: ${space[4]};
`;
