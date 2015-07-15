<?php
 
//Define constants to connect to database for remote
//Hiding this...

error_reporting(-1);

//Define constants to connect to database for local
//Hiding this...

//Make the database connection
$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) OR die('Could not connect to MySQL: ' . mysqli_connect_error());

//Set the encoding
mysqli_set_charset($dbc, 'utf8');
 
// Check connection
if (mysqli_connect_error())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Selects ALL from the table 'all_words' which contains two columns: word and  id
$sql = "SELECT word FROM all_words";

//Query the database
$result = mysqli_query($dbc, $sql);

//Create an array to hold results
$resultArray = array();

//Loop through results and push to end of array
while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){

	$resultArray[] = $value['word'];
}

//Varaible whether or not to clean array
$clean_array = false;

//If clean array is set to true, clean the array
if($clean_array){
	
	//Array of words to remove from database
	$toRemove = array();
	
	//Loop through every word
	foreach($resultArray as $word){
		
		//Ensure it is > 3 letters
		if(strlen($word) < 4){
			
			//If not, add it to array of words to be removed
			array_push($toRemove, $word);
			
			//Skip the rest of the loop
			continue;
		}
		
		//Ensure it does not include another word
	
		//Loop through different substring possibilities
		for($i = 4; $i < strlen($word); $i++){
			
			//Create temporary possible word variable, fill it with the word being tested
			$possibleWord = substr($word, 0, $i);
			
			// This SQL statement selects ALL from the table 'all_words'
			$sql = "SELECT id FROM all_words WHERE word = \"$possibleWord\" ";

			//Query the database
			$result = mysqli_query($dbc, $sql);			
			
			
			//If there is a word inside the word
			if(mysqli_num_rows($result) > 0) {
				array_push($toRemove, $word);
			} 
			
			
			
		}
	}
	
	//Run delete query
	foreach($toRemove as $word){
		
		// This SQL statement selects ALL from the table 'all_words'
		$sql = "DELETE FROM `all_words` WHERE word = \"$word\" ";
		
		//Query the database
		$result = mysqli_query($dbc, $sql);
	}
}

//Finally, encode the array to JSON and output the results
echo json_encode($resultArray);

?>

