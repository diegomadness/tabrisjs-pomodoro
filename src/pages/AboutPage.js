const {Button, Page} = require('tabris');
const {appData} = require('../AppData');

module.exports = class AboutPage extends Page {
  constructor (properties) {
    super(properties);

    appData.drawer.close();
    this.title = 'About';

    this._createUI();
  }

  _createUI () {
    this.append(
      new Button({
        left: 16, top: 16, right: 16,
        text: 'Go back'
      }).on('select', () => this.dispose())
    );
  }
};
