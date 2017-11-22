const RgbQuant = require('rgbquant');

function extractPalette(image, count, width = 256, height = 256) {
  return new Promise((resolve) => {
    const canvas = Object.assign(document.createElement('canvas'), { width, height });
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
    const rq = new RgbQuant({ colors: count });
    rq.sample(canvas);
    const paletteTuples = rq.palette(true);
    resolve(paletteTuples.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`));
  });
}

module.exports = {
  extractPalette,
};
