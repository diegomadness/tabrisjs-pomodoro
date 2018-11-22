const {Button, Canvas, Composite, device} = require('tabris');
const Chart = require('chart.js');

module.exports = class ChartComposite extends Composite {

  constructor (properties) {
    super(properties);

    this._createUI();
    this._applyLayout();
  }

  set chart (chart) {
    this._chart = chart;
  }

  get chart () {
    return this._chart;
  }

  _createUI () {
    this.append(
      new Button({id: 'drawChartButton', text: 'Productivity graph'})
        .on('select', () => this._drawChart()),
      new Composite({id: 'contentBox'})
        .append(new Canvas())
        .on({resize: (event) => this._layoutCanvas(event)})
    );
  }

  _drawChart () {
    const ctx = this._createCanvasContext();
    // workaround for scaling to native pixels by chart.js
    ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
    new Chart(ctx)[this.chart.type](this.chart.data, {
      animation: false,
      showScale: true,
      showTooltips: false,
      scaleShowLabels: true
    });
  }

  _createCanvasContext () {
    const canvas = this.find(Canvas).first();
    const scaleFactor = device.scaleFactor;
    const bounds = canvas.bounds;
    const width = bounds.width * scaleFactor;
    const height = bounds.height * scaleFactor;
    return canvas.getContext('2d', width, height);
  }

  _applyLayout () {
    this.apply({
      '#drawChartButton': {left: 16, top: 16},
      '#contentBox': {left: 16, top: '#drawChartButton 16', right: 16, bottom: 16},
      'Canvas': {left: 0, centerY: 0}
    });
  }

  _layoutCanvas ({width, height}) {
    this.find(Canvas).set({width, height: Math.min(width, height)});
  }
};
