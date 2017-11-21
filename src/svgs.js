const m = require('mithril');
const colors = Object.keys(require('css-color-names'));

const nBlurs = 10;

function makeBaseSVG(width, height) {
  const blurs = [];
  for (let i = 0; i < nBlurs; i++) {
    blurs.push(m('filter', { id: `blur${i}` }, [
      m('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: ((i + 1) / nBlurs) * 0.25 * width }),
    ]));
  }
  return m('svg', { width, height }, [
    blurs,
    m('rect', {
      x: 0,
      y: 0,
      width,
      height,
      fill: 'black',
    }),
  ]);
}

function makeSVGVariant(base, width, height) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const elWidth = Math.random() * width * 0.5;
  const elHeight = Math.random() * height * 0.5;
  const fill = colors[Math.floor(Math.random() * colors.length)];
  const opacity = 0.3 + Math.random() * 0.7;
  const angle = Math.random() * 360;
  const blurId = (Math.random() < 0.7 ? `#blur${Math.floor(Math.random() * nBlurs)}` : null);
  const style = (blurId ? `filter: url(${blurId})` : null);
  const newChild = m('rect', {
    x,
    y,
    width: elWidth,
    height: elHeight,
    fill,
    opacity,
    style,
    transform: `rotate(${angle})`,
  });
  const newChildren = Array.from(base.children).concat(newChild);
  return m(base.tag, base.attrs, newChildren);
}

module.exports = {
  makeBaseSVG,
  makeSVGVariant,
};
