/* eslint-disable object-curly-newline */
require('./style.css');
const m = require('mithril');
const svgs = require('./svgs');
const pal = require('./pal');
const vars = require('./variations');

const delay = require('./delay-promise');

const sourceImageUrl = require('./keeki.jpg');

const sourceImage = Object.assign(new Image(), { src: sourceImageUrl });


let differenceImage = null;
let displaySvg;
let lastResult;
const context = {
  sourceImage,
  width: 200,
  height: 200,
  palette: [],
};
const baseSvgs = [];

function view() {
  return m('div', [
    m('div', [
      m('img', { width: context.width, height: context.height, src: sourceImageUrl }),
      displaySvg,
      differenceImage,
    ]),
    m('div', [
      (lastResult ? m('div', ['score=', lastResult.score]) : null),
      (lastResult ? m('div', ['length=', lastResult.svgMarkup.length]) : null),
    ]),
  ]);
}

function runGeneration() {
  const baseSvg = baseSvgs[baseSvgs.length - 1];
  return (
    vars.makeNextGeneration(context, baseSvg)
      .then((result) => {
        differenceImage = m('img', { src: result.differenceCanvas.toDataURL() });
        lastResult = result;
        displaySvg = result.svg;
        baseSvgs.push(result.svg);
        m.redraw();
      })
  );
}

function loop() {
  return runGeneration()
    //.then(() => delay(50))
    .then(() => loop());
}

sourceImage.onload = () => {
  pal.extractPalette(sourceImage, 64)
    .then((genPal) => {
      context.palette = genPal;
      baseSvgs.push(svgs.makeBaseSVG(context));
    })
    .then(() => {
      loop();
    });
};


m.mount(document.body, { view });
