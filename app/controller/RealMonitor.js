/**
 * 
 */
Ext.define('Duyun.controller.RealMonitor',{
	extend: 'Ext.app.Controller',
	stores: ['RealMonitor'],
	requires: ['Duyun.model.RealMonitor'],
	refs: [{
		ref: 'chart',
		selector: 'linechartpanel > chart'
	}],
	
	onLaunch: function(){
		eval(Wind.compile('async', function(ctx){	
			var time = '', lastRecordTime = '', returnValue; 
			while(true){		
				returnValue = $await(ctx.getRealMonitorData(time, lastRecordTime, ctx));
				if(!returnValue.Success){
					throw new Error(returnValue.Error);
				}	

				$await(ctx.loadRealMonitorData(returnValue.Data, ctx));
				time = returnValue.Time;
				lastRecordTime = ctx.getLastRecordTime(ctx);
				
				$await(Wind.Async.sleep(10000));
			}						
		}))(this).start();
	},
		
	getRealMonitorData: function(time, lastRecordTime, ctx){
		return Wind.Async.Task.create(function(t){
			Ext.Ajax.request({
				url: 'data/RequestRealMonitorData.php',
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
					resource: 'cpu',
					chart: 'line',
					lastRecordTime: lastRecordTime
				}
			});				
		});
	},
	
	loadRealMonitorData: function(data, ctx){
		return Wind.Async.Task.create(function(t){	
			if (Ext.isEmpty(data) || (!Ext.isArray(data)) || (data.length === 0)){
				t.complete('success');
				return;
			}

			ctx.setChartAxis(data[data.length - 1].time);
			var store = ctx.getRealMonitorStore();	
			if (store.getCount() > 0){				
				for(var i = 0; i < data.length; i++){
					store.removeAt(0);
				}
			}
			
			Ext.each(data, function(record){
				var temp = Ext.create('Duyun.model.RealMonitor', {
								time: new Date(record.time),
								value: record.value
						   });
				store.add(temp);
			});
			store.commitChanges();
			
			t.complete('success');
		});
	},
	
	getLastRecordTime: function(ctx){
		var store = ctx.getRealMonitorStore();
		if (store.getCount() > 0){
			return store.getAt(store.getCount() - 1).get('time');
		} else {
			return '';
		}
	},
	
	setChartAxis: function(lastDate){
		var chart = this.getChart();
		
		var timeAxis = chart.axes.get(1),
			toDate = timeAxis.toDate,
			markerIndex = chart.markerIndex || 0,
			lastDate = new Date(lastDate);
			
	    if (+toDate < +lastDate) {
	        markerIndex = 1;
	        timeAxis.toDate = lastDate;
	        timeAxis.fromDate = Ext.Date.add(Ext.Date.clone(lastDate), Ext.Date.HOUR, -1);
	        chart.markerIndex = markerIndex;
	    }
	}
});