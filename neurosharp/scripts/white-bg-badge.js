const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../client/public/badge-special-offer.png');
const outputPath = inputPath;

async function run() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const isBlack = (r, g, b) => r < 30 && g < 30 && b < 30;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isBlack(r, g, b)) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      if (channels === 4) data[i + 3] = 255;
    }
  }
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);
  console.log('Done: background set to white');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
