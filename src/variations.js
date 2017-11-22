const sortBy = require('lodash/sortBy');
const comp = require('./comparison');
const svgs = require('./svgs');


function generateAndCompareNextVariant(context, baseSvg) {
  const svg = svgs.makeSVGVariant(context, baseSvg);
  return (
    comp.compareMithrilSVG(context.sourceImage, svg, context.width, context.height)
      .then((result) => Object.assign(result, { svg }))
  );
}

function makeNextGeneration(context, baseSvg, count = 5) {
  const ps = [];
  for (let i = 0; i < count; i++) {
    ps.push(generateAndCompareNextVariant(context, baseSvg));
  }
  return Promise.all(ps).then((results) => {
    const bestResult = sortBy(results, (r) => r.score)[0];
    return bestResult;
  });
}

module.exports = {
  generateAndCompareNextVariant,
  makeNextGeneration,
};
