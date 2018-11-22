const {Button, NavigationView, ui} = require('tabris');
const {appData} = require('./AppData');
const HomePage = require('./pages/HomePage');
const StatisticsPage = require('./pages/StatisticsPage');
const SettingsPage = require('./pages/SettingsPage');
const AboutPage = require('./pages/AboutPage');

module.exports = class AppBootstrap {
  constructor () {
    // Enable the drawer - left slide menu
    appData.drawer = ui.drawer;
    appData.drawer.enabled = true;
    //filling drawer with navigation buttons
    this._drawerContent();

    //top menu
    this.navigationView = new NavigationView({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      drawerActionVisible: true //sandwich button for opening the drawer
    }).appendTo(ui.contentView);

    //creating main application page
    appData.mainPage = new HomePage({
      title: 'Easy Pomodoro'
    }).appendTo(this.navigationView);

    //display fresh timer
    appData.mainPage.clockDisplayWorkingTime();
  }

  _drawerContent () {
    new Button({
      left: 16, top: 16, right: 16,
      text: 'Statistics'
    }).on('select', () => new StatisticsPage().appendTo(this.navigationView))
      .appendTo(appData.drawer);
    new Button({
      left: 16, top: 'prev() 16', right: 16,
      text: 'Settings'
    }).on('select', () => new SettingsPage().appendTo(this.navigationView))
      .appendTo(appData.drawer);
    new Button({
      left: 16, top: 'prev() 16', right: 16,
      text: 'About'
    }).on('select', () => new AboutPage().appendTo(this.navigationView))
      .appendTo(appData.drawer);
  }
};

