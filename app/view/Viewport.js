/**
 * 
 */
Ext.define('Duyun.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: ['Duyun.view.LineChartPanel', 'Duyun.view.PieChartPanel', 'Duyun.view.ColumnChartPanel'],
    //requires: ['Duyun.view.ColumnChartPanel'],
    
    layout: 'fit',
    
    initComponent: function() {
        this.items = {
            xtype: 'panel',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                width: 500,
                xtype: 'panel',
                layout: 'fit',
                items: [{
                    xtype: 'piechartpanel',
                    flex: 1
                }]
            }, {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'columnchartpanel',
                    height: 250
                }, {
                    xtype: 'linechartpanel',
                    layout: 'fit',
                    flex: 1
                }]
            }]
        };
        this.callParent();
    }
});