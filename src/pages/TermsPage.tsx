import { LegalDocumentView } from '@/components/sections/legal/LegalDocumentView';
import { termsOfUse } from '@/content/legal';

export default function TermsPage() {
  return <LegalDocumentView document={termsOfUse} />;
}
