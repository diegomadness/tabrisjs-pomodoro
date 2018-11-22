module.exports = class Timer {
  constructor (app) {
    this._interval = null;
    this._app = app;
    this._minutes = 0;
    this._ms = 0;
    this._startTime = 0;
    this._oncomplete = null;
  }

  get active () {
    return this._interval !== null;
  }

  startWorking () {
    //hide Play button, show Pause and Stop buttons
    this._app.homePage.buttonsStanceWork();
    this._kill();

    //start
    this.startTimer(this._app.appData.workInterval, () => {
      this.finishedWorking();
    });
  }

  pauseWorking () {
    this._app.homePage.buttonsStancePause();
    this._pause();
  }

  resumeWorking () {
    this._app.homePage.buttonsStanceWork();
    this._resume();
  }

  startOverWorking () {
    this._app.homePage.buttonsStanceWork();
    this._kill();
    this.startTimer(this._app.appData.workInterval, () => {
      this.finishedWorking();
    });
  }

  finishedWorking () {
    this._app.homePage.buttonsStanceWorkFinished();
    this._app.homePage.clockDisplayWorkingTime();
    //saving data
    const end = new Date().getTime();
    this._app.db.addRecord(this._app.db.TYPE_WORK, end, this._app.appData.workInterval);
  }

  startBreak () {
    this._app.homePage.buttonsStanceBreak();
    this._kill();
    //start
    this.startTimer(this._app.appData.breakInterval, () => {
      this.finishedBreak();
    });
  }

  pauseBreak () {
    this._app.homePage.buttonsStancePauseBreak();
    this._pause();
  }

  resumeBreak () {
    this._app.homePage.buttonsStanceBreak();
    this._resume();
  }

  finishedBreak () {
    //timer is killed, it's time to bring home page back to initial view - ready to start work session
    this._app.homePage.clockDisplayWorkingTime();
    this._app.homePage.buttonsStanceInit();
    //saving data
    const end = new Date().getTime();
    this._app.db.addRecord(this._app.db.TYPE_BREAK, end, this._app.appData.breakInterval);
  }

  forceFinishBreak () {
    const timePassed = this._kill();
    this._app.homePage.clockDisplayWorkingTime();
    this._app.homePage.buttonsStanceInit();
    //saving data
    const end = new Date().getTime();
    this._app.db.addRecord(this._app.db.TYPE_BREAK, end, timePassed);
  }

  forceRefresh () {
    this._kill();
  }

  startTimer (minutes, oncomplete = null) {
    this._minutes = minutes;
    this._ms = minutes * 60 * 1000;
    this._oncomplete = oncomplete;

    this._resume();
  }

  _kill () {
    if (this.active) {
      clearInterval(this._interval);

      //returning how much time passed
      const msLeft = Math.max(0, this._ms - (new Date().getTime() - this._startTime));
      const mLeft = Math.floor(msLeft / 60000);
      const mGone = this._minutes - mLeft;

      this._interval = null;
      return mGone;
    }
  }

  _resume () {
    this._startTime = new Date().getTime();
    this._interval = setInterval(() => {
      this._step();
    }, 250);
  }

  _step () {
    const now = Math.max(0, this._ms - (new Date().getTime() - this._startTime));
    let m = Math.floor(now / 60000);
    let s = Math.floor(now / 1000) % 60;
    m = (m < 10 ? '0' : '') + m;
    s = (s < 10 ? '0' : '') + s;
    this._app.homePage.refreshClock(m, s);
    if (now === 0) {//task done
      if (this._oncomplete) {
        this._oncomplete();
      }
      this._kill();
    }
    return now;
  }

  _pause () {
    this._ms = this._step();
    clearInterval(this._interval);
  }
};

