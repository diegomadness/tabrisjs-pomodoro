const {Composite, Button, TextView, NavigationView, Page, Slider,ToggleButton, ui} = require('tabris');
const BG_COLOR = '#ffffff';
const TYPE_WORK = 1;
const TYPE_BREAK = 2;

const defaultSettings = {
  workInterval: 1,
  breakInterval:1,
  vibration:false,
  sound:false
};
let mainTimer = null;

// Enable the drawer - left slide menu
let drawer = ui.drawer;
drawer.enabled = true;
//filling drawer with navigation buttons
drawerContent();

console.log('v 0.3');
//top menu
let navigationView = new NavigationView({
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  drawerActionVisible:true //sandwich button for opening the drawer
}).appendTo(ui.contentView);

//creating main application page
let mainPage = new Page({
  title: 'Easy Pomodoro'
}).appendTo(navigationView);

mainPageContent();
//display fresh timer
clockDisplayWorkingTime();



let database = initDatabase();


/**
 * DB
 */

function initDatabase() {
  let db = sqlitePlugin.openDatabase('pomodoro.db', '1.0', '', 1);
  db.transaction(function (txn) {
    txn.executeSql('CREATE TABLE IF NOT EXISTS `Statistics` (`type` INTEGER NOT NULL,`end` TEXT NOT NULL,`length` INTEGER NOT NULL)', [], function (tx, res) {
      console.log('created the table if not existed.');
    });
  });

  return db;
}

function getLastRecords(type) {
  console.log('type:' + type);
  //getting data for the last week only
  //let weekAgo = new Date().getTime() - 60*60*24*7*1000;
  //+ ' AND WHERE end > ' + weekAgo
  database.transaction(function (txn) {
    txn.executeSql('SELECT * FROM `Statistics`', [], function (tx, res) {
      for (let i = 0; i < res.rows.length; i++) {
        console.log(res.rows.item(i));
      }
    });
  });
}

function addRecord(type,end,len) {
  database.transaction(function (txn) {
    txn.executeSql('INSERT INTO Statistics VALUES (?,?,?)', [type, end, len], function (tx, res) {
      //console.log(res.rows);
      console.log('Inserted records');
    });
  });
  getLastRecords(1);
  //getLastRecords(2);
}

/**
 * local storage
 */
function getSettings(key) {
  let value = localStorage.getItem(key);
  if(value){
    return value;
  }
  else {
    return defaultSettings[key];
  }
}
function setSettings(key, value) {
  localStorage.setItem(key, value);
}
function changeWorkInterval(value) {
  setSettings('workInterval', value);
  if(mainTimer)
  {
    mainTimer.kill();
  }
  clockDisplayWorkingTime();
  buttonsStanceInit();
}
function changeBreakInterval(value) {
  setSettings('breakInterval', value);
  if(mainTimer)
  {
    mainTimer.kill();
  }
  clockDisplayWorkingTime();
  buttonsStanceInit();
}

/**
 * TIMER
 */
function startTimer(minutes, oncomplete) {
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

    mainTimer = null;
    return mGone;
  };
  obj.step = function() {
    let now = Math.max(0,ms-(new Date().getTime()-startTime));
    let m = Math.floor(now/60000);
    let s = Math.floor(now/1000)%60;
    //add leading zero
    m = (m < 10 ? '0' : '')+m;
    s = (s < 10 ? '0' : '')+s;
    refreshClock(m,s);
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
function refreshClock(m,s) {
  mainPage.find('#timerDisplay').set('text', m+':'+s);
}
function clockDisplayWorkingTime() {
  let m =getSettings('workInterval');
  m = (m < 10 ? '0' : '')+m;
  mainPage.find('#timerDisplay').set('text', m+':00');
}
function startWorking() {
  //hide Play button, show Pause and Stop buttons
  buttonsStanceWork();
  console.log('starting work session');
  if(mainTimer != null)
  {
    mainTimer.kill();
  }

  //start
  mainTimer = startTimer(getSettings('workInterval'), function () {
    finishedWorking();
  });
}
function pauseWorking() {
  buttonsStancePause();
  mainTimer.pause();
}
function resumeWorking() {
  buttonsStanceWork();
  mainTimer.resume();
}
function startOverWorking() {
  if(mainTimer)
  {
    mainTimer.kill();
  }
  mainTimer = startTimer(getSettings('workInterval'), function () {
    finishedWorking();
  });
}
function finishedWorking() {
  //TODO
  console.log('WORK FINISHED');
  buttonsStanceWorkFinished();
  clockDisplayWorkingTime();
  //saving data
  let end = new Date().getTime();
  addRecord(TYPE_WORK,end,getSettings('workInterval'));
}
function startBreak() {
  buttonsStanceBreak();
  console.log('starting a break');
  if(mainTimer != null)
  {
    mainTimer.kill();
  }
  //start
  mainTimer = startTimer(getSettings('breakInterval'), function () {
    finishedBreak();
  });

}
function pauseBreak() {
  buttonsStancePauseBreak();
  mainTimer.pause();
}
function resumeBreak() {
  buttonsStanceBreak();
  mainTimer.resume();
}
function finishedBreak() {
  //TODO
  console.log('BREAK FINISHED');
  //timer is killed, it's time to bring home page back to initial view - ready to start work session
  clockDisplayWorkingTime();
  buttonsStanceInit();
  //saving data
  let end = new Date().getTime();
  addRecord(TYPE_BREAK,end,getSettings('breakInterval'));
}
function forceFinishBreak() {
  let timePassed = mainTimer.kill();
  clockDisplayWorkingTime();
  buttonsStanceInit();
  //saving data
  let end = new Date().getTime();
  addRecord(TYPE_BREAK, end, timePassed);
}

/**
 * BUTTONS
 */
function buttonsStanceInit() {
  mainPage.find('#timerButtonGroup').set('visible', true);
  mainPage.find('#finishButtonGroup').set('visible', false);
  mainPage.find('#breakButtonGroup').set('visible', false);

  mainPage.find('#playButton').set('visible', true);
  mainPage.find('#stopButton').set('visible', false);
  mainPage.find('#resumeButton').set('visible', false);
  mainPage.find('#pauseButton').set('visible', false);
}
function buttonsStanceBreak() {
  mainPage.find('#breakButtonGroup').set('visible', true);
  mainPage.find('#timerButtonGroup').set('visible', false);
  mainPage.find('#pauseBreakButton').set('visible', true);
  mainPage.find('#resumeBreakButton').set('visible', false);
}
function buttonsStanceWork() {
  mainPage.find('#breakButtonGroup').set('visible', false);
  mainPage.find('#playButton').set('visible', false);
  mainPage.find('#resumeButton').set('visible', false);
  mainPage.find('#stopButton').set('visible', true);
  mainPage.find('#pauseButton').set('visible', true);
}
function buttonsStancePause() {
  mainPage.find('#playButton').set('visible', false);
  mainPage.find('#resumeButton').set('visible', true);
  mainPage.find('#stopButton').set('visible', true);
  mainPage.find('#pauseButton').set('visible', false);
}
function buttonsStancePauseBreak() {
  mainPage.find('#pauseBreakButton').set('visible', false);
  mainPage.find('#resumeBreakButton').set('visible', true);
}
function buttonsStanceWorkFinished(){
  mainPage.find('#finishButtonGroup').set('visible', true);
  mainPage.find('#timerButtonGroup').set('visible', false);
}

/**
 * PAGES
 */
function mainPageContent() {
  //timer button group - play, pause, stop and resume buttons
  let timerButtonGroup = new Composite({
    id:'timerButtonGroup',
    left: 0, bottom: 0, right: 0,
    background: BG_COLOR,
  }).appendTo(mainPage);

  new Button({
    id:'playButton',
    centerX: 0,
    top: 16,
    bottom: 20,
    text:'Start',
    image: {src: 'images/play-button.png', width: 16, height: 16}
  }).on('select', () => {
    startWorking();
  })
    .appendTo(timerButtonGroup);

  new Button({
    id:'pauseButton',
    left: '15%',
    top: 16,
    bottom: 20,
    text:'Pause',
    visible: false,
    image: {src: 'images/pause-button.png', width: 16, height: 16}
  }).on('select', () => pauseWorking())
    .appendTo(timerButtonGroup);

  new Button({
    id:'resumeButton',
    left: '15%',
    top: 16,
    bottom: 20,
    text:'Resume',
    visible: false,
    image: {src: 'images/play-button.png', width: 16, height: 16}
  }).on('select', () => resumeWorking())
    .appendTo(timerButtonGroup);

  new Button({
    id:'stopButton',
    right: '15%',
    top: 16,
    bottom: 20,
    text:'Start over',
    visible: false,
    image: {src: 'images/stop-button.png', width: 16, height: 16}
  }).on('select', () => startOverWorking())
    .appendTo(timerButtonGroup);

  //New task and Break buttons appearing after finishing the task
  let finishButtonGroup = new Composite({
    id:'finishButtonGroup',
    left: 0, bottom: 0, right: 0,
    visible: false,
    background: BG_COLOR,
  }).appendTo(mainPage);

  new Button({
    id:'nextTaskButton',
    left: '15%',
    top: 16,
    bottom: 20,
    text:'Next task',
    visible: true,
    image: {src: 'images/play-button.png', width: 16, height: 16}
  }).on('select', () => startOverWorking())
    .appendTo(finishButtonGroup);

  new Button({
    id:'breakButton',
    right: '15%',
    top: 16,
    bottom: 20,
    text:'Take a break',
    visible: true,
    image: {src: 'images/pause-button.png', width: 16, height: 16}
  }).on('select', () => startBreak())
    .appendTo(finishButtonGroup);

  //New task and Break buttons appearing after finishing the task
  let breakButtonGroup = new Composite({
    id:'breakButtonGroup',
    left: 0, bottom: 0, right: 0,
    visible: false,
    background: BG_COLOR,
  }).appendTo(mainPage);

  new Button({
    id:'resumeBreakButton',
    left: '15%',
    top: 16,
    bottom: 20,
    text:'Resume break',
    visible: false,
    image: {src: 'images/play-button.png', width: 16, height: 16}
  }).on('select', () => resumeBreak())
    .appendTo(breakButtonGroup);

  new Button({
    id:'pauseBreakButton',
    left: '15%',
    top: 16,
    bottom: 20,
    text:'Pause break',
    visible: true,
    image: {src: 'images/pause-button.png', width: 16, height: 16}
  }).on('select', () => pauseBreak())
    .appendTo(breakButtonGroup);

  new Button({
    id:'finishBreakButton',
    right: '15%',
    top: 16,
    bottom: 20,
    text:'Finish break',
    visible: true,
    image: {src: 'images/stop-button.png', width: 16, height: 16}
  }).on('select', () => forceFinishBreak())
    .appendTo(breakButtonGroup);

  //main timer clocks
  new TextView({
    id:'timerDisplay',
    left: 10, top: '20%', right: 10,
    font:'80px',
    alignment: 'center'
  }).appendTo(mainPage);
}
function pageAbout() {
  drawer.close();
  //creating page
  let page = new Page({
    title: 'About'
  }).appendTo(navigationView);
  //new element on the page
  //todo
  new Button({
    left: 16, top: 16, right: 16,
    text: 'Go back'
  }).on('select', () => page.dispose())
    .appendTo(page);
  //return page;
}
function pageStatistics() {
  drawer.close();
  //creating page
  let page = new Page({
    title: 'Statistics'
  }).appendTo(navigationView);
  //new element on the page
  //todo
  new Button({
    left: 16, top: 16, right: 16,
    text: 'Get stufff'
  }).on('select', () => getLastRecords(1))
    .appendTo(page);
  //return page;
}
function pageSettings() {
  drawer.close();
  //creating page
  let page = new Page({
    title: 'Settings'
  }).appendTo(navigationView);

  //Work session length
  new TextView({
    top:10,
    left: 10,
    text: 'Work session length',
    alignment: 'left'
  }).appendTo(page);

  let workLenComposite = new Composite({
    left: 10, top: 'prev() 10', right: 10,
    background: BG_COLOR,
  }).appendTo(page);

  let workLen = new TextView({
    right: 0,
    text: getSettings('workInterval') + ' min',
    alignment: 'right'
  }).appendTo(workLenComposite);

  new Slider({
    left: 0,
    minimum: 1,
    right:'next() 60',
    selection: getSettings('workInterval'),
    maximum: 60
  }).on('selectionChanged', ({value}) => {
    changeWorkInterval(value);
    workLen.text = value+' min';
  }).appendTo(workLenComposite);

  //Break length
  new TextView({
    top:'prev() 10',
    left: 10,
    text: 'Break length',
    alignment: 'left'
  }).appendTo(page);

  let breakLenComposite = new Composite({
    left: 10, top: 'prev() 10', right: 10,
    background: BG_COLOR,
  }).appendTo(page);

  let breakLen = new TextView({
    right: 0,
    text: getSettings('breakInterval') + ' min',
    alignment: 'right'
  }).appendTo(breakLenComposite);

  new Slider({
    left: 0,
    minimum: 1,
    right:'next() 60',
    selection: getSettings('breakInterval'),
    maximum: 15
  }).on('selectionChanged', ({value}) => {
    changeBreakInterval(value);
    breakLen.text = value+' min';
  }).appendTo(breakLenComposite);


  //After work session
  new TextView({
    top:'prev() 10',
    left: 10,
    text: 'After work session is finished',
    alignment: 'left'
  }).appendTo(page);

  let finishedComposite = new Composite({
    left: 10, top: 'prev() 10', right: 10,
    background: BG_COLOR,
  }).appendTo(page);

  new ToggleButton({
    left: 0, top: 0,
    //boolean value returned from the localStorage is going to be string
    text: getSettings('vibration') === 'true' ? 'Vibration on' : 'Vibration off',
    checked: getSettings('vibration') === 'true'
  }).on('checkedChanged', (event) => {
    event.target.text = event.value ? 'Vibration on' : 'Vibration off';
    setSettings('vibration', event.value);
    console.log(typeof event.value);
  }).appendTo(finishedComposite);

  new ToggleButton({
    left: 'prev() 10', top: 0,
    text: getSettings('sound') === 'true' ? 'Sound signal on' : 'Sound signal off',
    checked: getSettings('sound') === 'true'
  }).on('checkedChanged', (event) => {
    event.target.text = event.value ? 'Sound signal on' : 'Sound signal off';
    setSettings('sound', event.value);
    console.log(typeof event.value);
  }).appendTo(finishedComposite);
}
function drawerContent() {
  new Button({
    left: 16, top: 16, right: 16,
    text: 'Statistics'
  }).on('select', () => pageStatistics())
    .appendTo(drawer);
  new Button({
    left: 16, top: 'prev() 16', right: 16,
    text: 'Settings'
  }).on('select', () => pageSettings())
    .appendTo(drawer);
  new Button({
    left: 16, top: 'prev() 16', right: 16,
    text: 'About'
  }).on('select', () => pageAbout())
    .appendTo(drawer);
}


