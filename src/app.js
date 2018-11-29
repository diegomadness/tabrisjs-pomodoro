const AppBootstrap = require('./AppBootstrap');
new AppBootstrap();
/*
const {Canvas, Page, device, NavigationView, ui} = require('tabris');

const navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const page = new Page({
  title: 'Basic Shapes',
  autoDispose: false
});

const canvas = new Canvas({
  centerX: 0, top: 32, width: CANVAS_WIDTH, height: CANVAS_HEIGHT
}).appendTo(page);

const scaleFactor = device.scaleFactor;
const ctx = canvas.getContext('2d', CANVAS_WIDTH * scaleFactor, CANVAS_HEIGHT * scaleFactor);
ctx.scale(scaleFactor, scaleFactor);
ctx.textBaseline = 'top';
ctx.textAlign = 'center';

drawArc(ctx, 150, 150, 150);
ctx.fillStyle = '#ffeeee';
ctx.fill();

drawArc(ctx, 150, 150, 130);
ctx.fillStyle = '#ffdcdc';
ctx.fill();

function drawArc(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, -Math.PI, Math.PI);
  ctx.closePath();
}

page.appendTo(navigationView);
*/
