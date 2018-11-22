const {Composite, Page, TextView, Slider} = require('tabris');

module.exports = class SettingsPage extends Page {
  constructor (properties, app) {
    super(properties);
    this._app = app;
    app.drawer.close();
    this.title = 'Settings';
    this._createUI();
  }

  _createUI () {
    this.append(
      //Work session length
      new TextView({
        top: 10, left: 10,
        text: 'Work session length',
        alignment: 'left'
      }),
      this.workLenComposite = new Composite({
        left: 10, top: 'prev() 10', right: 10,
      }),
      //Break length
      new TextView({
        top: 'prev() 10', left: 10,
        text: 'Break length',
        alignment: 'left'
      }),
      this.breakLenComposite = new Composite({
        left: 10, top: 'prev() 10', right: 10,
      })
    );

    this.workLen = new TextView({
      right: 0,
      text: this._app.appData.workInterval + ' min',
      alignment: 'right'
    }).appendTo(this.workLenComposite);

    new Slider({
      left: 0, right: 'next() 60',
      selection: this._app.appData.workInterval,
      minimum: 1,
      maximum: 60
    }).on({
      selectionChanged: ({value}) => {
        this._app.appData.workInterval = value;
        //refresh timer on home page
        this._app.timer.forceRefresh();
        this._app.homePage.clockDisplayWorkingTime();
        this._app.homePage.buttonsStanceInit();

        this.workLen.text = value + ' min';
      }
    }).appendTo(this.workLenComposite);

    this.breakLen = new TextView({
      right: 0,
      text: this._app.appData.breakInterval + ' min',
      alignment: 'right'
    }).appendTo(this.breakLenComposite);

    new Slider({
      left: 0, right: 'next() 60',
      selection: this._app.appData.breakInterval,
      minimum: 1,
      maximum: 15
    }).on({
      selectionChanged: ({value}) => {
        this._app.appData.breakInterval = value;
        //refresh timer on home page
        this._app.timer.forceRefresh();
        this._app.homePage.clockDisplayWorkingTime();
        this._app.homePage.buttonsStanceInit();

        this.breakLen.text = value + ' min';
      }
    }).appendTo(this.breakLenComposite);
  }
};
