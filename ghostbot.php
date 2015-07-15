<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta charset="utf-8">
		<title>Ghost Bot</title>
		<meta name="generator" content="Bootply" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.min.css" rel="stylesheet">
		<!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<link href="css/styles.css" rel="stylesheet">
		
	</head>
	<body>
<div id = "json_holder">
<?php
	require('service.php');
?>
</div>

<div class="container-full">

    	<div class="col-lg-12 text-center v-center" id = "firstPage">
		</br></br></br></br></br></br></br>
		
			
			<button type = "button" class = "btn btn-primary start-btn" id = "computerFirst">Computer</button>
			</br></br>
			<button type = "button" class = "btn btn-primary start-btn" id = "playerFirst">Player</button>
		
			
	
	</div>
       
        <div class="col-lg-12 text-center v-center" id = "secondPage"> 
          
       
          
        <br><br><br>
	  
  
	 
	<p id = "position">loading</p>
          
            <div class="input-group" style="width:340px;text-align:center;margin:0 auto;">
            	<input class="form-control input-lg" placeholder="Enter a letter" type="text" id = "letterEntry">
            	<span class="input-group-btn fix"><button class="btn btn-lg btn-primary" type="button" id = "analyze">Play</button></span>
            </div>
	    
	<div id = "end_text">
        	<p id = "message"></p>
		<p id = "potential_words"></p>
	</div>
	    
          
	</div>
        
  
  	<br><br><br><br><br>

</div> <!-- /container full -->

	<!-- script references -->
		<script src="jquery-2.1.4.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src = "js/functionality.js"></script>
	</body>
</html>