const {Button, Composite, TextView, Page} = require('tabris');
const {appData} = require('../AppData');
const {timer} = require('../Timer');

module.exports = class HomePage extends Page {

  constructor (properties) {
    super(properties);
    this._createUI();
    console.log('FROM HOMEPAGE');
    console.log(appData);
  }

  _createUI () {
    this.append(
      //timer button group - play, pause, stop and resume buttons
      this._timerButtonGroup = new Composite({
        left: 0, bottom: 0, right: 0,
      }),
      //New task and Break buttons appearing after finishing the task
      this._finishButtonGroup = new Composite({
        left: 0, bottom: 0, right: 0,
        visible: false,
      }),
      //New task and Break buttons appearing after finishing the task
      this._breakButtonGroup = new Composite({
        left: 0, bottom: 0, right: 0,
        visible: false,
      }),
      //main timer clocks
      this._timerClocks = new TextView({
        left: 10, top: '20%', right: 10,
        font: '80px',
        alignment: 'center'
      })
    );
    new Button({
      id: 'playButton',
      centerX: 0,
      top: 16,
      bottom: 20,
      text: 'Start',
      image: {src: 'images/play-button.png', width: 16, height: 16}
    }).on('select', () => {
      timer.startWorking();
    }).appendTo(this._timerButtonGroup);

    new Button({
      id: 'pauseButton',
      left: '15%',
      top: 16,
      bottom: 20,
      text: 'Pause',
      visible: false,
      image: {src: 'images/pause-button.png', width: 16, height: 16}
    }).on('select', () => timer.pauseWorking())
      .appendTo(this._timerButtonGroup);

    new Button({
      id: 'resumeButton',
      left: '15%',
      top: 16,
      bottom: 20,
      text: 'Resume',
      visible: false,
      image: {src: 'images/play-button.png', width: 16, height: 16}
    }).on('select', () => timer.resumeWorking())
      .appendTo(this._timerButtonGroup);

    new Button({
      id: 'stopButton',
      right: '15%',
      top: 16,
      bottom: 20,
      text: 'Start over',
      visible: false,
      image: {src: 'images/stop-button.png', width: 16, height: 16}
    }).on('select', () => timer.startOverWorking())
      .appendTo(this._timerButtonGroup);

    new Button({
      id: 'nextTaskButton',
      left: '15%',
      top: 16,
      bottom: 20,
      text: 'Next task',
      visible: true,
      image: {src: 'images/play-button.png', width: 16, height: 16}
    }).on('select', () => timer.startOverWorking())
      .appendTo(this._finishButtonGroup);

    new Button({
      id: 'breakButton',
      right: '15%',
      top: 16,
      bottom: 20,
      text: 'Take a break',
      visible: true,
      image: {src: 'images/pause-button.png', width: 16, height: 16}
    }).on('select', () => timer.startBreak())
      .appendTo(this._finishButtonGroup);

    new Button({
      id: 'resumeBreakButton',
      left: '15%',
      top: 16,
      bottom: 20,
      text: 'Resume break',
      visible: false,
      image: {src: 'images/play-button.png', width: 16, height: 16}
    }).on('select', () => timer.resumeBreak())
      .appendTo(this._breakButtonGroup);

    new Button({
      id: 'pauseBreakButton',
      left: '15%',
      top: 16,
      bottom: 20,
      text: 'Pause break',
      visible: true,
      image: {src: 'images/pause-button.png', width: 16, height: 16}
    }).on('select', () => timer.pauseBreak())
      .appendTo(this._breakButtonGroup);

    new Button({
      id: 'finishBreakButton',
      right: '15%',
      top: 16,
      bottom: 20,
      text: 'Finish break',
      visible: true,
      image: {src: 'images/stop-button.png', width: 16, height: 16}
    }).on('select', () => timer.forceFinishBreak())
      .appendTo(this._breakButtonGroup);
  }
  //main timer clocks
  refreshClock(m,s) {
    this._timerClocks.text = m+':'+s;
  }
  clockDisplayWorkingTime() {
    let m = appData.workInterval;
    m = (m < 10 ? '0' : '')+m;
    this._timerClocks.text = m+':00';
  }
  //control buttons
  buttonsStanceInit() {
    this._timerButtonGroup.visible =true;
    this._finishButtonGroup.visible =false;
    this._breakButtonGroup.visible =false;


    this.find('#playButton').set('visible', true);
    this.find('#stopButton').set('visible', false);
    this.find('#resumeButton').set('visible', false);
    this.find('#pauseButton').set('visible', false);
  }
  buttonsStanceBreak() {
    this._breakButtonGroup.visible = true;
    this._timerButtonGroup.visible = false;

    this.find('#pauseBreakButton').set('visible', true);
    this.find('#finishButtonGroup').set('visible', false);
    this.find('#resumeBreakButton').set('visible', false);
  }
  buttonsStanceWork() {
    this.find('#breakButtonGroup').set('visible', false);
    this.find('#playButton').set('visible', false);
    this.find('#resumeButton').set('visible', false);
    this.find('#stopButton').set('visible', true);
    this.find('#pauseButton').set('visible', true);

    this._timerButtonGroup.visible = true;
    this._finishButtonGroup.visible = false;
  }
  buttonsStancePause() {
    this.find('#playButton').set('visible', false);
    this.find('#resumeButton').set('visible', true);
    this.find('#stopButton').set('visible', true);
    this.find('#pauseButton').set('visible', false);
  }
  buttonsStancePauseBreak() {
    this.find('#pauseBreakButton').set('visible', false);
    this.find('#resumeBreakButton').set('visible', true);
  }
  buttonsStanceWorkFinished(){
    this._finishButtonGroup.visible = true;
    this._timerButtonGroup.visible = false;
  }
};
