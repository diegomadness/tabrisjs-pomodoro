const {TextView, Page} = require('tabris');
const ChartComposite = require('../components/ChartComposite');
const moment = require('moment');

module.exports = class StatisticsPage extends Page {
  constructor (properties, app) {
    super(properties);
    this._app = app;
    this.workData = [0, 0, 0, 0, 0, 0, 0];
    this.breakData = [0, 0, 0, 0, 0, 0, 0];
    this.chartData = {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      datasets: [
        {
          label: 'Work time',
          fillColor: 'rgba(220,220,220,0.2)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: this.workData
        },
        {
          label: 'Break time',
          fillColor: 'rgba(151,187,205,0.2)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(151,187,205,1)',
          data: this.breakData
        }
      ]
    };
    //stats
    this.totalBreakCount = 0;
    this.totalWorkCount = 0;
    this.totalBreakTime = 0;
    this.totalWorkTime = 0;
    app.drawer.close();
    this.title = 'Statistics';

    this.getChartData();//refresh chart data

    this._createUI();
  }

  getChartData () {
    const labels = this.getChartLabels();
    this._app.db.loadStats();//get records from db

    if (this._app.appData.dbDataset === 0) {
      return;//empty graph
    }

    //separate breaks from work sessions and assign them to the week days
    for (let i = 0; i < this._app.appData.dbDataset.length; i++) {
      const record = this._app.appData.dbDataset.item(i);
      const endDay = moment(parseInt(record.end)).format('dddd');
      const index = labels.indexOf(endDay);

      if (record.type === this._app.db.TYPE_BREAK) {
        //break session
        this.totalBreakCount++;
        this.totalBreakTime = this.totalBreakTime + record.length;
        this.breakData[index] = this.breakData[index] + record.length;
      }
      else {
        //work session
        this.totalWorkCount++;
        this.totalWorkTime = this.totalWorkTime + record.length;
        this.workData[index] = this.workData[index] + record.length;
      }
    }
  }

  getChartLabels () {
    const labels = [];
    //get labels
    for (let i = 0; i < 7; i++) {
      labels.unshift(moment().subtract(i, 'day').format('dddd'));
    }
    this.chartData.labels = labels;
    return labels;
  }

  _createUI () {
    this.append(
      new TextView({
        top: 16, left: 16, right: 16,
        text: 'Weekly progress report',
        font: '18px bold',
        alignment: 'left'
      }),
      new TextView({
        top: 'prev() 16', left: 16, right: 16,
        text: 'You have completed ' + this.totalWorkCount + ' work sessions with a total duration of ' +
        this.totalWorkTime + ' minutes and ' + this.totalBreakCount + ' break sessions with a total duration of ' +
        this.totalBreakTime + ' minutes',
        alignment: 'left'
      }),
      new ChartComposite({
        chart: {type: 'Bar', data: this.chartData},
        left: 0, top: 'prev() 0', right: 0, bottom: 0
      })
    );
  }
};
