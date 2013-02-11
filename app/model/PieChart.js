/**
 * 
 */
Ext.define('Duyun.model.PieChart', {
    extend: 'Ext.data.Model',
    fields: [{name: 'name', type: 'string'},
             {name: 'value', type: 'int'},
             {name: 'tooltip', type: 'string'}]
});