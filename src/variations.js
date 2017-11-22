const sortBy = require('lodash/sortBy');
const comp = require('./comparison');
const svgs = require('./svgs');


function generateAndCompareNextVariant(sourceImage, baseSvg, palette) {
  const { width, height } = baseSvg.attrs;
  const svg = svgs.makeSVGVariant(baseSvg, width, height, palette);
  return (
    comp.compareMithrilSVG(sourceImage, svg)
      .then((result) => Object.assign(result, { svg }))
  );
}

function makeNextGeneration(sourceImage, baseSvg, palette, count = 5) {
  const ps = [];
  for (let i = 0; i < count; i++) {
    ps.push(generateAndCompareNextVariant(sourceImage, baseSvg, palette));
  }
  return Promise.all(ps).then((results) => {
    const bestResult = sortBy(results, (r) => Math.sqrt(r.score))[0];
    return bestResult;
  });
}

module.exports = {
  generateAndCompareNextVariant,
  makeNextGeneration,
};
