module.exports = class AppData {
  constructor (storage) {
    this._storage = storage;
    this.dbDataset = 0;
  }

  //values from localStorage
  set workInterval (value) {
    this._storage.setItem('workInterval', value);
  }

  set breakInterval (value) {
    this._storage.setItem('breakInterval', value);
  }

  get workInterval () {
    //keep in mind that getItem method always returns string
    return parseInt(this._storage.getItem('workInterval') || 1, 10);
  }

  get breakInterval () {
    //keep in mind that getItem method always returns string
    return parseInt(this._storage.getItem('breakInterval') || 1, 10);
  }
};
