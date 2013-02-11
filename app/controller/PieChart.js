/**
 * 
 */
Ext.define('Duyun.controller.PieChart',{
	extend: 'Ext.app.Controller',
	stores: ['PieChart'],
	requires: ['Duyun.model.PieChart'],
	
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
				url: 'data/RequestPieChartData.php',
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
					chart: 'pie'
				}
			});				
		});
	},
	
	loadRealMonitorData: function(data, ctx){
		return Wind.Async.Task.create(function(t){	
			var store = ctx.getPieChartStore();	
			store.removeAll();
			
			if (Ext.isEmpty(data) || (!Ext.isArray(data)) || (data.length === 0)){
				t.complete('success');
				return;
			}
			
			Ext.each(data, function(record){
				var temp = Ext.create('Duyun.model.PieChart', {
								name: record.name,
								value: record.value,
								tooltip: record.tooltip
						   });
				store.add(temp);
			});
			store.commitChanges();
			
			t.complete('success');
		});
	}
});