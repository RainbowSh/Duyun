/**
 * 
 */

Ext.define('Duyun.view.LineChartPanel',{
	extend: 'Ext.panel.Panel',
	requires: ['Ext.panel.Panel', 'Ext.chart.*'],
	alias: 'widget.linechartpanel',
	width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 550,
    maximizable: true,
    title: 'Real monitor demo',
    layout: 'fit',
    items: [{
        xtype: 'chart',
        style: 'background:#fff',
        store: 'RealMonitor',
        id: 'chartCmp',
        axes: [{
            type: 'Numeric',
            grid: true,
            maximum: 10,
            majorTickSteps: 100,
            position: 'left',
            fields: ['value'],
            title: 'CPU Utilization',
            grid: {
                odd: {
                    fill: '#dedede',
                    stroke: '#ddd',
                    'stroke-width': 0.1
                }
            }
        }, {
            type: 'Time',
            position: 'bottom',
            fields: 'time',
            title: 'Time',
            dateFormat: 'H:i:s',
            groupBy: 'hour,minute,second',
            aggregateOp: 'sum',

            constrain: true,
            fromDate: new Date(2011, 1, 5, 8, 12, 00),
            toDate: new Date(2011, 1, 5, 9, 11, 00),
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
                renderer: function(v) { console.log(v); return v >> 0; },
                'text-anchor': 'middle'
            },
            markerConfig: {
                radius: 2,
                size: 2
            }
        }]
    }]
});