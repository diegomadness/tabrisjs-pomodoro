const {appData} = require('./AppData');
const {db} = require('./Database');

class Timer {
  constructor () {
    this._timer = null;
    console.log('FROM TIMER');
    console.log(appData);
  }

  get active(){
    return this._timer === null;
  }

  startTimer(minutes, oncomplete) {
    let startTime, timer;
    //todo: *60
    let ms = minutes*1000;
    let obj = {};
    obj.resume = function() {
      startTime = new Date().getTime();
      timer = setInterval(obj.step, 250);
    };
    obj.pause = function() {
      ms = obj.step();
      clearInterval(timer);
    };
    obj.kill = function() {
      clearInterval(timer);
      obj.resume = function() {};

      //returning how much time passed
      let msLeft = Math.max(0,ms-(new Date().getTime()-startTime));
      let mLeft = Math.floor(msLeft/60000);
      let mGone= minutes - mLeft;

      this._timer = null;
      return mGone;
    };

    obj.step = function() {
      console.log('FROM TIMER');
      console.log(appData);
      let now = Math.max(0,ms-(new Date().getTime()-startTime));
      let m = Math.floor(now/60000);
      let s = Math.floor(now/1000)%60;
      //add leading zero
      m = (m < 10 ? '0' : '')+m;
      s = (s < 10 ? '0' : '')+s;
      appData.mainPage.refreshClock(m,s);
      if( now === 0) {
        //task done!
        if(oncomplete) oncomplete();
        obj.kill();
      }
      return now;
    };
    obj.resume();
    this._timer = obj;
  }
  startWorking() {
    //hide Play button, show Pause and Stop buttons
    appData.mainPage.buttonsStanceWork();
    if(this._timer != null)
    {
      this._timer.kill();
    }

    //start
    this._timer = this.startTimer(appData.workInterval, () => {
      this.finishedWorking();
    });
  }
  pauseWorking() {
    appData.mainPage.buttonsStancePause();
    this._timer.pause();
  }
  resumeWorking() {
    appData.mainPage.buttonsStanceWork();
    this._timer.resume();
  }
  startOverWorking() {
    appData.mainPage.buttonsStanceWork();
    if(this._timer)
    {
      this._timer.kill();
    }
    this._timer = this.startTimer(appData.workInterval, () => {
      this.finishedWorking();
    });
  }
  finishedWorking() {
    appData.mainPage.buttonsStanceWorkFinished();
    appData.mainPage.clockDisplayWorkingTime();
    //saving data
    let end = new Date().getTime();
    db.addRecord(db.TYPE_WORK,end,appData.workInterval);
  }
  startBreak() {
    appData.mainPage.buttonsStanceBreak();
    if(this._timer !== null)
    {
      this._timer.kill();
    }
    //start
    this._timer = this.startTimer(appData.breakInterval, () => {
      this.finishedBreak();
    });

  }
  pauseBreak() {
    appData.mainPage.buttonsStancePauseBreak();
    this._timer.pause();
  }
  resumeBreak() {
    appData.mainPage.buttonsStanceBreak();
    this._timer.resume();
  }
  finishedBreak() {
    //timer is killed, it's time to bring home page back to initial view - ready to start work session
    appData.mainPage.clockDisplayWorkingTime();
    appData.mainPage.buttonsStanceInit();
    //saving data
    let end = new Date().getTime();
    db.addRecord(db.TYPE_BREAK,end,appData.breakInterval);
  }
  forceFinishBreak() {
    let timePassed = this._timer.kill();
    appData.mainPage.clockDisplayWorkingTime();
    appData.mainPage.buttonsStanceInit();
    //saving data
    let end = new Date().getTime();
    db.addRecord(db.TYPE_BREAK, end, timePassed);
  }
}


Timer.timer = new Timer();
module.exports = Timer;
