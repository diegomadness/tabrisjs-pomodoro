const {NavigationView, ui} = require('tabris');
const HomePage = require('./pages/HomePage');
const StatisticsPage = require('./pages/StatisticsPage');
const SettingsPage = require('./pages/SettingsPage');
const AboutPage = require('./pages/AboutPage');
const Timer = require('./Timer');
const Database = require('./Database');
const AppData = require('./AppData');
const RedButton = require('./components/RedButton');

module.exports = class AppBootstrap {
  constructor () {
    // Enable the drawer - left slide menu
    this.drawer = ui.drawer;
    this.drawer.enabled = true;

    this._drawerContent();//filling drawer with navigation buttons

    //top menu
    this.navigationView = new NavigationView({
      toolbarColor:'#ee5756',
      left: 0, top: 0, right: 0, bottom: 0,
      drawerActionVisible: true //sandwich button for opening the drawer
    }).appendTo(ui.contentView);

    this.timer = new Timer(this);
    this.db = new Database(this);
    this.appData = new AppData(localStorage);

    //creating main application page
    this.homePage = new HomePage({
      title: 'Tabris Pomodoro'
    }, this).appendTo(this.navigationView);

    //display fresh timer
    this.homePage.clockDisplayWorkingTime();
  }

  _drawerContent () {
    new RedButton({
      left: 16, top: 16, right: 16,
      text: 'Statistics'
    }).on({select: () => new StatisticsPage({}, this).appendTo(this.navigationView)})
      .appendTo(this.drawer);
    new RedButton({
      left: 16, top: 'prev() 16', right: 16,
      text: 'Settings'
    }).on({select: () => new SettingsPage({}, this).appendTo(this.navigationView)})
      .appendTo(this.drawer);
    new RedButton({
      left: 16, top: 'prev() 16', right: 16,
      text: 'About'
    }).on({select: () => new AboutPage({}, this).appendTo(this.navigationView)})
      .appendTo(this.drawer);
  }
};
