import { ImageOff } from 'lucide-react';
import { type CSSProperties, useState } from 'react';
import styled from 'styled-components';
import { getImage, type ImageId } from '@/lib/media';
import { color, font, motion, space } from '@/theme/tokens';

interface ResponsiveImageProps {
  id: ImageId;
  alt: string;
  /** Rendered width hint for the browser (the `sizes` attribute). */
  sizes: string;
  /** Above-the-fold images load eagerly with high priority (LCP). */
  priority?: boolean;
  fit?: 'cover' | 'contain';
  position?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * <picture> with AVIF and WebP candidates, intrinsic width/height (no layout
 * shift), a dominant-color placeholder and a graceful fallback if loading fails.
 */
export function ResponsiveImage({
  id,
  alt,
  sizes,
  priority = false,
  fit = 'cover',
  position = 'center',
  className,
  style,
}: ResponsiveImageProps) {
  const image = getImage(id);
  const [failed, setFailed] = useState(false);

  // The image may fail before React attaches onError (server-rendered HTML),
  // so the element is also checked once it is attached.
  const checkBroken = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0 && img.currentSrc) setFailed(true);
  };

  if (failed) {
    return (
      <Fallback className={className} style={style} role="img" aria-label={alt}>
        <ImageOff size={22} aria-hidden="true" />
        <span>Imagem indisponível</span>
      </Fallback>
    );
  }

  return (
    <Picture className={className} style={{ ...style, backgroundColor: `${image.color}33` }}>
      {image.sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      <Img
        ref={checkBroken}
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => {
          setFailed(true);
        }}
        $fit={fit}
        $position={position}
      />
    </Picture>
  );
}

const Picture = styled.picture`
  display: block;
  overflow: hidden;
`;

const Img = styled.img<{ $fit: 'cover' | 'contain'; $position: string }>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ $fit }) => $fit};
  object-position: ${({ $position }) => $position};
  transition: transform 1.1s ${motion.css.out};
`;

const Fallback = styled.div`
  display: grid;
  place-content: center;
  justify-items: center;
  gap: ${space[2]};
  min-height: 12rem;
  height: 100%;
  background:
    repeating-linear-gradient(135deg, transparent 0 14px, rgba(255, 255, 255, 0.025) 14px 15px), ${color.ink800};
  color: ${color.textSubtle};
  font-size: ${font.size.caption};
`;
