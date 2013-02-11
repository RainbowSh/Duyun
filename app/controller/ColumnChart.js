/**
 * 
 */
Ext.define('Duyun.controller.ColumnChart',{
	extend: 'Ext.app.Controller',
	stores: ['ColumnChart'],
	requires: ['Duyun.model.ColumnChart'],
	
	onLaunch: function(){
		eval(Wind.compile('async', function(ctx){	
			var time = '', returnValue; 
			while(true){		
				returnValue = $await(ctx.getRealMonitorData(time, ctx));
				if(!returnValue.Success){
					throw new Error(returnValue.Error);
				}	
				
				$await(ctx.loadRealMonitorData(returnValue.Data, ctx));
				time = returnValue.Time;
				
				$await(Wind.Async.sleep(10000));
			}						
		}))(this).start();
	},
		
	getRealMonitorData: function(time, ctx){
		return Wind.Async.Task.create(function(t){
			Ext.Ajax.request({
				url: 'data/RequestColumnChartData.php',
				method: 'GET',
				success: function(response){
					var result = Ext.decode(response.responseText);
					t.complete('success', result);
				},
				failure: function(response){
					t.complete('failure');
				},
				params:{
					time: time,
					lan: 'en_US',
					chart: 'column'
				}
			});				
		});
	},
	
	loadRealMonitorData: function(data, ctx){
		return Wind.Async.Task.create(function(t){	
			var store = ctx.getColumnChartStore();	
			store.removeAll();
			
			if (Ext.isEmpty(data) || (!Ext.isArray(data)) || (data.length === 0)){
				t.complete('success');
				return;
			}
			
			Ext.each(data, function(record){
				var temp = Ext.create('Duyun.model.ColumnChart', {
								name: record.name,
								up: record.up,
								down: record.down,
								tooltip: record.tooltip
						   });
				store.add(temp);
			});
			store.commitChanges();
			
			t.complete('success');
		});
	}
});