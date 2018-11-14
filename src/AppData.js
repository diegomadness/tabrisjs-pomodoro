//todo: have no idea why localStorage.get() is not a function
const {localStorage} = require('tabris');

class AppData {
  constructor(storage) {
    this._storage = storage;
    this.mainTimer = null;
    this.dbDataset = 0;
    this.database = null;
    this.mainPage = null;
  }
  //values from localStorage
  set workInterval(value) {
    //this._storage.set('workInterval', value);
    if(this.mainTimer)
    {
      this.mainTimer.kill();
    }
    this.mainPage.clockDisplayWorkingTime();
    this.mainPage.buttonsStanceInit();
  }
  set breakInterval(value) {
    //this._storage.set('breakInterval', value);
    if(this.mainTimer)
    {
      this.mainTimer.kill();
    }
    this.mainPage.clockDisplayWorkingTime();
    this.mainPage.buttonsStanceInit();
  }

  get workInterval() {
    return this._storage.get('workInterval') || 1;
  }
  get breakInterval() {
    return this._storage.get('breakInterval') || 1;
  }

}

AppData.appData = new AppData(localStorage);

module.exports = AppData;
