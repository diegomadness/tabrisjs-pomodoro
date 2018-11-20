const {appData} = require('./AppData');

class Database {
  constructor() {
    this._connection = sqlitePlugin.openDatabase('pomodoro.db', '1.0', '', 1);
    this._connection.transaction(function (txn) {
      txn.executeSql('CREATE TABLE IF NOT EXISTS `Statistics` (`type` INTEGER NOT NULL,`end` TEXT NOT NULL,`length` INTEGER NOT NULL)', [], function (tx, res) {
        console.log('db ok');
      });
    });

    //refresh stats
    this.loadStats();

    return this.connection;
  }

  static get TYPE_WORK(){
    return 1;
  }

  static get TYPE_BREAK(){
    return 2;
  }

  loadStats() {
    //getting data for the last week only
    let weekAgo = new Date().getTime() - 60*60*24*7*1000;

    this._connection.transaction(function (txn) {
      txn.executeSql('SELECT * FROM `Statistics` WHERE end > "'  + weekAgo+'"', [], function (tx, res) {
        appData.dbDataset = res.rows;
        //take a look on the results from db
        //console.log('select results:');
        //console.log(dbDataset);
      });
    });
  }
  addRecord(type,end,len) {
    this._connection.transaction(function (txn) {
      txn.executeSql('INSERT INTO Statistics VALUES (?,?,?)', [type, end, len], function (tx, res) {
        //console.log('insert ok');
      });
    });
    //refresh statistics
    this.loadStats();
  }
}


Database.db = new Database();

module.exports = Database;
