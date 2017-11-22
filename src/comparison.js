const staticRender = require('mithril-node-render');


function compareImages(image1, image2, width, height) {
  return new Promise((resolve) => {
    const canvas = Object.assign(document.createElement('canvas'), { width, height });
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(image1, 0, 0, image1.width, image1.height, 0, 0, width, height);
    ctx.globalCompositeOperation = 'difference';
    ctx.drawImage(image2, 0, 0, image2.width, image2.height, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);
    let rDiff = 0;
    let gDiff = 0;
    let bDiff = 0;
    let nPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      rDiff += data[i];
      gDiff += data[i + 1];
      bDiff += data[i + 2];
      nPixels++;
    }
    // Rec. 709 Luma -- gets us a sort of a perceptual numeric difference value
    const score = (0.2126 * rDiff + 0.7152 * gDiff + 0.0722 * bDiff) / nPixels;
    resolve({
      score,
      differenceCanvas: canvas,
    });
  });
}


function compareMithrilSVG(sourceImage, mithrilSvg, width = 400, height = 400) {
  return staticRender(mithrilSvg)
    .then((markup) => markup.replace('<svg', '<svg xmlns=\'http://www.w3.org/2000/svg\''))
    .then((markup) => ({markup, url: `data:image/svg+xml;utf8,${encodeURI(markup)}`}))
    .then(({markup, url}) => new Promise((resolve) => {
      const image = Object.assign(new Image(), {
        width,
        height,
        src: url,
        onload: (() => resolve({image, url, markup})),
        onerror: ((err) => console.error(err)),
      });
    }))
    .then(
      ({image, url, markup}) => (
        compareImages(sourceImage, image, width, height)
          .then((compareResult) => Object.assign({}, compareResult, {svgUrl: url, svgMarkup: markup}))
      )
    );
}

module.exports = {
  compareImages,
  compareMithrilSVG,
};
