/* eslint-disable object-curly-newline */
require('./style.css');
const m = require('mithril');
const comp = require('./comparison');
const svgs = require('./svgs');
const sortBy = require('lodash/sortBy');
const delay = require('./delay-promise');

const sourceImageUrl = require('./keeki.jpg');

const sourceImage = Object.assign(new Image(), { src: sourceImageUrl });


let differenceImage = null;
let displaySvg;
const baseSvgs = [svgs.makeBaseSVG(400, 400)];

function view() {
  return m('div', [
    m('img', { width: 400, height: 400, src: sourceImageUrl }),
    displaySvg,
    differenceImage,
  ]);
}

function generateAndCompareNextVariant(baseSvg) {
  const { width, height } = baseSvg.attrs;
  const svg = svgs.makeSVGVariant(baseSvg, width, height);
  return (
    comp.compareMithrilSVG(sourceImage, svg)
      .then((result) => Object.assign(result, { svg }))
  );
}

function makeNextGeneration(baseSvg, count = 10) {
  const ps = [];
  for (let i = 0; i < count; i++) {
    ps.push(generateAndCompareNextVariant(baseSvg));
  }
  return Promise.all(ps).then((results) => {
    const bestResult = sortBy(results, (r) => Math.sqrt(r.score))[0];
    return bestResult;
  });
}

function runGeneration() {
  const baseSvg = baseSvgs[baseSvgs.length - 1];
  return (
    makeNextGeneration(baseSvg)
      .then((result) => {
        differenceImage = m('img', { src: result.differenceCanvas.toDataURL() });
        displaySvg = result.svg;
        baseSvgs.push(result.svg);
        m.redraw();
      })
  );
}

function loop() {
  return runGeneration()
    .then(() => delay(50))
    .then(() => loop());
}

sourceImage.onload = () => {
  loop();
};


m.mount(document.body, { view });
