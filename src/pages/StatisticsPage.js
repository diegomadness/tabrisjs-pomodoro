const {TextView, Page} = require('tabris');
const {appData} = require('../AppData');
const {db} = require('../Database');
const ChartComposite = require('../composites/ChartComposite');
const moment = require('moment');

module.exports = class StatisticsPage extends Page {
  constructor (properties) {
    super(properties);
    this.workData = [0, 0, 0, 0, 0, 0, 0];
    this.breakData = [0, 0, 0, 0, 0, 0, 0];
    this.chartData = {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      datasets: [
        {
          'label': 'Work time',
          'fillColor': 'rgba(220,220,220,0.2)',
          'strokeColor': 'rgba(220,220,220,1)',
          'pointColor': 'rgba(220,220,220,1)',
          'pointStrokeColor': '#fff',
          'pointHighlightFill': '#fff',
          'pointHighlightStroke': 'rgba(220,220,220,1)',
          'data': this.workData
        },
        {
          'label': 'Break time',
          'fillColor': 'rgba(151,187,205,0.2)',
          'strokeColor': 'rgba(151,187,205,1)',
          'pointColor': 'rgba(151,187,205,1)',
          'pointStrokeColor': '#fff',
          'pointHighlightFill': '#fff',
          'pointHighlightStroke': 'rgba(151,187,205,1)',
          'data': this.breakData
        }
      ]
    };
    //stats
    this.totalBreakCount = 0;
    this.totalWorkCount = 0;
    this.totalBreakTime = 0;
    this.totalWorkTime = 0;

    appData.drawer.close();
    this.title = 'Statistics';
    //refresh chart data
    this.getChartData();

    this._createUI();
  }

  _createUI () {
    this.append(
      new TextView({
        top: 16,
        left: 16,
        right: 16,
        text: 'Weekly progress report',
        font: '18px bold',
        alignment: 'left'
      }),
      new TextView({
        top: 'prev() 16',
        left: 16,
        right: 16,
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

  getChartData () {
    let labels = this.getChartLabels();

    //get records from db
    db.loadStats();
    //just in case
    if (appData.dbDataset === 0) {
      //empty graph
      return;
    }

    //separate breaks from work sessions and assign them to the week days
    for (let i = 0; i < appData.dbDataset.length; i++) {
      let record = appData.dbDataset.item(i);
      let endDay = moment(parseInt(record.end)).format('dddd');
      let index = labels.findIndex(function (element) {
        return this === element;
      }, endDay);

      if (record.type === db.TYPE_BREAK) {
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
    let labels = [];
    //get labels
    for (let i = 0; i < 7; i++) {
      labels.unshift(moment().subtract(i, 'day').format('dddd'));
    }
    this.chartData.labels = labels;
    return labels;
  }
};
