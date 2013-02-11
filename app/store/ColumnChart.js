/**
 * 
 */
Ext.define('Duyun.store.ColumnChart', {
    extend: 'Ext.data.Store',
    requires: 'Duyun.model.ColumnChart',
    model: 'Duyun.model.ColumnChart',
    sorters: [{
        property: 'name',
        direction: 'DESC'
    }]
});