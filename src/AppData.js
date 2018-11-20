class AppData {
  constructor(storage) {
    this._storage = storage;
    this.dbDataset = 0;
    this.database = null;
    this.mainPage = null;
  }
  //values from localStorage
  set workInterval(value) {
    this._storage.setItem('workInterval', value);
    this.mainPage.clockDisplayWorkingTime();
    this.mainPage.buttonsStanceInit();
  }
  set breakInterval(value) {
    this._storage.setItem('breakInterval', value);
    this.mainPage.clockDisplayWorkingTime();
    this.mainPage.buttonsStanceInit();
  }

  get workInterval() {
    return this._storage.getItem('workInterval') || 1;
  }
  get breakInterval() {
    return this._storage.getItem('breakInterval') || 1;
  }

}

AppData.appData = new AppData(localStorage);
module.exports = AppData;
