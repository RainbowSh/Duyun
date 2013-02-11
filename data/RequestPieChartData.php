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
	 	       "object=home&". 
	 	       "chart=".$chart."&".
	 	       "linkcolor=2160B8&linecolor=A1BEEF";
		
		$data = RequestRealMonitorData($url);		
		echo json_encode($data);
	} catch (Exception $e) {
		$data = array("Success"=>false, "Error"=>$e);
		echo json_encode($data);
	}
	
	function RequestRealMonitorData($url){
		$responseText = str_replace("&", "&amp;", RequestHTTPS($url));		
		$returnValue = ParseResponseText($responseText);
		
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

	function ParseResponseText($data){
		$root = simplexml_load_string($data);		
		$returnValue = array("Success"=>true,
		                     "Data"=>ParseXmlToRealMonitorData($root), 
		                     "Time"=>GetNextRequestTime($root));
				
		return $returnValue;
	}
		
	function ParseXmlToRealMonitorData($root){		
		$rows = $root->xpath("/chart/chart_data/row");
		$row1 = $rows[0];
		$row2 = $rows[1];
		
		$values = array();
		$index = 0;
		foreach($row1->string as $name){
			$values[$index++]["name"] = (String)$name;
		}
		$index = 0;
		foreach($row2->number as $value){
			$values[$index]["value"] = (String)$value;
			$values[$index]["tooltip"] = (String)$value->attributes()->tooltip;
			$index++;			
		}
		
		$legends = $root->xpath("/chart/draw");
		$index = 0;
		foreach($legends->text as $text){			
			$values[$index]["name"] = $values[$index]["name"]." ".(String)$text;
			$index++;
		}
		
		return $values;
	}
	
	function GetNextRequestTime($root){		
		$url = (String)$root->update->attributes()->url;
		$queryStr = explode('&', strstr($url, '?'));
		$update = explode('=', $queryStr[0]);
		
		return $update[1];
	}
?>
