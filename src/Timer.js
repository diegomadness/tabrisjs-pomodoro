let appData = require('./AppData');

module.exports = class Timer {
  constructor (minutes, oncomplete) {
    appData.mainTimer = this.startTimer(minutes, oncomplete);
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

      appData.mainTimer = null;
      return mGone;
    };
    obj.step = function() {
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
    return obj;
  }
  startWorking() {
    //hide Play button, show Pause and Stop buttons
    appData.mainPage.buttonsStanceWork();
    if(appData.mainTimer != null)
    {
      appData.mainTimer.kill();
    }

    //start
    appData.mainTimer = this.startTimer(appData.workInterval, function () {
      this.finishedWorking();
    });
  }
  pauseWorking() {
    appData.mainPage.buttonsStancePause();
    appData.mainTimer.pause();
  }
  resumeWorking() {
    appData.mainPage.buttonsStanceWork();
    appData.mainTimer.resume();
  }
  startOverWorking() {
    appData.mainPage.buttonsStanceWork();
    if(appData.mainTimer)
    {
      appData.mainTimer.kill();
    }
    appData.mainTimer = this.startTimer(appData.workInterval, function () {
      this.finishedWorking();
    });
  }
  finishedWorking() {
    appData.mainPage.buttonsStanceWorkFinished();
    this.clockDisplayWorkingTime();
    //saving data
    let end = new Date().getTime();
    appData.database.addRecord(appData.database.TYPE_WORK,end,appData.workInterval);
  }
  startBreak() {
    appData.mainPage.buttonsStanceBreak();
    if(appData.mainTimer !== null)
    {
      appData.mainTimer.kill();
    }
    //start
    appData.mainTimer = this.startTimer(appData.breakInterval, function () {
      this.finishedBreak();
    });

  }
  pauseBreak() {
    appData.mainPage.buttonsStancePauseBreak();
    appData.mainTimer.pause();
  }
  resumeBreak() {
    appData.mainPage.buttonsStanceBreak();
    appData.mainTimer.resume();
  }
  finishedBreak() {
    //timer is killed, it's time to bring home page back to initial view - ready to start work session
    appData.mainPage.clockDisplayWorkingTime();
    appData.mainPage.buttonsStanceInit();
    //saving data
    let end = new Date().getTime();
    appData.database.addRecord(appData.database.TYPE_BREAK,end,appData.breakInterval);
  }
  forceFinishBreak() {
    let timePassed = appData.mainTimer.kill();
    appData.mainPage.clockDisplayWorkingTime();
    appData.mainPage.buttonsStanceInit();
    //saving data
    let end = new Date().getTime();
    appData.database.addRecord(appData.database.TYPE_BREAK, end, timePassed);
  }
};

