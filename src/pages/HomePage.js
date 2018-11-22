const {Button, Composite, TextView, Page} = require('tabris');

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
      this._timerClocks = new TextView({
        left: 10, top: '20%', right: 10,
        font: '80px',
        alignment: 'center'
      })
    );
  }

  _createTimerButtonGroup () {
    //timer button group - play, pause, stop and resume buttons
    return new Composite({
      left: 0, bottom: 0, right: 0,
    }).append(
      this._playButton = new Button({
        centerX: 0, top: 16, bottom: 20,
        text: 'Start',
        image: {src: 'images/play-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.startWorking()}),

      this._pauseButton = new Button({
        left: '15%', top: 16, bottom: 20,
        text: 'Pause',
        visible: false,
        image: {src: 'images/pause-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.pauseWorking()}),

      this._resumeButton = new Button({
        left: '15%', top: 16, bottom: 20,
        text: 'Resume',
        visible: false,
        image: {src: 'images/play-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.resumeWorking()}),

      this._stopButton = new Button({
        right: '15%',
        top: 16,
        bottom: 20,
        text: 'Start over',
        visible: false,
        image: {src: 'images/stop-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.startOverWorking()})
    );
  }

  _createFinishButtonGroup () {
    return new Composite({
      left: 0, bottom: 0, right: 0,
      visible: false,
    }).append(
      this._nextTaskButton = new Button({
        id: 'nextTaskButton',
        left: '15%', top: 16, bottom: 20,
        text: 'Next task',
        visible: true,
        image: {src: 'images/play-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.startOverWorking()}),
      this._breakButton = new Button({
        right: '15%', top: 16, bottom: 20,
        text: 'Take a break',
        visible: true,
        image: {src: 'images/pause-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.startBreak()})
    );
  }

  _createBreakButtonGroup () {
    return new Composite({
      left: 0, bottom: 0, right: 0,
      visible: false,
    }).append(
      this._resumeBreakButton = new Button({
        left: '15%', top: 16, bottom: 20,
        text: 'Resume break',
        visible: false,
        image: {src: 'images/play-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.resumeBreak()}),

      this._pauseBreakButton = new Button({
        left: '15%', top: 16, bottom: 20,
        text: 'Pause break',
        visible: true,
        image: {src: 'images/pause-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.pauseBreak()}),

      this._finishBreakButton = new Button({
        right: '15%', top: 16, bottom: 20,
        text: 'Finish break',
        visible: true,
        image: {src: 'images/stop-button.png', width: 16, height: 16}
      }).on({select: () => this._app.timer.forceFinishBreak()})
    );
  }
};
