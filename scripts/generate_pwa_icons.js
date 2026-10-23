import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // Simple solid color PNG generator with basic CRC32 and deflated scanlines
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      crc = crc ^ byte;
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const combined = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(combined), 0);
    return Buffer.concat([len, combined, crcBuf]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 2; // Truecolor (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw image data with elevator blue styling
  // scanlines: 1 filter byte + width * 3 bytes
  const scanlineLength = 1 + width * 3;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      // Gradient / stylized center icon
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isInner = dist < width * 0.35;
      const isRing = dist >= width * 0.35 && dist < width * 0.38;

      if (isRing) {
        rawData[pixelOffset] = 56;     // cyan #38BDF8
        rawData[pixelOffset + 1] = 189;
        rawData[pixelOffset + 2] = 248;
      } else if (isInner) {
        // Cyan elevator cab accent
        rawData[pixelOffset] = 14;     // deep cyan #0EA5E9
        rawData[pixelOffset + 1] = 165;
        rawData[pixelOffset + 2] = 233;
      } else {
        // Dark navy brand background #0B192C
        rawData[pixelOffset] = 11;
        rawData[pixelOffset + 1] = 25;
        rawData[pixelOffset + 2] = 44;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = chunk('IDAT', compressedData);
  const ihdrChunk = chunk('IHDR', ihdr);
  const iendChunk = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192, 11, 25, 44));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512, 11, 25, 44));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, 11, 25, 44));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180, 11, 25, 44));
console.log('PWA PNG icons generated successfully!');
