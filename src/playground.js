/*
//drawer
const {Button, TextView, ui} = require('tabris');

let button = new Button({
  centerX: 0, top: 100,
  text: 'Show message'
}).appendTo(ui.contentView);

let textView = new TextView({
  centerX: 0, top: [button, 50],
  font: '24px'
}).appendTo(ui.contentView);

button.on('select', () => {
  textView.text = 'Tabris.js rocks!';
});



// Enable the drawer and append a widget to it

let drawer = ui.drawer;

drawer.enabled = true;

drawer.on('open', () => console.log('drawer opened'))
  .on('close', () => console.log('drawer closed'));

let arrow = String.fromCharCode(8592);
createLabel(arrow + ' Swipe from left or tap here')
  .on('tap', () => drawer.open())
  .appendTo(ui.contentView);

createLabel('Thank you!')
  .on('tap', () => drawer.close())
  .appendTo(drawer);

function createLabel(text) {
  return new TextView({
    left: 10, centerY: 0,
    text: text,
    font: '22px Arial'
  });
}
*/
/*
//pages and menu
const {Button, NavigationView, Page, ui} = require('tabris');

let pageCount = 0;

let navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);

createPage();

function createPage(title) {
  let page = new Page({
    title: title || 'Initial Page'
  }).appendTo(navigationView);
  new Button({
    left: 16, top: 16, right: 16,
    text: 'Create another page'
  }).on('select', () => createPage('Page ' + (++pageCount)))
    .appendTo(page);
  new Button({
    left: 16, top: 'prev() 16', right: 16,
    text: 'Go back'
  }).on('select', () => page.dispose())
    .appendTo(page);
  new Button({
    left: 16, top: 'prev() 16', right: 16,
    text: 'Go to initial page'
  }).on('select', () => {
    navigationView.pages().dispose();
    createPage();
  }).appendTo(page);
  return page;
}
*/

/*
//timer
const {Button, CheckBox,TextInput, TextView, ui} = require('tabris');

let cpsCount = 0;
let startTime = new Date().getTime();
let taskId;

let statusTextView = new TextView({
  left: 16, top: 24, right: 16,
  text: 'Last update: <none>'
}).appendTo(ui.contentView);

let cpsTextView = new TextView({
  left: 16, top: [statusTextView, 16], right: 16,
  text: 'Calls per second: <none>'
}).appendTo(ui.contentView);

let delayTextView = new TextView({
  left: 16, top: [cpsTextView, 24],
  text: 'Delay (ms):'
}).appendTo(ui.contentView);

let delayTextInput = new TextInput({
  left: [delayTextView, 16], baseline: delayTextView,
  id: 'delayTextInput',
  text: '1000',
  message: 'Delay (ms)'
}).appendTo(ui.contentView);

let repeatCheckbox = new CheckBox({
  left: 16, top: delayTextInput,
  text: 'Repeat'
}).appendTo(ui.contentView);

let startButton = new Button({
  left: ['50%', 16 / 4], top: [repeatCheckbox, 24], right: 16,
  text: 'Start timer'
}).on('select', () => {
  let delay = parseInt(delayTextInput.text);
  if (repeatCheckbox.checked) {
    taskId = setInterval(updateStatusTextViews, delay);
  } else {
    taskId = setTimeout(() => {
      updateStatusTextViews();
      enableTimerStart(true);
    }, delay);
  }
  enableTimerStart(false);
}).appendTo(ui.contentView);

let cancelButton = new Button({
  left: 16, top: [repeatCheckbox, 24], right: ['50%', 16 / 4],
  text: 'Cancel timer',
  enabled: false
}).on('select', () => {
  clearTimeout(taskId);
  enableTimerStart(true);
}).appendTo(ui.contentView);

function updateStatusTextViews() {
  cpsCount++;
  let curTime = new Date().getTime();
  let diff = curTime - startTime;
  if (diff >= 1000) {
    cpsTextView.text = 'Calls per second: ' + cpsCount;
    cpsCount = 0;
    startTime = curTime;
  }
  statusTextView.text = 'Last update: ' + new Date().getTime().toString();
}

function enableTimerStart(available) {
  startButton.enabled = available;
  cancelButton.enabled = !available;
}
*/

/*
// Create composites and append children to them

let composite1 = new Composite({
  left: 0, top: 0, bottom: 0, right: '50%',
  background: '#f3f3f3'
}).appendTo(ui.contentView);

new TextView({
  left: 0, right: 0, top: '50%',
  alignment: 'center',
  text: 'Composite 1'
}).appendTo(composite1);

let composite2 = new Composite({
  left: '50%', top: 0, bottom: 0, right: 0,
  background: '#eaeaea'
}).appendTo(ui.contentView);

new TextView({
  left: 0, right: 0, top: '50%',
  alignment: 'center',
  text: 'Composite 2'
}).appendTo(composite2);
*/