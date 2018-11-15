const {timer} = require('./Timer');

class AppData {
  constructor(storage) {
    this._storage = storage;
    this.dbDataset = 0;
    this.database = null;
    this.mainPage = null;
  }
  //values from localStorage
  set workInterval(value) {
    //todo:
    //this._storage.set('workInterval', value);
    if(timer.active)
    {
      timer.kill();
    }
    this.mainPage.clockDisplayWorkingTime();
    this.mainPage.buttonsStanceInit();
  }
  set breakInterval(value) {
    //todo:
    //this._storage.set('breakInterval', value);
    if(timer.active)
    {
      timer.kill();
    }
    this.mainPage.clockDisplayWorkingTime();
    this.mainPage.buttonsStanceInit();
  }

  get workInterval() {
    //todo:
    //return this._storage.get('workInterval') || 1;
    return 5;
  }
  get breakInterval() {
    //return this._storage.get('breakInterval') || 1;
    //todo:
    return 5;
  }

}

AppData.appData = new AppData(localStorage);

module.exports = AppData;
