/**
 * 
 */
Ext.require([
    'Ext.window.Window',
    'Ext.chart.*'
]);

Ext.onReady(function () {
    var chart;
    var generateData = (function() {
        var data = [], i = 0,
            last = false,
            time = new Date(2011, 1, 1, 8, 10, 10),
            //seconds = +date,
            min = Math.min,
            max = Math.max,
            random = Math.random;
        return function() {
            data = data.slice();
            data.push({
                time:  Ext.Date.add(time, Ext.Date.SECOND, 10 * i++),
                value: min(100, max(last? last.value + (random() - 0.5) * 20 : random() * 100, 0))
            });
            last = data[data.length -1];
            console.log(Ext.encode(last));
            return data;
        };
    })();

    var group = false,
        groupOp = [{
            dateFormat: 'h:i:s',
            groupBy: 'hour,minute,second'
        }, {
            dateFormat: 'h:i',
            groupBy: 'hour,minute'
        }];

    function regroup() {
        group = !group;
        var axis = chart.axes.get(1),
            selectedGroup = groupOp[+group];
        axis.dateFormat = selectedGroup.dateFormat;
        axis.groupBy = selectedGroup.groupBy;

        chart.redraw();
    }

    var store = Ext.create('Ext.data.JsonStore', {
        fields: ['time', 'value'],
        data: generateData()
    });

    var intr = setInterval(function() {
        var gs = generateData();
        var toDate = timeAxis.toDate,
            lastDate = gs[gs.length - 1].time,
            markerIndex = chart.markerIndex || 0;
        if (+toDate < +lastDate) {
            markerIndex = 1;
            timeAxis.toDate = lastDate;
            timeAxis.fromDate = Ext.Date.add(Ext.Date.clone(timeAxis.fromDate), Ext.Date.SECOND, 10);
            chart.markerIndex = markerIndex;
        }
        store.loadData(gs);
    }, 100);

    Ext.create('Ext.Window', {
        width: 800,
        height: 600,
        minHeight: 400,
        minWidth: 550,
        maximizable: true,
        title: 'Live Updated Chart',
        layout: 'fit',
        items: [{
            xtype: 'chart',
            style: 'background:#fff',
            store: store,
            id: 'chartCmp',
            axes: [{
                type: 'Numeric',
                grid: true,
                minimum: 0,
                maximum: 100,
                position: 'left',
                fields: ['value'],
                title: 'Number of Hits',
                grid: {
                    odd: {
                        fill: '#dedede',
                        stroke: '#ddd',
                        'stroke-width': 0.5
                    }
                }
            }, {
                type: 'Time',
                position: 'bottom',
                fields: 'time',
                title: 'Day',
                dateFormat: 'h:i:s',
                groupBy: 'hour,minute,second',
                aggregateOp: 'sum',

                constrain: true,
                fromDate: new Date(2011, 1, 1, 8, 10, 0),
                toDate: new Date(2011, 1, 1, 8, 10, 50), 
                step: [Ext.Date.SECOND, 10]
            }],
            series: [{
                type: 'line',
                axis: ['left', 'bottom'],
                xField: 'time',
                yField: 'value',
                label: {
                    display: 'none',
                    field: 'value',
                    renderer: function(v) { return v >> 0; },
                    'text-anchor': 'middle'
                },
                markerConfig: {
                    radius: 5,
                    size: 5
                }
            }]
        }]
    }).show();
    chart = Ext.getCmp('chartCmp');
    var timeAxis = chart.axes.get(1);
});