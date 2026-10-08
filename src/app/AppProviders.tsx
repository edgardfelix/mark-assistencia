import { type ReactNode } from 'react';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { GlobalStyle } from '@/styles/GlobalStyle';

/** Providers shared by the browser entry and the static prerender. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <GlobalStyle />
      {children}
    </MotionProvider>
  );
}
