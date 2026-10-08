import { LegalDocumentView } from '@/components/sections/legal/LegalDocumentView';
import { privacyPolicy } from '@/content/legal';

export default function PrivacyPage() {
  return <LegalDocumentView document={privacyPolicy} />;
}
