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
let palette = [];
const baseSvgs = [svgs.makeBaseSVG(400, 400)];

function view() {
  return m('div', [
    m('div', [
      m('img', { width: 400, height: 400, src: sourceImageUrl }),
      displaySvg,
      differenceImage,
    ]),
    m('div', [
      (lastResult ? m('div', ['score=', lastResult.score]) : null),
      (lastResult ? m('div', ['length=', lastResult.svgUrl.length]) : null),
    ]),
  ]);
}

function runGeneration() {
  const baseSvg = baseSvgs[baseSvgs.length - 1];
  return (
    vars.makeNextGeneration(sourceImage, baseSvg, palette)
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
  pal.extractPalette(sourceImage, 16)
    .then((genPal) => {
      palette = genPal;
    })
    .then(() => {
      loop();
    });
};


m.mount(document.body, { view });
