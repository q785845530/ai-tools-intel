// lib/cover.js —— 零依赖 PNG 封面生成器（纯 Node 内置 zlib，不装任何图形库）
// 微信草稿 API 强制要求封面图，而本环境无 ImageMagick/canvas，故自己写 PNG 编码。
'use strict';
const zlib = require('node:zlib');

// CRC32（PNG 规范要求）
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** 把 RGB 像素矩阵编码成 PNG Buffer */
function encodePNG(width, height, pixelFn) {
  const raw = Buffer.alloc(height * (width * 3 + 1));
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixelFn(x, y, width, height);
      raw[o++] = r & 0xff; raw[o++] = g & 0xff; raw[o++] = b & 0xff;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 2;   // color type: truecolor
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// 主题色板（深色科技风，贴合「智能制造」调性）
const PALETTES = {
  manufacturing: [[15, 23, 42], [30, 64, 175], [56, 189, 248], [241, 245, 249]], // 深蓝→亮蓝
  ai: [[12, 10, 30], [76, 29, 149], [167, 139, 250], [250, 250, 255]],           // 紫
  tech: [[7, 20, 24], [13, 105, 100], [45, 212, 191], [240, 253, 250]],          // 青
};

/**
 * 生成封面图（微信推荐 900x383，即 2.35:1）
 * @param {string} variant manufacturing|ai|tech
 * @param {object} opts {width,height,variant}
 */
function cover({ variant = 'manufacturing', width = 900, height = 383 } = {}) {
  const [c0, c1, c2, c3] = PALETTES[variant] || PALETTES.manufacturing;
  return encodePNG(width, height, (x, y, w, h) => {
    const fx = x / w, fy = y / h;
    // 对角渐变底色
    const t = Math.min(1, Math.max(0, (fx * 0.75 + fy * 0.25)));
    const lerp = (a, b, k) => Math.round(a + (b - a) * k);
    let r = lerp(c0[0], c1[0], t), g = lerp(c0[1], c1[1], t), b = lerp(c0[2], c1[2], t);
    // 斜向光带（增加科技感层次）
    const band = Math.abs((fx + fy * 0.5) % 0.45 - 0.225);
    if (band < 0.035) {
      const k = (1 - band / 0.035) * 0.55;
      r = lerp(r, c2[0], k); g = lerp(g, c2[1], k); b = lerp(b, c2[2], k);
    }
    // 左下角高亮基点
    const d = Math.hypot(fx - 0.15, fy - 0.8);
    if (d < 0.35) {
      const k = (1 - d / 0.35) * 0.25;
      r = lerp(r, c3[0], k); g = lerp(g, c3[1], k); b = lerp(b, c3[2], k);
    }
    // 底部暗角，便于叠标题
    if (fy > 0.62) {
      const k = (fy - 0.62) / 0.38 * 0.4;
      r = lerp(r, 0, k); g = lerp(g, 0, k); b = lerp(b, 0, k);
    }
    return [r, g, b];
  });
}

module.exports = { cover, encodePNG };

if (require.main === module) {
  const fs = require('node:fs');
  const path = require('node:path');
  const out = path.resolve(__dirname, '..', 'data', 'covers');
  fs.mkdirSync(out, { recursive: true });
  for (const v of Object.keys(PALETTES)) {
    const f = path.join(out, `cover-${v}.png`);
    fs.writeFileSync(f, cover({ variant: v }));
    console.log(`${f}  ${fs.statSync(f).size} bytes`);
  }
}