/**
 * 
 */
Ext.define('Duyun.model.ColumnChart', {
    extend: 'Ext.data.Model',
    fields: [{name: 'name', type: 'int'},
             {name: 'up', type: 'float'},
             {name: 'down', type: 'float'},
             {name: 'tooltip', type: 'string'}]
});