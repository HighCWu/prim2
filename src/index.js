/* eslint-disable object-curly-newline */
require('./style.css');
const m = require('mithril');
const comp = require('./comparison');

const sourceImageUrl = require('./keeki.jpg');

const SOURCE_IMAGE = Object.assign(new Image(), { src: sourceImageUrl });


function makeSvg(width, height) {
  return m('svg', { width, height }, [
    m('rect', { x: 0, y: 0, width, height, fill: 'black' }),
    m('rect', { x: 15, y: 50, width: 50, height: 50, fill: 'purple' }),
  ]);
}


let differenceImage = null;

function view() {
  const svg = makeSvg(400, 400);
  comp.compareMithrilSVG(SOURCE_IMAGE, svg).then((result) => {
    differenceImage = m('img', {src: result.differenceCanvas.toDataURL()});
    m.redraw();
  });

  return m('div', [
    m('img', { width: 400, height: 400, src: sourceImageUrl }),
    svg,
    differenceImage,
  ]);
}


m.mount(document.body, { view });
