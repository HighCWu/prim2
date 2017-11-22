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
  const children = [].concat(blurs).concat([
    m('rect', {
      x: 0,
      y: 0,
      width,
      height,
      fill: 'black',
    }),
  ]);
  return m('svg', { width, height }, children);
}

function generateRect(width, height, palette) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const elWidth = Math.random() * width * 0.5;
  const elHeight = Math.random() * height * 0.5;
  const fill = palette[Math.floor(Math.random() * palette.length)];
  const opacity = 0.3 + Math.random() * 0.7;
  const angle = Math.random() * 360;
  const blurId = (Math.random() < 0.7 ? `#blur${Math.floor(Math.random() * nBlurs)}` : null);
  const style = (blurId ? `filter: url(${blurId})` : null);
  return m('rect', {
    x,
    y,
    width: elWidth,
    height: elHeight,
    fill,
    opacity,
    style,
    className: 'g',
    transform: `rotate(${angle})`,
  });
}

function makeSVGVariant(base, width, height, palette = colors) {
  let newChildren = base.children;
  if (Math.random() < 0.75) {
    const newChild = generateRect(width, height, palette);
    newChildren = Array.from(base.children).concat(newChild);
  } else {
    newChildren = newChildren.filter((node) => {
      if (node.attrs.className !== 'g') return true;
      return Math.random() > 0.98;
    });
  }
  return m(base.tag, base.attrs, newChildren);
}

module.exports = {
  makeBaseSVG,
  makeSVGVariant,
};
