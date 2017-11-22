const m = require('mithril');
const colors = Object.keys(require('css-color-names'));

const nBlurs = 10;

const chooseColor = (palette) => palette[Math.floor(Math.random() * palette.length)];

function makeBaseSVG(context) {
  const { width, height, palette } = context;
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
  const { width, height, palette } = context;
  const x = Math.floor(Math.random() * width);
  const y = Math.floor(Math.random() * height);
  const elWidth = Math.floor(Math.random() * width * 0.3);
  const elHeight = Math.floor(Math.random() * height * 0.3);
  const fill = chooseColor(palette);
  const opacity = (0.3 + Math.random() * 0.7).toFixed(2);
  const angle = Math.floor(Math.random() * 8) * 45;
  const blurId = (Math.random() < 0.7 ? `#blur${Math.floor(Math.random() * nBlurs)}` : null);
  const style = (blurId ? `filter: url(${blurId})` : null);
  const transform = (angle ? `rotate(${angle})` : '');
  const commonAttrs = {
    fill, opacity, style, className: 'g', transform,
  };
  if (Math.random() < 0.5) {
    return m(
      'rect',
      Object.assign({
        x,
        y,
        width: elWidth,
        height: elHeight,
      }, commonAttrs)
    );
  }
  return m(
    'ellipse',
    Object.assign({
      cx: x,
      cy: y,
      width: elWidth,
      height: elHeight,
    }, commonAttrs)
  );
}

function makeSVGVariant(context, baseSvg) {
  let newChildren = Array.from(baseSvg.children);
  for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
    const newChild = generateRect(context);
    newChildren.push(newChild);
  }
  newChildren = newChildren.filter((node) => {
    if (node.attrs.className !== 'g') return true;
    return Math.random() < 0.95;
  });
  return m(baseSvg.tag, baseSvg.attrs, newChildren);
}

module.exports = {
  makeBaseSVG,
  makeSVGVariant,
};
