const {Page, TextView} = require('tabris');
const {appData} = require('../AppData');

module.exports = class AboutPage extends Page {
  constructor (properties) {
    super(properties);

    appData.drawer.close();
    this.title = 'About';
    this._textAbout = 'This app was created by <a href="http://vnezapno.pro/">Yaroslav Starchenko</a> ' +
      'using <a href="https://tabris.com">Tabris Framework</a>.';
    this._textAbout2 = 'You can take a look at the application source code using ' +
      '<a href="https://github.com/diegomadness/tabrisjs-pomodoro">Github</a>';

    this._createUI();
  }

  _createUI () {
    this.append(
      new TextView({
        top: 10,
        left: 10,
        right: 10,
        markupEnabled: true,
        text: this._textAbout,
        alignment: 'left'
      }),
      new TextView({
        top: 'prev() 10',
        left: 10,
        right: 10,
        markupEnabled: true,
        text: this._textAbout2,
        alignment: 'left'
      })
    );
  }
};
