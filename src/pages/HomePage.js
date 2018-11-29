const {ImageView, Composite, TextView, Page} = require('tabris');
const RedButton = require('../components/RedButton');

module.exports = class HomePage extends Page {

  constructor (properties, app) {
    super(properties);
    this._createUI();
    this._app = app;
  }

  //main timer clocks
  refreshClock (m, s) {
    this._timerClocks.text = m + ':' + s;
  }

  clockDisplayWorkingTime () {
    let m = this._app.appData.workInterval;
    m = (m < 10 ? '0' : '') + m;
    this._timerClocks.text = m + ':00';
  }

  buttonsStanceInit () {
    this._timerButtonGroup.visible = true;
    this._finishButtonGroup.visible = false;
    this._breakButtonGroup.visible = false;

    this._playButton.visible = true;
    this._stopButton.visible = false;
    this._resumeButton.visible = false;
    this._pauseButton.visible = false;
  }

  buttonsStanceBreak () {
    this._breakButtonGroup.visible = true;
    this._timerButtonGroup.visible = false;

    this._pauseBreakButton.visible = true;
    this._finishButtonGroup.visible = false;
    this._resumeBreakButton.visible = false;
  }

  buttonsStanceWork () {
    this._breakButtonGroup.visible = false;
    this._playButton.visible = false;
    this._resumeButton.visible = false;
    this._stopButton.visible = true;
    this._pauseButton.visible = true;

    this._timerButtonGroup.visible = true;
    this._finishButtonGroup.visible = false;
  }

  buttonsStancePause () {
    this._playButton.visible = false;
    this._resumeButton.visible = true;
    this._stopButton.visible = true;
    this._pauseButton.visible = false;
  }

  buttonsStancePauseBreak () {
    this._pauseBreakButton.visible = false;
    this._resumeBreakButton.visible = true;
  }

  buttonsStanceWorkFinished () {
    this._finishButtonGroup.visible = true;
    this._timerButtonGroup.visible = false;
  }

  _createUI () {
    this.append(
      this._timerButtonGroup = this._createTimerButtonGroup(),
      //New task and Break buttons appearing after finishing the task
      this._finishButtonGroup = this._createFinishButtonGroup(),
      //New task and Break buttons appearing after finishing the task
      this._breakButtonGroup = this._createBreakButtonGroup(),
      //main timer clocks
      this._bgImage = new ImageView({
        left: 10, centerY:-50, right: 10,
        image: 'images/bg-work.png',
        background: '#fff',
        scaleMode: 'fit'
      }),
      this._timerClocks = new TextView({
        left: 10, centerY:-50, right: 10,
        textColor: '#fff',
        font: '50px',
        alignment: 'center'
      })
    );
  }

  _createTimerButtonGroup () {
    //timer button group - play, pause, stop and resume buttons
    return new Composite({
      left: 0, bottom: 40, right: 0,
    }).append(
      this._playButton = new RedButton({
        centerX: 0,  bottom: 0,
        text: ' Start',
        image: {src: 'images/play-button.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.startWorking()}),

      this._pauseButton = new RedButton({
        left: '15%',  bottom: 0,
        text: 'Pause',
        visible: false,
        image: {src: 'images/pause-button.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.pauseWorking()}),

      this._resumeButton = new RedButton({
        width: 110,
        left: '15%',  bottom: 0,
        text: 'Resume',
        visible: false,
        image: {src: 'images/play-button.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.resumeWorking()}),

      this._stopButton = new RedButton({
        width: 110,
        right: '15%', bottom: 0,
        text: 'Restart',
        visible: false,
        image: {src: 'images/reload.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.startOverWorking()})
    );
  }

  _createFinishButtonGroup () {
    return new Composite({
      left: 0, bottom: 40, right: 0,
      visible: false,
    }).append(
      this._nextTaskButton = new RedButton({
        width: 130,
        left: '15%',  bottom: 0,
        text: 'Next task',
        visible: true,
        image: {src: 'images/play-button.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.startOverWorking()}),
      this._breakButton = new RedButton({
        right: '15%',  bottom: 0,
        text: 'Break',
        visible: true,
        image: {src: 'images/coffee.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.startBreak()})
    );
  }

  _createBreakButtonGroup () {
    return new Composite({
      left: 0, bottom: 40, right: 0,
      visible: false,
    }).append(
      this._resumeBreakButton = new RedButton({
        width:110,
        left: '15%',  bottom: 0,
        text: 'Resume',
        visible: false,
        image: {src: 'images/play-button.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.resumeBreak()}),

      this._pauseBreakButton = new RedButton({
        left: '15%',  bottom: 0,
        text: 'Pause',
        visible: true,
        image: {src: 'images/pause-button.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.pauseBreak()}),

      this._finishBreakButton = new RedButton({
        right: '15%',  bottom: 0,
        text: 'Finish',
        visible: true,
        image: {src: 'images/cancel.png', width: 18, height: 18}
      }).on({select: () => this._app.timer.forceFinishBreak()})
    );
  }
};
