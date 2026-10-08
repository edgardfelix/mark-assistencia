import manifest from '@/assets/media/manifest.json';

/** Hashed URLs of every generated media file (see scripts/process-media.mjs). */
const files = import.meta.glob<string>('../assets/media/*.{avif,webp,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function fileUrl(name: string): string {
  const url = files[`../assets/media/${name}`];
  if (!url) throw new Error(`[media] missing generated file "${name}" — run \`npm run media\`.`);
  return url;
}

export type ImageId = keyof typeof manifest.images;
export type BrandImageId = keyof typeof manifest.brand;

export interface ImageSource {
  type: 'image/avif' | 'image/webp';
  srcSet: string;
}

export interface ImageAsset {
  width: number;
  height: number;
  /** Dominant color, shown while the image loads. */
  color: string;
  sources: ImageSource[];
  /** Largest WebP, used by the <img> fallback. */
  src: string;
}

const srcSet = (id: string, widths: readonly number[], ext: 'avif' | 'webp') =>
  widths.map((w) => `${fileUrl(`${id}-${w}.${ext}`)} ${w}w`).join(', ');

export function getImage(id: ImageId): ImageAsset {
  const entry = manifest.images[id];
  const largest = entry.widths[entry.widths.length - 1] ?? entry.width;
  return {
    width: entry.width,
    height: entry.height,
    color: entry.color,
    sources: [
      { type: 'image/avif', srcSet: srcSet(id, entry.widths, 'avif') },
      { type: 'image/webp', srcSet: srcSet(id, entry.widths, 'webp') },
    ],
    src: fileUrl(`${id}-${largest}.webp`),
  };
}

/** Transparent brand renders (WebP with alpha) at 1x/2x widths. */
export const brandImages = {
  lockup: {
    ...manifest.brand['logo-lockup'],
    srcSet: `${fileUrl('logo-lockup-200.webp')} 200w, ${fileUrl('logo-lockup-400.webp')} 400w`,
    src: fileUrl('logo-lockup-400.webp'),
  },
  sign: {
    ...manifest.brand['logo-sign'],
    srcSet: `${fileUrl('logo-sign-640.webp')} 640w`,
    src: fileUrl('logo-sign-640.webp'),
  },
} as const;

export const heroVideo = {
  ...manifest.video['hero-loop'],
  webm: fileUrl('hero-loop.webm'),
  mp4: fileUrl('hero-loop.mp4'),
  poster: getImage('hero-poster'),
  ambient: fileUrl('hero-ambient.webp'),
} as const;
