/**
 * Media pipeline — turns the original client assets in /assets (never modified)
 * into optimized, art-directed derivatives used by the site.
 *
 * Outputs
 *   src/assets/media/*.{avif,webp,mp4,webm}   responsive images, video loop, stills
 *   src/assets/media/manifest.json            dimensions, widths and placeholder colors
 *   public/                                   favicons, app icons, Open Graph image
 *
 * Video steps (loop, poster, stills) need ffmpeg. Set FFMPEG_PATH or put ffmpeg on
 * PATH; without it those steps are skipped and the committed outputs are kept.
 *
 * Usage: npm run media
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets');
const OUT = join(ROOT, 'src', 'assets', 'media');
const PUBLIC = join(ROOT, 'public');
const MANIFEST = join(OUT, 'manifest.json');

const VIDEO_SOURCE = join(SRC, 'service-video', 'service-video-1.mp4');

/**
 * The hero loop is edited only at the source's own scene cuts (detected with
 * ffmpeg's scene filter): bench close-up (8.86–16.16 s) followed by the
 * disassembly sequence (1.72–8.86 s). This drops the blurred face close-up at
 * the start and the burned-in caption (cropped at both edges) after 19.06 s.
 * The wrap point (8.86 s → 8.86 s) is continuous in the original edit.
 */
const LOOP_SEGMENTS = [
  [8.856, 16.16],
  [1.72, 8.856],
];

/** Stills taken from the bench footage (seconds into the source video). */
const VIDEO_STILLS = {
  'bench-precision': 11.4,
  'glass-removal': 5.2,
  'device-internals': 8.2,
  'bench-detail': 13.4,
};

const PHOTO = { avif: { quality: 52, effort: 6, chromaSubsampling: '4:2:0' }, webp: { quality: 76, effort: 5 } };
/** Screenshots carry small text: keep full chroma and a higher quality. */
const SCREENSHOT = {
  avif: { quality: 62, effort: 6, chromaSubsampling: '4:4:4' },
  webp: { quality: 84, effort: 5, smartSubsample: true },
};

/** Product shots: packaging text must stay crisp (full chroma, higher quality). */
const PRODUCT = {
  avif: { quality: 60, effort: 6, chromaSubsampling: '4:4:4' },
  webp: { quality: 82, effort: 5, smartSubsample: true },
};

/**
 * Product photos supplied by the client in assets/produtos (each file is named
 * after its product). `square` frames every shot the same way without
 * distorting it: the short side is extended with the photo's own edge pixels.
 * The Motorola picture is a reseller's ad: the crop keeps the charger and the
 * cable and leaves out the "ENVIO IMEDIATO" badge (a shipping promise the store
 * never made) and the ad copy, down to the blue underline below it.
 */
const PRODUCT_SPECS = [
  { id: 'product-jbl-tune-520bt', file: 'produtos/Fone de Ouvido JBL Tune 520BT.jpeg' },
  { id: 'product-cabo-xiaomi-6a', file: 'produtos/Cabo USB-C Xiaomi 6A.jpeg' },
  { id: 'product-cabo-samsung', file: 'produtos/Cabo USB-C Samsung Original.jpeg' },
  {
    id: 'product-carregador-motorola-68w',
    file: 'produtos/Carregador Motorola TurboPower 68W.jpeg',
    extract: { left: 0, top: 493, width: 592, height: 592 },
  },
  { id: 'product-cabo-kaidi-kd306', file: 'produtos/Cabo USB Kaidi KD-306 – 1 Metro.jpeg' },
  { id: 'product-cabo-kaidi-tipo-c', file: 'produtos/Cabo USB Kaidi Tipo-C – 1 Metro.jpeg' },
].map((spec) => ({ ...spec, square: true, widths: [360, 640, 'native'], preset: PRODUCT }));

/**
 * Art direction per image. `extract` crops are deliberate:
 *  - service-image-1: removes the social-media text banner baked into the top.
 *  - service-image-2/3: remove carousel arrow buttons captured with the screenshot.
 */
const IMAGE_SPECS = [
  { id: 'store-interior', file: 'service-images/service-image-4.jpeg', widths: [480, 800, 1283], preset: PHOTO },
  {
    id: 'repair-iphone-15-pro-max',
    file: 'service-images/service-image-1.jpeg',
    extract: { left: 0, top: 404, width: 924, height: 1196 },
    widths: [480, 924],
    preset: PHOTO,
  },
  {
    id: 'screen-cracked',
    file: 'service-images/service-image-2.jpeg',
    extract: { left: 152, top: 0, width: 978, height: 1363 },
    widths: [480, 978],
    preset: PHOTO,
  },
  {
    id: 'certificate',
    file: 'service-images/service-image-2.jpeg',
    extract: { left: 120, top: 70, width: 940, height: 372 },
    widths: [480, 940],
    preset: PHOTO,
  },
  {
    id: 'bench-iphone',
    file: 'service-images/service-image-3.jpeg',
    extract: { left: 50, top: 0, width: 1046, height: 1600 },
    widths: [480, 800, 1046],
    preset: PHOTO,
  },
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({
    id: `feedback-${n}`,
    file: `feedback-images/feedback-image-${n}.jpeg`,
    widths: [360, 'native'],
    preset: SCREENSHOT,
  })),
  ...PRODUCT_SPECS,
];

const log = (...args) => console.log('[media]', ...args);

function findFfmpeg() {
  const candidates = [process.env.FFMPEG_PATH, 'ffmpeg'].filter(Boolean);
  for (const bin of candidates) {
    const probe = spawnSync(bin, ['-hide_banner', '-version'], { encoding: 'utf8' });
    if (probe.status === 0) return bin;
  }
  return null;
}

const toHex = ({ r, g, b }) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

async function writeResponsive(id, input, { widths, preset }) {
  const meta = await sharp(input).metadata();
  const resolvedWidths = [...new Set(widths.map((w) => (w === 'native' ? meta.width : Math.min(w, meta.width))))].sort(
    (a, b) => a - b,
  );
  for (const width of resolvedWidths) {
    const base = sharp(input).resize({ width, withoutEnlargement: true });
    await base
      .clone()
      .avif(preset.avif)
      .toFile(join(OUT, `${id}-${width}.avif`));
    await base
      .clone()
      .webp(preset.webp)
      .toFile(join(OUT, `${id}-${width}.webp`));
  }
  const { dominant } = await sharp(input).stats();
  return { width: meta.width, height: meta.height, widths: resolvedWidths, color: toHex(dominant) };
}

/** Extends the short side with the image's own edge pixels so the frame is square (never stretches). */
async function squareFrame(buffer) {
  const { width, height } = await sharp(buffer).metadata();
  if (width === height) return buffer;
  const pad = Math.abs(width - height);
  const before = Math.floor(pad / 2);
  const extend = width > height ? { top: before, bottom: pad - before } : { left: before, right: pad - before };
  return sharp(buffer)
    .extend({ ...extend, extendWith: 'copy' })
    .png()
    .toBuffer();
}

async function processImages(manifest) {
  for (const spec of IMAGE_SPECS) {
    let input = sharp(join(SRC, spec.file));
    if (spec.extract) input = input.extract(spec.extract);
    // Products go through a lossless intermediate (no second JPEG pass before AVIF/WebP).
    let buffer = spec.square ? await input.png().toBuffer() : await input.toBuffer();
    if (spec.square) buffer = await squareFrame(buffer);
    manifest.images[spec.id] = await writeResponsive(spec.id, buffer, spec);
    log('image', spec.id, manifest.images[spec.id].widths.join('/'));
  }
}

/**
 * The only logo file is a JPEG of a neon sign on pure black. Unmultiplying
 * black (alpha = max channel) turns it into a transparent asset that is
 * pixel-identical to the original when composited over black, so the logo is
 * never redrawn or distorted. A small noise floor removes JPEG artifacts.
 */
async function unmultiplyBlack(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  const floor = 14;
  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    if (max <= floor) continue;
    const alpha = (max - floor) / (255 - floor);
    out[o] = Math.min(255, Math.round(r / alpha));
    out[o + 1] = Math.min(255, Math.round(g / alpha));
    out[o + 2] = Math.min(255, Math.round(b / alpha));
    out[o + 3] = Math.round(alpha * 255);
  }
  return { data: out, width: info.width, height: info.height };
}

function cropRgba(img, { left, top, width, height }, keep = () => true) {
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!keep(x + left, y + top)) continue;
      const s = ((y + top) * img.width + (x + left)) * 4;
      img.data.copy(out, (y * width + x) * 4, s, s + 4);
    }
  }
  return { data: out, width, height };
}

/** Fade alpha to zero near crop edges so no hard cut ever shows in a glow. */
function featherEdges(img, size) {
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const d = Math.min(x, y, img.width - 1 - x, img.height - 1 - y);
      if (d >= size) continue;
      const i = (y * img.width + x) * 4 + 3;
      img.data[i] = Math.round(img.data[i] * (d / size));
    }
  }
  return img;
}

function trimTransparent(img, threshold = 6, pad = 2) {
  let x0 = img.width;
  let y0 = img.height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (img.data[(y * img.width + x) * 4 + 3] > threshold) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
    }
  }
  const left = Math.max(0, x0 - pad);
  const top = Math.max(0, y0 - pad);
  return cropRgba(img, {
    left,
    top,
    width: Math.min(img.width, x1 + pad + 1) - left,
    height: Math.min(img.height, y1 + pad + 1) - top,
  });
}

const rawSharp = (img) => sharp(img.data, { raw: { width: img.width, height: img.height, channels: 4 } });

async function processBrand(manifest) {
  const logoFile = join(SRC, 'logo', 'logo-mark.jpeg');
  const sign = await unmultiplyBlack(logoFile);

  // Primary lockup (icon + MARK + ASSISTÊNCIA) without the sign frame and tagline row.
  // Frame lines sit at x≈32/1252 and y≈27/438; content spans x 76–1199, y 61–408.
  const lockup = trimTransparent(featherEdges(cropRgba(sign, { left: 46, top: 42, width: 1192, height: 388 }), 10));
  for (const width of [200, 400]) {
    await rawSharp(lockup)
      .resize({ width })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(join(OUT, `logo-lockup-${width}.webp`));
  }
  manifest.brand['logo-lockup'] = { width: lockup.width, height: lockup.height };
  log('brand logo-lockup', `${lockup.width}x${lockup.height}`);

  // Full sign (frame + tagline), used where the complete signage reads well.
  const fullSign = trimTransparent(sign, 6, 4);
  for (const width of [640]) {
    await rawSharp(fullSign)
      .resize({ width })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(join(OUT, `logo-sign-${width}.webp`));
  }
  manifest.brand['logo-sign'] = { width: fullSign.width, height: fullSign.height };

  // Symbol: the phone-in-hand "M" mark. The bottom-right corner is masked so the
  // first letter of "ASSISTÊNCIA" (which starts at x≈415, y≈320) is excluded.
  const symbol = trimTransparent(
    featherEdges(
      cropRgba(sign, { left: 46, top: 42, width: 404, height: 388 }, (x, y) => !(x > 404 && y > 312)),
      6,
    ),
  );
  manifest.brand['logo-symbol'] = { width: symbol.width, height: symbol.height };

  // App/fav icons: symbol on a graphite tile so it holds up on light and dark tab bars.
  const tile = async (size, { inset, radius }) => {
    const inner = Math.round(size * (1 - inset * 2));
    const glyph = await rawSharp(symbol)
      .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const background = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><radialGradient id="g" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="#1c1a10"/><stop offset="1" stop-color="#0b0b0d"/></radialGradient></defs><rect width="${size}" height="${size}" rx="${radius}" fill="url(#g)"/></svg>`,
    );
    return sharp(background)
      .composite([{ input: glyph, gravity: 'center' }])
      .png({ compressionLevel: 9, palette: size >= 180, quality: 92, effort: 10 });
  };
  await (await tile(180, { inset: 0.12, radius: 0 })).toFile(join(PUBLIC, 'apple-touch-icon.png'));
  await (await tile(192, { inset: 0.12, radius: 40 })).toFile(join(PUBLIC, 'icon-192.png'));
  await (await tile(512, { inset: 0.12, radius: 108 })).toFile(join(PUBLIC, 'icon-512.png'));
  await (await tile(512, { inset: 0.2, radius: 0 })).toFile(join(PUBLIC, 'icon-maskable-512.png'));
  const icoSizes = [16, 32, 48];
  const icoImages = await Promise.all(
    icoSizes.map(async (s) => (await tile(s, { inset: 0.04, radius: Math.round(s * 0.22) })).toBuffer()),
  );
  await (await tile(32, { inset: 0.04, radius: 7 })).toFile(join(PUBLIC, 'favicon-32.png'));
  writeFileSync(join(PUBLIC, 'favicon.ico'), buildIco(icoImages, icoSizes));
  log('brand icons + favicon.ico');

  // Open Graph image (1200×630): real store photo fading into graphite + full sign.
  const W = 1200;
  const H = 630;
  const photoWidth = 600;
  const photo = await sharp(join(SRC, 'service-images', 'service-image-4.jpeg'))
    .resize({ width: photoWidth, height: H, fit: 'cover', position: 'top' })
    .modulate({ brightness: 0.82 })
    .toBuffer();
  const fade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${photoWidth}" height="${H}"><defs><linearGradient id="f" x1="0" x2="1"><stop offset="0" stop-color="#0a0a0b" stop-opacity="1"/><stop offset=".55" stop-color="#0a0a0b" stop-opacity=".35"/><stop offset="1" stop-color="#0a0a0b" stop-opacity="0"/></linearGradient></defs><rect width="${photoWidth}" height="${H}" fill="url(#f)"/></svg>`,
  );
  const backdrop = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="glow" cx="34%" cy="50%" r="46%"><stop offset="0" stop-color="#fcdc12" stop-opacity=".16"/><stop offset="1" stop-color="#fcdc12" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="#0a0a0b"/><rect width="${W}" height="${H}" fill="url(#glow)"/></svg>`,
  );
  const signForOg = await rawSharp(fullSign).resize({ width: 640 }).png().toBuffer();
  const signMeta = await sharp(signForOg).metadata();
  await sharp(backdrop)
    .composite([
      { input: photo, left: W - photoWidth, top: 0 },
      { input: fade, left: W - photoWidth, top: 0 },
      { input: signForOg, left: 60, top: Math.round((H - signMeta.height) / 2) },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(join(PUBLIC, 'og-image.jpg'));
  log('brand og-image.jpg');
}

/** ICO container with PNG payloads (supported by every current browser). */
function buildIco(pngs, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + pngs.length * 16;
  pngs.forEach((png, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] % 256, 0);
    e.writeUInt8(sizes[i] % 256, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(e);
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}

async function processVideo(manifest, ffmpeg) {
  const work = mkdtempSync(join(tmpdir(), 'mark-media-'));
  try {
    const filter =
      LOOP_SEGMENTS.map(([s, e], i) => `[0:v]trim=start=${s}:end=${e},setpts=PTS-STARTPTS[s${i}]`).join(';') +
      `;${LOOP_SEGMENTS.map((_, i) => `[s${i}]`).join('')}concat=n=${LOOP_SEGMENTS.length}:v=1:a=0,fps=30,format=yuv420p[v]`;
    const common = [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      VIDEO_SOURCE,
      '-filter_complex',
      filter,
      '-map',
      '[v]',
      '-an',
      '-map_metadata',
      '-1',
    ];

    execFileSync(ffmpeg, [
      ...common,
      '-c:v',
      'libx264',
      '-profile:v',
      'high',
      '-level',
      '4.0',
      '-preset',
      'veryslow',
      '-crf',
      '27',
      '-tune',
      'film',
      '-g',
      '60',
      '-movflags',
      '+faststart',
      join(OUT, 'hero-loop.mp4'),
    ]);
    execFileSync(ffmpeg, [
      ...common,
      '-c:v',
      'libvpx-vp9',
      '-b:v',
      '0',
      '-crf',
      '38',
      '-deadline',
      'good',
      '-cpu-used',
      '1',
      '-row-mt',
      '1',
      '-g',
      '60',
      join(OUT, 'hero-loop.webm'),
    ]);
    const duration = LOOP_SEGMENTS.reduce((t, [s, e]) => t + (e - s), 0);
    manifest.video['hero-loop'] = { width: 480, height: 768, duration: Number(duration.toFixed(2)) };
    log('video hero-loop.mp4 + hero-loop.webm', `${duration.toFixed(2)}s`);

    // Poster = first frame of the loop, so the swap from poster to video is seamless.
    const stills = { 'hero-poster': LOOP_SEGMENTS[0][0] + 0.014, ...VIDEO_STILLS };
    for (const [id, time] of Object.entries(stills)) {
      const png = join(work, `${id}.png`);
      execFileSync(ffmpeg, [
        '-y',
        '-hide_banner',
        '-loglevel',
        'error',
        '-ss',
        String(time),
        '-i',
        VIDEO_SOURCE,
        '-frames:v',
        '1',
        png,
      ]);
      manifest.images[id] = await writeResponsive(id, readFileSync(png), { widths: ['native'], preset: PHOTO });
      log('still', id, `@${time}s`);
    }

    // Pre-blurred ambient plate for the desktop hero background (no runtime blur cost).
    await sharp(join(work, 'hero-poster.png'))
      .resize({ width: 96 })
      .blur(5)
      .modulate({ brightness: 0.85, saturation: 1.15 })
      .webp({ quality: 70 })
      .toFile(join(OUT, 'hero-ambient.webp'));
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  mkdirSync(PUBLIC, { recursive: true });
  const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
  const manifest = { images: {}, brand: {}, video: previous.video ?? {} };

  const ffmpeg = findFfmpeg();
  if (ffmpeg) {
    await processVideo(manifest, ffmpeg);
  } else {
    log('ffmpeg not found — keeping committed video outputs and stills');
    for (const id of ['hero-poster', ...Object.keys(VIDEO_STILLS)]) {
      if (previous.images?.[id]) manifest.images[id] = previous.images[id];
    }
  }
  await processImages(manifest);
  await processBrand(manifest);

  const sorted = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(
    MANIFEST,
    `${JSON.stringify({ images: sorted(manifest.images), brand: sorted(manifest.brand), video: sorted(manifest.video) }, null, 2)}\n`,
  );
  log('manifest written');
}

await main();
