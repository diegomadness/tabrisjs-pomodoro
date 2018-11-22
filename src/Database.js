module.exports = class Database {
  constructor (app) {
    this._app = app;
    this._connection = sqlitePlugin.openDatabase('pomodoro.db', '1.0', '', 1);
    this._connection.transaction((txn) => {
      txn.executeSql('CREATE TABLE IF NOT EXISTS `Statistics` ' +
        '(`type` INTEGER NOT NULL,`end` TEXT NOT NULL,`length` INTEGER NOT NULL)', [], (tx, res) => {
      });
    });

    //refresh stats
    this.loadStats();

    return this.connection;
  }

  get TYPE_WORK () {
    return 1;
  }

  get TYPE_BREAK () {
    return 2;
  }

  loadStats () {
    //getting data for the last week only
    const weekAgo = new Date().getTime() - 60 * 60 * 24 * 7 * 1000;

    this._connection.transaction((txn) => {
      txn.executeSql('SELECT * FROM `Statistics` WHERE end > "' + weekAgo + '"', [], (tx, res) => {
        this._app.appData.dbDataset = res.rows;
      });
    });
  }

  addRecord (type, end, len) {
    this._connection.transaction((txn) => {
      txn.executeSql('INSERT INTO Statistics VALUES (?,?,?)', [type, end, len], (tx, res) => {
      });
    });
    this.loadStats();//refresh statistics
  }
};
