const {Composite, Page, TextView, Slider} = require('tabris');
let appData = require('../AppData');

module.exports = class SettingsPage extends Page {
  constructor (properties) {
    super(properties);

    appData.drawer.close();
    this.title = 'Settings';

    this._createUI();
  }

  _createUI () {
    this.append(
      //Work session length
      new TextView({
        top: 10,
        left: 10,
        text: 'Work session length',
        alignment: 'left'
      }),
      this.workLenComposite = new Composite({
        left: 10, top: 'prev() 10', right: 10,
      }),
      //Break length
      new TextView({
        top: 'prev() 10',
        left: 10,
        text: 'Break length',
        alignment: 'left'
      }),
      this.breakLenComposite = new Composite({
        left: 10, top: 'prev() 10', right: 10,
      })
    );

    this.workLen = new TextView({
      right: 0,
      text: appData.workInterval + ' min',
      alignment: 'right'
    }).appendTo(this.workLenComposite);

    new Slider({
      left: 0,
      minimum: 1,
      right: 'next() 60',
      selection: appData.workInterval,
      maximum: 60
    }).on('selectionChanged', ({value}) => {
      appData.workInterval = value;
      this.workLen.text = value + ' min';
    }).appendTo(this.workLenComposite);

    this.breakLen = new TextView({
      right: 0,
      text: appData.breakInterval + ' min',
      alignment: 'right'
    }).appendTo(this.breakLenComposite);

    this.Slider({
      left: 0,
      minimum: 1,
      right: 'next() 60',
      selection: appData.breakInterval,
      maximum: 15
    }).on('selectionChanged', ({value}) => {
      appData.breakInterval = value;
      this.breakLen.text = value + ' min';
    }).appendTo(this.breakLenComposite);
  }
};
