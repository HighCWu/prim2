const m = require('mithril');
const colors = Object.keys(require('css-color-names'));

const nBlurs = 10;

const chooseColor = (palette) => palette[Math.floor(Math.random() * palette.length)];

function makeBaseSVG(context) {
  const {width, height, palette} = context;
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
      className: 'base',
      fill: chooseColor(palette),
    }),
  ]);
  return m('svg', { width, height }, children);
}

function generateRect(context) {
  const {width, height, palette} = context;
  const x = Math.random() * width;
  const y = Math.random() * height;
  const elWidth = Math.random() * width * 0.5;
  const elHeight = Math.random() * height * 0.5;
  const fill = chooseColor(palette);
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

function makeSVGVariant(context, baseSvg) {
  let newChildren = baseSvg.children;
  if (Math.random() < 0.75) {
    const newChild = generateRect(context);
    newChildren = Array.from(baseSvg.children).concat(newChild);
  } else {
    newChildren = newChildren.filter((node) => {
      if (node.attrs.className !== 'g') return true;
      return Math.random() > 0.98;
    });
  }
  return m(baseSvg.tag, baseSvg.attrs, newChildren);
}

module.exports = {
  makeBaseSVG,
  makeSVGVariant,
};
