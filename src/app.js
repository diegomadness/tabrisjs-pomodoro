const {Composite, Button, TextView, NavigationView, Page, Slider,ToggleButton, ui} = require('tabris');
const bgColor = '#ffffff';
let appSettings = {
  workInterval: 15,
  breakInterval:5
};
let refreshTimer = null;
let workTimer = null;
let timeLeft = appSettings.workInterval;

// Enable the drawer - left slide menu
let drawer = ui.drawer;
drawer.enabled = true;
//filling drawer with navigation buttons
drawerContent();

//top menu
let navigationView = new NavigationView({
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  drawerActionVisible:true //sandwich button for openong the drawer
}).appendTo(ui.contentView);

//creating main application page
let mainPage = new Page({
  title: 'Easy Pomodoro'
}).appendTo(navigationView);

mainPageContent();
//display fresh timer
clockDisplayWorkingTime();

sqlitePlugin.echoTest(function() {
  console.log('ECHO test OK');
});

sqlitePlugin.selfTest(function() {
  console.log('SELF test OK');
});






function mainPageContent() {
  //timer button group - play, pause, stop and resume buttons
  let timerButtonGroup = new Composite({
    id:'timerButtonGroup',
    left: 0, bottom: 0, right: 0,
    background: bgColor,
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
    background: bgColor,
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

  //main timer clocks
  new TextView({
    id:'timerDisplay',
    left: 10, top: '20%', right: 10,
    font:'80px',
    alignment: 'center'
  }).appendTo(mainPage);
}


function startTimer(seconds, oncomplete) {
  let startTime, timer;
  let ms = seconds*1000;
  let obj = {};
  obj.resume = function() {
    startTime = new Date().getTime();
    timer = setInterval(obj.step, 250);
  };
  obj.pause = function() {
    ms = obj.step();
    clearInterval(timer);
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
      clearInterval(timer);
      obj.resume = function() {};
      if( oncomplete) oncomplete();
    }
    return now;
  };
  obj.startOver = function() {
    obj.resume = function() {};
    clearInterval(timer);
    return null;
  };
  obj.resume();
  return obj;
}
function refreshClock(m,s) {
  mainPage.find('#timerDisplay').set('text', m+':'+s);
}
function clockDisplayWorkingTime() {
  let m = Math.floor(appSettings.workInterval/60);
  let s = Math.floor(appSettings.workInterval % 60);
  mainPage.find('#timerDisplay').set('text', m+':'+s);
}

function startWorking() {
  //hide Play button, show Pause and Stop buttons
  buttonsStanceWork();

  if(workTimer != null)
  {
    //resume
    workTimer.resume();
  }
  else
  {
    //start
    workTimer = startTimer(appSettings.workInterval, function () {
      finishedWorking();
    });
  }
}

function pauseWorking() {
  buttonsStancePause();
  workTimer.pause();
}

function resumeWorking() {
  buttonsStanceWork();
  workTimer.resume();
}

function startOverWorking() {
  workTimer.startOver();
  workTimer = startTimer(appSettings.workInterval, function () {
    finishedWorking();
  });
}

function finishedWorking() {
  buttonsStanceWorkFinished();
  clockDisplayWorkingTime();
}

function startBreak() {
//todo
}

function stopBreak() {
  clockDisplayWorkingTime();
  //todo
}

function buttonsStanceWork() {
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

function buttonsStanceWorkFinished(){
  mainPage.find('#finishButtonGroup').set('visible', true);
  mainPage.find('#timerButtonGroup').set('visible', false);
}

/**
 * PAGES
 */

function pageAbout() {
  drawer.close();
  //creating page
  let page = new Page({
    title: 'About'
  }).appendTo(navigationView);
  //new element on the page
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
  new Button({
    left: 16, top: 16, right: 16,
    text: 'Go back'
  }).on('select', () => page.dispose())
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
    background: bgColor,
  }).appendTo(page);

  let workLen = new TextView({
    right: 0,
    text: 'todo min',
    alignment: 'right'
  }).appendTo(workLenComposite);

  new Slider({
    left: 0,
    minimum: 1,
    right:'next() 60',
    selection: 1,
    maximum: 60
  }).on('selectionChanged', ({value}) => workLen.text = value+' min')
    .appendTo(workLenComposite);

  //Break length
  new TextView({
    top:'prev() 10',
    left: 10,
    text: 'Break length',
    alignment: 'left'
  }).appendTo(page);

  let breakLenComposite = new Composite({
    left: 10, top: 'prev() 10', right: 10,
    background: bgColor,
  }).appendTo(page);

  let breakLen = new TextView({
    right: 0,
    text: 'todo min',
    alignment: 'right'
  }).appendTo(breakLenComposite);

  new Slider({
    left: 0,
    minimum: 1,
    right:'next() 60',
    selection: 1,
    maximum: 15
  }).on('selectionChanged', ({value}) => breakLen.text = value+' min')
    .appendTo(breakLenComposite);


  //After work session
  new TextView({
    top:'prev() 10',
    left: 10,
    text: 'After work session is finished',
    alignment: 'left'
  }).appendTo(page);

  let finishedComposite = new Composite({
    left: 10, top: 'prev() 10', right: 10,
    background: bgColor,
  }).appendTo(page);

  new ToggleButton({
    left: 0, top: 0,
    text: 'todo on',
    checked: true
  }).on('checkedChanged', event => event.target.text = event.value ? 'Vibration on' : 'Vibration off')
    .appendTo(finishedComposite);

  new ToggleButton({
    left: 'prev() 10', top: 0,
    text: 'todo on',
    checked: true,
  }).on('checkedChanged', event => event.target.text = event.value ? 'Sound signal on' : 'Sound signal off')
    .appendTo(finishedComposite);
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

