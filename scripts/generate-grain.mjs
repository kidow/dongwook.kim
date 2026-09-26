// Generates public/grain.png: a 128px tile of per-pixel film grain for the
// page backdrop. Each pixel is a uniform random value in [-0.5, 0.5] (like
// Componentry's Grain Gradient shader); positive values become white and
// negative values black, with alpha proportional to the magnitude, so the
// tile lightens and darkens the gradient underneath.
//
// Run: node scripts/generate-grain.mjs
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const SIZE = 128
// Peak alpha of a grain pixel (0-1).
const STRENGTH = 0.09

// Seeded PRNG so the committed tile is reproducible.
let seed = 0x9e3779b9
function random() {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// Gray + alpha scanlines, each prefixed with filter type 0.
const raw = Buffer.alloc(SIZE * (SIZE * 2 + 1))
for (let y = 0; y < SIZE; y++) {
  const row = y * (SIZE * 2 + 1)
  for (let x = 0; x < SIZE; x++) {
    const noise = random() - 0.5
    raw[row + 1 + x * 2] = noise > 0 ? 255 : 0
    raw[row + 2 + x * 2] = Math.round(Math.abs(noise) * 2 * STRENGTH * 255)
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

const header = Buffer.alloc(13)
header.writeUInt32BE(SIZE, 0)
header.writeUInt32BE(SIZE, 4)
header[8] = 8 // bit depth
header[9] = 4 // gray + alpha

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', header),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
])

writeFileSync(new URL('../public/grain.png', import.meta.url), png)
console.log(`public/grain.png ${png.length} bytes`)
