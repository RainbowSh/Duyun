/**
 * 
 */
Ext.define('Duyun.view.ColumnChartPanel',{
	extend: 'Ext.panel.Panel',
	requires: ['Ext.panel.Panel', 'Ext.chart.*'],
	alias: 'widget.columnchartpanel',
	width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 550,
    maximizable: true,
    title: 'Top 10 Real-Time IPs ranking',
    layout: 'fit',
    items: [{
        xtype: 'chart',
        style: 'background:#fff',
        store: 'ColumnChart',
        id: 'columnChartCmp',
        animate: true,
        shadow: true,
        axes: [{
            type: 'Numeric',
            position: 'bottom',
            fields: ['up', 'down'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: 'IPs ranking',
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'left',
            fields: ['name'],
            title: 'Top 10 user'
        }],
        background: {
          gradient: {
            id: 'backgroundGradient',
            angle: 45,
            stops: {
              0: {
                color: '#ffffff'
              },
              100: {
                color: '#eaf1f8'
              }
            }
          }
        },
        series: [{
            type: 'bar',
            axis: 'bottom',
            highlight: true,
            tips: {
              trackMouse: true,
              width: 140,
              height: 28,
              renderer: function(storeItem, item) {
                this.setTitle(storeItem.get('tooltip'));
              }
            },
            xField: 'name',
            yField: ['up', 'down']
        }]
    }]
});