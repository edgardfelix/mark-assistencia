import { m, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router';
import styled from 'styled-components';
import { pageSeo } from '@/config/seo';
import { siteUrl } from '@/config/site';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { applyHeadTags, buildHeadTags } from '@/lib/seo/head';
import { smoothScroll } from '@/lib/smooth-scroll';
import { isRouteHandle } from '@/routes/handle';
import { motion, zIndex } from '@/theme/tokens';
import { AmbientLight } from '../motion/AmbientLight';
import { NavigationProgress, RouteAnnouncer, SkipLink } from './Accessibility';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

function useCurrentSeo() {
  const matches = useMatches();
  for (let i = matches.length - 1; i >= 0; i--) {
    const handle = matches[i]?.handle;
    if (isRouteHandle(handle)) return handle.seo;
  }
  return pageSeo.home;
}

/** Enables smooth wheel scrolling only where it helps (see lib/smooth-scroll). */
function useSmoothScroll() {
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  useEffect(() => {
    if (finePointer && !reduced) void smoothScroll.enable();
    else smoothScroll.disable();
    return () => {
      smoothScroll.disable();
    };
  }, [finePointer, reduced]);
}

export function RootLayout() {
  const location = useLocation();
  const seo = useCurrentSeo();
  const sentinel = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const atTop = useInView(sentinel, { initial: true });
  // The first location renders without a page transition (server HTML is final).
  const [initialKey] = useState(location.key);
  const lastPathname = useRef(location.pathname);

  useSmoothScroll();

  useEffect(() => {
    applyHeadTags(buildHeadTags(seo, siteUrl));
  }, [seo]);

  // Move focus to the new page's content after a client-side navigation.
  useEffect(() => {
    if (lastPathname.current === location.pathname) return;
    lastPathname.current = location.pathname;
    main.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <>
      <SkipLink />
      <TopSentinel ref={sentinel} aria-hidden="true" />
      <AmbientLight />
      <SiteHeader solid={!atTop} />
      <NavigationProgress />
      <Main id="conteudo" ref={main} tabIndex={-1}>
        <m.div
          key={location.pathname}
          initial={location.key === initialKey ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: motion.duration.base, ease: motion.ease.out }}
        >
          <Outlet />
        </m.div>
      </Main>
      <SiteFooter />
      <FloatingWhatsApp />
      <RouteAnnouncer title={seo.title} />
      <ScrollRestoration />
    </>
  );
}

const TopSentinel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 24px;
  pointer-events: none;
`;

const Main = styled.main`
  position: relative;
  z-index: ${zIndex.raised};
  display: block;
  min-height: 60svh;
`;
