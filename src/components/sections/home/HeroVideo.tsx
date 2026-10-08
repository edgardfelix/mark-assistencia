import { Pause, Play } from 'lucide-react';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { lcpImages } from '@/config/lcp';
import { a11y } from '@/content/common';
import { homeContent } from '@/content/home';
import { useDataSaver, useIsClient } from '@/hooks/useClientEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { heroVideo } from '@/lib/media';
import { media } from '@/theme/media';
import { color, layout, motion, rgb, space } from '@/theme/tokens';

/**
 * Hero footage. The poster (first frame of the loop) is server-rendered and is
 * the LCP image; the muted, silent loop is attached only in the browser, after
 * the page has loaded, only when motion is welcome and data saving is off, and
 * pauses off-screen.
 * WCAG 2.2.2: the loop can always be paused (or started, for reduced motion).
 */
export function HeroVideo() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const isClient = useIsClient();
  const reduced = usePrefersReducedMotion();
  const saveData = useDataSaver();
  const inView = useInView(frame, { amount: 0.1 });

  /** null until the visitor uses the toggle; then their choice wins. */
  const [choice, setChoice] = useState<'play' | 'pause' | null>(null);
  const [playing, setPlaying] = useState(false);
  /** Once the loop has started it stays mounted, so pausing keeps the current frame. */
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  /** The ~1 MB loop must not compete with first-load resources: wait for load + idle. */
  const [pageIdle, setPageIdle] = useState(false);

  useEffect(() => {
    let idleHandle: number | undefined;
    let frameHandle: number | undefined;
    const markIdle = () => {
      setPageIdle(true);
    };
    // Safari has no requestIdleCallback: the next frame after `load` is a fine fallback.
    const supportsIdle = typeof window.requestIdleCallback === 'function';
    const whenIdle = () => {
      if (supportsIdle) idleHandle = window.requestIdleCallback(markIdle, { timeout: 2000 });
      else frameHandle = requestAnimationFrame(markIdle);
    };
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
    return () => {
      window.removeEventListener('load', whenIdle);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (frameHandle !== undefined) window.cancelAnimationFrame(frameHandle);
    };
  }, []);

  const wantsPlay = choice ? choice === 'play' : !reduced && !saveData;
  const mountVideo = isClient && !failed && (pageIdle || choice === 'play') && (wantsPlay || started);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (wantsPlay && inView) {
      el.play().catch(() => {
        // Autoplay refused (e.g. low-power mode): the poster stays and the toggle offers to play.
      });
    } else {
      el.pause();
    }
  }, [wantsPlay, inView, mountVideo]);

  return (
    <Frame ref={frame}>
      <Poster id={lcpImages.home.id} alt={homeContent.hero.posterAlt} sizes={lcpImages.home.sizes} priority />
      {mountVideo ? (
        <Video
          ref={video}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          data-visible={started}
          onPlaying={() => {
            setPlaying(true);
            setStarted(true);
          }}
          onPause={() => {
            setPlaying(false);
          }}
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
        >
          <source src={heroVideo.webm} type='video/webm; codecs="vp9"' />
          {/* An error on the last <source> means every candidate failed: keep the poster, drop the toggle. */}
          <source
            src={heroVideo.mp4}
            type='video/mp4; codecs="avc1.640028"'
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          />
        </Video>
      ) : null}
      <Shade aria-hidden="true" />
      {isClient && !failed ? (
        <Toggle
          type="button"
          onClick={() => {
            setChoice(playing ? 'pause' : 'play');
          }}
        >
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          <span>{playing ? a11y.pauseVideo : a11y.playVideo}</span>
        </Toggle>
      ) : null}
    </Frame>
  );
}

const Frame = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  background: ${color.ink950};
`;

const Poster = styled(ResponsiveImage)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.9s ${motion.css.out};

  &[data-visible='true'] {
    opacity: 1;
  }
`;

/* Screen glass: a soft reflection and inner vignette (desktop device frame). */
const Shade = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(115deg, rgba(${rgb.white}, 0.1) 0%, transparent 28%),
    radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0, 0, 0, 0.55) 100%);

  /* Phones/tablets: the footage is a full-bleed background behind the copy. */
  ${media.down('lg')} {
    background:
      linear-gradient(
        to top,
        ${color.ink900} 0%,
        rgba(${rgb.ink}, 0.92) 30%,
        rgba(${rgb.ink}, 0.55) 58%,
        rgba(${rgb.ink}, 0.35) 78%,
        rgba(${rgb.ink}, 0.75) 100%
      ),
      radial-gradient(90% 60% at 80% 20%, rgba(${rgb.brand}, 0.12), transparent 70%);
  }
`;

const Toggle = styled.button`
  position: absolute;
  right: ${space[4]};
  bottom: ${space[4]};
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: ${space[2]};
  height: 2.5rem;
  padding-inline: ${space[4]};
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${color.text};
  /* Sits over the playing video: no backdrop blur (it would re-run every frame). */
  background: rgba(${rgb.ink}, 0.72);
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.55);
  }

  ${media.down('lg')} {
    top: calc(${layout.headerHeight} + env(safe-area-inset-top) + ${space[3]});
    bottom: auto;
    right: ${layout.gutter};
    height: 2.75rem;
    width: 2.75rem;
    padding: 0;
    justify-content: center;

    span {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
  }
`;
