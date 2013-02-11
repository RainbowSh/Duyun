<?php
	ini_set("zend.zel_compatibility_mode", "Off");	
	try {
		define('REALMONITORURL', '/cgi-bin/realtimemonitor.cgi', false);
		$host = "https://tiderway.uicp.cn:8080";
		$time = $_GET["time"];
		if ($time == ""){
			$time = "time=".time();
		}else{
			$time = "update=".$time;
		}
		
		$language = $_GET["lan"];  //此处可能需要改为从Session取。
		$resource = $_GET["resource"];
		$chart = $_GET["chart"];
		
	 	$url = $host.REALMONITORURL."?". 
	 	       $time."&".
	 		   "lan=".$language."&".
	 	       "object=resource&". 
	 	       "resource=".$resource."&".
	 	       "range=all&".
	 	       "chart=".$chart;
	 	       
		$lastRecordTime = $_GET["lastRecordTime"];
		if($lastRecordTime != ""){
			list($lastRecordDate, $lastRecordTime) = explode(" ", $lastRecordTime);
		}
		
		$data = RequestRealMonitorData($url, $lastRecordTime);		
		echo json_encode($data);
	} catch (Exception $e) {
		$data = array("Success"=>false, "Error"=>$e);
		echo json_encode($data);
	}
	
	function RequestRealMonitorData($url, $lastRecordTime){
		$responseText = str_replace("&", "&amp;", RequestHTTPS($url));		
		$returnValue = ParseResponseText($responseText, $lastRecordTime);
		
		return $returnValue;
	}
	
	function RequestHTTPS($url){
	 	$ch = curl_init();	 	
		
	 	curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		$response = curl_exec($ch);
		
		curl_close($ch);
		
		return $response;		
	}

	function ParseResponseText($data, $lastRecordTime){
		$root = simplexml_load_string($data);		
		$returnValue = array("Success"=>true,
		                     "Data"=>GetRealMonitorData($root, $lastRecordTime), 
		                     "Time"=>GetNextRequestTime($root));
				
		return $returnValue;
	}
	
	function GetRealMonitorData($root, $lastRecordTime){
		$data = GetRealMonitorDataSinceLastTime($root, $lastRecordTime);
		
		return AddDateToRealMonitorData($data);
	}
	
	function GetRealMonitorDataSinceLastTime($root, $lastRecordTime){		
		$data = ParseXmlToRealMonitorData($root);
		if ($lastRecordTime == ""){
			return $data;
		}
		
		$index = GetIndexOfSpecialTimeRecord($data, $lastRecordTime);		
		if($index == 0){
			return $data;
		}else{
			return array_slice($data, $index + 1);
		}		
	}
	
	function ParseXmlToRealMonitorData($root){		
		$rows = $root->xpath("/chart/chart_data/row");
		$row1 = $rows[0];
		$row2 = $rows[1];
		
		$values = array();
		$index = 0;
		foreach($row1->string as $time){
			$values[$index++]['time'] = (String)$time;
		}
		$index = 0;
		foreach($row2->number as $value){
			$values[$index++]['value'] = (String)$value;			
		}
		
		return $values;
	}
	
	function GetIndexOfSpecialTimeRecord($data, $time){	
		$index = 0;
		while($record = current($data)){
			if($record["time"] == $time){
				break;
			}
			$index++;;
			next($data);
		}
		
		return $index == count($data) ? 0 : $index;
	}
	
	function AddDateToRealMonitorData($data){
		$lastDate = date("Y-m-d", strtotime("-1 days"));		
		$date = date("Y-m-d", time());
		
		$midnightIndex = GetIndexOfSpecialTimeRecord($data, "00:00:00");
		
		for($i = 0; $i < $midnightIndex; $i++){
			$data[$i]["time"] = $lastDate." ".$data[$i]["time"];
		}	
		for($i = $midnightIndex; $i < count($data); $i++){
			$data[$i]["time"] = $date." ".$data[$i]["time"];				
		}	
		
		return $data;
	}
	
	function GetNextRequestTime($root){		
		$url = (String)$root->update->attributes()->url;
		$queryStr = explode('&', strstr($url, '?'));
		$update = explode('=', $queryStr[0]);
		
		return $update[1];
	}
?>