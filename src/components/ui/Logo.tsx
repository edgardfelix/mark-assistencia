import { brandImages } from '@/lib/media';

interface LogoProps {
  width: number;
  className?: string;
  /** Pass an empty string when a parent element already provides the name. */
  alt?: string;
  /** Off-screen placements (footer, menu) load lazily. */
  loading?: 'eager' | 'lazy';
}

/**
 * Primary lockup (phone-in-hand "M" + MARK ASSISTÊNCIA), derived from the
 * official logo by removing the black background only — never redrawn.
 */
export function Logo({ width, className, alt = 'MARK ASSISTÊNCIA', loading = 'eager' }: LogoProps) {
  const { lockup } = brandImages;
  return (
    <img
      className={className}
      src={lockup.src}
      srcSet={lockup.srcSet}
      sizes={`${String(width)}px`}
      width={width}
      height={Math.round((width * lockup.height) / lockup.width)}
      alt={alt}
      loading={loading}
      decoding="async"
    />
  );
}
