/**
 * 
 */
Ext.define('Duyun.view.PieChartPanel',{
	extend: 'Ext.panel.Panel',
	requires: ['Ext.panel.Panel', 'Ext.chart.*'],
	alias: 'widget.piechartpanel',
	width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 550,
    maximizable: true,
    title: 'Top 10 Real-Time Services Distribution',
    layout: 'fit',
    items: [{
        xtype: 'chart',
        style: 'background:#fff',
        store: 'PieChart',
        id: 'pieChartCmp',
        animate: true,
        shadow: true,
        legend: {
            position: 'right'
        },
        insetPadding: 60,
        theme: 'Base:gradients',
        series: [{
            type: 'pie',
            angleField: 'value',
            showInLegend: true,
            tips: {
              trackMouse: true,
              width: 140,
              height: 70,
              renderer: function(storeItem, item) {            	  
            	  this.setTitle(storeItem.get('tooltip'));
              }
            },
            highlight: {
              segment: {
                margin: 20
              }
            },
            label: {
                field: 'name',
                display: 'rotate',
                contrast: true,
                font: '18px Arial',
                renderer: function(v){                	
                	var a = v.split(' ');
                	return a[0];
                }                	
            }
        }]
    }]
});