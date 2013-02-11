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
		$responseText = ClearResponseText(RequestHTTPS($url));
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
	
	function ClearResponseText($data){
		$data = str_replace("&", "&amp;", $data);
		$data = str_replace(" 's", "' s", $data);
		
		return $data;
	}
		
	function ParseXmlToRealMonitorData($root){		
		$rows = $root->xpath("/chart/chart_data/row");
		$nameValueRow = $rows[0];
		$upValueRow = $rows[1];
		$downValueRow = $rows[2];
		
		$values = array();
		$index = 0;
		foreach($nameValueRow->string as $name){
			$values[$index++]["name"] = (String)$name;
		}
		$index = 0;
		foreach($upValueRow->number as $value){
			$values[$index]["up"] = (String)$value;
			$values[$index]["tooltip"] = (String)$value->attributes()->tooltip;
			$index++;			
		}
		$index = 0;
		foreach($downValueRow->number as $value){
			$values[$index++]["down"] = (String)$value;
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