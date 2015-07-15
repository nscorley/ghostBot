//Perform when the document has loaded
$(document).ready(function() {
	
	//Hide the container to start
	$("#secondPage").hide();
	
	//Hide the json
	$("#json_holder").hide();
		
	//Holds whether the computer or player is moving first
	var moveFirst = "";	
	
	//Variable to hold all of the words populated from the dictionary file
	var allWords = [];
	
	//Array of all letters
	var allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l' , 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	
	//Initialize the position variable
	var p;
	
	//Immedietly begin loading the dictionary data
	$.ajax({
		type: 'POST',
		url: 'service.php',
		data: 'id=dictionary_data',
		dataType: 'json',
		cache: false,
		success: function(result) {
		
			//Set the data to the allWords variable
			$.each(result, function(key, value){
	
				allWords[key] = value;
				
			});
		},
	});
	
	//If the player wants the computer to go first...
	$("#computerFirst").click(function(){
		
		//Hide the move first options and show the other screen
		$("#firstPage").remove();
		$("#secondPage").show();
		
		//Set the move first variable
		moveFirst = "computer";
		
		//Initialize the game if the data is loaded
		if(allWords.length > 0){
			initializeGame();
		}
		
	});
	
	//If the player wants the user to go first...
	$("#playerFirst").click(function(){
		
		//Hide the move first options and show the other screen
		$("#firstPage").remove();
		$("#secondPage").show();
		
		//Set the move first variable
		moveFirst = "player";
		
		//Initialize the game if the data is loaded
		if(allWords.length > 0){
			initializeGame();
		}
	});
	
	//Function that creates game variables
	function initializeGame(){
		
		//Create the position
		p = new Position();
		
		//Remove the loading text
		$("#position").text("");
		
		//If the computer is moving first
		if(moveFirst == "computer"){
		
			//Get random number 0-25
			var randomNumber = Math.floor(Math.random() * 25);
			
			//Selects random letter based on number
			var letter = p.allLetters[randomNumber];
			
			//Add letter to position
			p.position += letter;
		
			//Update screen
			$("#position").text(p.position);
		}
		
		
	}
	
		
	//Function when the analyze button is pressed
	$("#analyze").click(function(){
		
		//If the game is over, refresh the page on click
		if( $("#analyze").html() == "Yes" ){
			location.reload();
		}else{
			textEntered();
		}
		
	});	
	
	//Function when enter is pressed
	$('#letterEntry').keyup(function(event){
	    if(event.keyCode==13){
		    
    		//If the game is over, refresh the page on click
    		if( $("#analyze").html() == "Yes" ){
    			location.reload();
    		}else{
    			textEntered();
    		}
		
	    }
	});
	
	//Runs when a click or press is detected
	function textEntered(){
		
		//Reset the message text
		$("#message").text("");
		
		//Get the letter entered in the text box
		var letter = $("#letterEntry").val();
		
		//Reset the field
		$('#letterEntry').val("");
		
		//Ensure they entered only one letter
		if(letter.length > 1){

			//Alert the user
			$("#message").text("String entered is too long. Please enter only a single letter, scrub");

			//Stop the function
			return 0;
			
		}else if(letter.length < 1){
			
			//Alert the user
			$("#message").text("Please enter a letter, scrub");

			//Stop the function
			return 0;
			
		}
		
		//Add letter to position
		p.position += letter;
		
		//Update screen
		$("#position").text(p.position);
		
		//Make sure the game is not over
		if(p.isGameOver()){
			
			gameOver("player");
		}else{
			
			//Find the best computer move
			p.alphaBetaMinimax(-Number.MAX_VALUE, Number.MAX_VALUE, 0, 1);
		
			//Return the move
			var bestMove = p.returnBestMove();
		
			//Add letter to position
			p.position += bestMove;
	
			//Update screen
			$("#position").text(p.position);
		
			//Make sure the game is not over
			if(p.isGameOver()){
			
				gameOver("computer");
				return 0;
			}
		}
	}
		
	//Function that displays text when the game is over
	function gameOver(loser){
		
		$("#letterEntry").attr("placeholder", "Play again?");
		
		$("#analyze").html("Yes");
		
		//Check if the position forms a word
		if($.inArray(p.position, allWords) > -1){
			
			//Update if the player lost...
			if(loser == "player"){
			
				var message = "You lost because you formed the word: <a target = \"_blank\" href = \"http://dictionary.reference.com/search?q=" + p.position + "\"><span class = 'text-warning'>" + p.position + "</span></a>";
				$("#message").html(message);
			
			}
			
		}else if(loser == "player"){ //Otherwise, check if the player ended it with an impossible word
			
			//Alert the user
			var message = "The computer challenges the word " + p.position + ", and obviously wins.";
			
			//Create variable of potential words
			var potentialWords = [];
			
			
			//Define previous position variable
			var prevPosition = p.position.slice(0,-1);
			
			//Check if it is the first move or not to prevent errors
			if(prevPosition.length < 2){
			
				//Find start and stop indexes for single letters
				start = p.letterKeys[prevPosition.substring(0,1)].start;
				stop = p.letterKeys[prevPosition.substring(0,1)].end;
			}else{
			
				//Find start and stop index for position in the allWords array for combos
				var start = p.wordKeys[prevPosition.substring(0,2)].start;
				var stop = p.wordKeys[prevPosition.substring(0,2)].end;
			
			}
			
			//Create counter variable
			var counter = 0;
			
			//Find a list of words that the player could have used
			//Loop through all words in the allWords array
			for(i = start; i < stop; i++){
			
				//Define variable for readability
				var value = allWords[i];
				
				//If the beginning of the word matches the position so far, add it to the possible words array
				if(value.length > prevPosition.length){
					if(value.substring(0, prevPosition.length) == prevPosition){
						
						//Push the first five words
						if(counter < 5){
							potentialWords.push(value);							
						}
						
						//Increment the counter
						counter++;
					}
				}
			}
			
			//Create text for other words
			var info = "Consider: ";
			
			//Loop through the first five potential words
			for(var i = 0; i < potentialWords.length; i++){
				info += " <a target = \"_blank\" href = \"http://dictionary.reference.com/search?q=" + potentialWords[i] + "\"><span class = 'text-warning'>" + potentialWords[i] + "</span></a> ";;
			}
			
			//Display the messages 
			$("#message").html(message);
			$("#potential_words").html(info);
			
		}
		
		//Give the function an end
		return 0;
		
		
	}
	
	//Beginning of OOP Javascript for Alpha Beta MiniMax Algorithm, proceed with caution and a syntax reference, this is no kid shit anymore. Syntax gets really weird. Prototype's are a bitch
	
	//Define a class that holds a letter and a score
	//Constructer takes a letter and the score for that letter as its arguments
	function LettersAndScores(letter, score){
		this.letter = letter;
		this.score = score;
	}
	
	//Class that defines a position (i.e. "s" or "appl")
	//Includes alphaBetaMinimax method, as well as all game attributes
	//Takes no arguments to construct
	function Position(){
		
		//String variable that will hold the letters in the game
		this.position = '';
		
		//Array to hold scores of potential options from roots
		//Holds data type of lettersAndScores
		this.rootsChildrenScore = [];
		
		//Initiate depth variable
		this.upToDepth = -1;
		
		//Get all of the words
		this.allWords = allWords;
		
		//Array of all letters
		this.allLetters = allLetters;

		//Get array of markers for all the words to be used to optimize algorithms later on
		this.wordKeys = getWordKeys(this.allWords, this.allLetters, 2);
		
		//Get array of markers for just the letters instead of combinations
		this.letterKeys = getWordKeys(this.allWords, this.allLetters, 1);
			
	} //Closing the Position class
	
	//Function that evaluates the state of the word at the time of the function call for the game
	Position.prototype.evaluatePosition = function(turn){ //Turn has value of 1 or 2; 1 = player, 2 = opponent
		
		//Initiate variables for winning and losing potential words
		var winWords = 0;
		var loseWords = 0;
		
		//Create variable to hold score of the position to be returned
		var score = 0;
		
		//Set the position variable to a more easily accessible one
		var localPosition = this.position;
		
		//Check if it is the first move or not to prevent errors
		if(localPosition.length < 2){
			
			//Find start and stop indexes for single letters
			start = this.letterKeys[localPosition.substring(0,1)].start;
			stop = this.letterKeys[localPosition.substring(0,1)].end;
		}else{
			
			//Find start and stop index for position in the allWords array for combos
			var start = this.wordKeys[localPosition.substring(0,2)].start;
			var stop = this.wordKeys[localPosition.substring(0,2)].end;
			
		}
		
		//Loop through all words in the allWords array
		for(i = start; i < stop; i++){
			
			//Define variable for readability
			var value = allWords[i];
			
			//If the full word is formed
			if(value == localPosition){
				
				//If it is on the player's turn, make it as unfavorable as possible; do the same on the opponent's turn
				if(turn == 1){
					score += 1000;
				}else{
					score -= 1000;
				}
			}
			
			//If the beginning of the word matches the position so far, check if it is a win word or lose word
			if(value.length > localPosition.length){
				if(value.substring(0, localPosition.length) == localPosition){
				
					//Check whether the string would result in a win or loss by finding the number of letters needed to complete the word
					if( (value.length -  localPosition.length) % 2 == 0){
						winWords++;
					}else{
						loseWords++;
					}
				}
			}
		}
		
		//Return a score based on potential words for player and opponent
		//NOTE: Not very nuanced or intelligent system. See Endnote 2
		if(turn == 1){
			score += winWords - loseWords;
		
			//If no words can be formed, and it is the players turn, make it favorable for the maximizer
			if(winWords + loseWords < 1){
				score += 1100;
			}
		}else{
			score += loseWords - winWords;
			
			//If no words can be formed, and it is the computers turn, make it favorable for the minimizer
			if(winWords + loseWords < 1){
				score -= 1100;
			}
		}
		
		//Return the score
		return score;
		
	}
	
	//Recursive function that takes four distinct arguments
	//Returns an integer result, after creating a maximizer and minimizer tree
	Position.prototype.alphaBetaMinimax = function(alpha, beta, depth, turn){
		
		//Get the position value
		var localPosition = this.position;
		
		//Define default values for maxValue and minValue as the worst possible cases
		var maxValue = -Number.MAX_VALUE;
		var minValue = Number.MAX_VALUE;
		
		//Check if pruning is possible, and if possible return least favorable possible number to ensure branch is ignored
		if(beta <= alpha){
			console.log("Pruning at depth: " + depth + " Alpha: " + alpha + " Beta: " + beta);
			if(turn == 1){
				return Number.MAX_VALUE;
			}else{
				return -Number.MAX_VALUE;
			}
		}
		
		//If the game is over, or the depth has reached the maximum allowed, return the evaluation of the board
		if(depth == this.upToDepth || this.isGameOver()){
			return this.evaluatePosition(turn);
		}
	
		//If the depth is zero, remove all options in the paths to the root
		if(depth == 0){
			this.rootsChildrenScore = [];
		}
		
		//Cache this to self to avoid issues with anonymous function call
		var self = this;
		
		//Cycle through all possible letters
		$.each(this.allLetters, function(key, value){
			
			//Create variable to hold current value of branch
			var currentScore = 0;
			
			//If it is the player's turn
			if(turn == 1){
				
				//Append a letter to the end of the position string
				self.position += value;
				
				//Perform minimax function on the resulting value to try and get to a result
				currentScore = self.alphaBetaMinimax(alpha, beta, depth + 1, 2);
				
				//Set the maxValue variable to the currentScore if it is larger than the preexisting value
				maxValue = Math.max(currentScore, maxValue);
				
				//Set the alpha variable if the new path yields a better result
				alpha = Math.max(currentScore, alpha);
				
				//If it is at the top level, add the score to the rootsChildrenScore array
				if(depth == 0){
					self.rootsChildrenScore.push(new LettersAndScores(value, currentScore));
					
				}
			}else{
				//Append a letter to the end of the position string
				self.position += value;
				
				//Perform minimax function on the resulting value to try and get to a result
				currentScore = self.alphaBetaMinimax(alpha, beta, depth + 1, 1);
				
				//Set the maxValue variable to the currentScore if it is larger than the preexisting value
				minValue = Math.min(currentScore, minValue);
				
				//Set the beta variable if the new path yields a better result
				beta = Math.min(currentScore, beta);
			}
			
			//Reset the position
			self.position = self.position.slice(0,-1);
			
			//Break if a maximum or minimum value is found, since anything else found will not matter
			if(currentScore == Number.MAX_VALUE || Number == -Number.MAX_VALUE){
				return false;
			}
			
		}); //End of the $.each loop
		
		//If it is the player's turn, return maxValue; otherwise return minValue
		return turn == 1 ? maxValue : minValue;
	}
	
	//Method that checks if the game is over
	//Potentially unecessary, see Endnote 3
	Position.prototype.isGameOver = function(){
		
		//Variable that holds whether or not a word is possible
		var anyWord = false;
		
		//Set the position variable to something local
		var localPosition = this.position;
		
		//Check if it is the first move or not to prevent errors
		if(localPosition.length < 2){
			
			//Find start and stop indexes for single letters
			start = this.letterKeys[localPosition.substring(0,1)].start;
			stop = this.letterKeys[localPosition.substring(0,1)].end;
		}else{
			
			//Find start and stop index for position in the allWords array for combos
			var start = this.wordKeys[localPosition.substring(0,2)].start;
			var stop = this.wordKeys[localPosition.substring(0,2)].end;
			
		}
		
		//Loop through all potential words
		for(i = start; i < stop; i++){
			
			//Assign variable to word for readability
			value = allWords[i];
			
			//If the full word is formed
			if(value == localPosition && value.length > 3){
				return true;
			}
			
			//If the beginning of the word matches the position so far, then change 
			if(value.length >= localPosition.length){
				
				if(value.substring(0, localPosition.length) == localPosition){
					anyWord = true;
				}	
			}	
		}
		
		//If no word found with the letters in the position, return true
		if(!anyWord){
			return true;
		}
		
		//If nothing else, return false
		return false;
	}
	
	//Function that returns the optimal move for the computer
	Position.prototype.returnBestMove = function(){
		
		//Set initial values to be very unfavorable
		var max = -10000;
		var best = "";
		
		//Loop through all potential options
		$.each(this.rootsChildrenScore, function(key, value){
			
			//If the max is less favorable than the option, set a new max
			if(max < value.score){
				max = value.score;
				best = value.letter;
			}
		
		});
		
		return best;
	}
	
	//End of Position class methods
	
	//Function built to optimize searching through all of the words
	//NOTE: might want to build recursive ability to generate keys for any dynamically given num instead of just 1 and 2
	function getWordKeys(allWords, allLetters, num){
		
		//Array to hold letters and their corresponding keys
		//Keys will refer to the FIRST instance of the combination and the one after the last in its object 
		var lettersAndKeys = {};
		
		//Variable to hold which letter is being searched for
		var index = 0;
		
		//If the input requests keys for only the first letter
		if(num == 1){
			
			//Loop through all words
			$.each(allWords, function(key, value){
				
				//Check if the first letter of the value matches the letter designated by the index
				if(value.substring(0,1) == allLetters[index]){
					
					//Assign letter for readability
					var letter = allLetters[index];
				
					//Create the initial object
					lettersAndKeys[letter] = {};
				
					//Add starting key
					lettersAndKeys[letter].start = key;
				
					//Set the previous end to the start of the new letter
					if(index > 0){
						var prevLetter = allLetters[index-1];
						lettersAndKeys[prevLetter].end = key;
					}
				
					//Set the end for the lest index
					if(index == allLetters.length - 1){
						lettersAndKeys[letter].end = allWords.length;
					}
				
					//Increment the index
					index++;
				}
			});
			
			//Return array of only the first letter and their keys
			return lettersAndKeys;
		}
		
		
		var combinations = [];
		//Fill combinations with correct values
		$.each(allLetters, function(key, value){
			
			$.each(allLetters, function(key2, value2){
				var temp = value + value2
				combinations.push(temp);
			});
		});
		
		//Holds distance from real word
		var distanceReal = 0;
		
		//Loop through all words - contingent on the words being alphabetical
		$.each(allWords, function(key, value){
			
			//Check if the first letter of the value matches the letter designated by the index
			if(value.substring(0,2) == combinations[index]){
				
				//Initialize combo variable
				var combo = combinations[index];
				
				//Create the initial object
				lettersAndKeys[combo] = {};
				
				//Add starting key
				lettersAndKeys[combo].start = key;
				
				//Set the previous end to the start of the new letter
				if(index > 0){
					var prevCombo = combinations[index-1];
					lettersAndKeys[prevCombo].end = key;
				}
				
				//Set the end for the last index
				if(index == combinations.length - 1){
					lettersAndKeys[combo].end = allWords.length;
				}
				
				//Increment the index
				index++;
				
				//Reset the distanceReal
				distanceReal = 0;
			}else{
				
				//Check to make sure the combination hasn't been skipped - prevents crashing when program reaches something with no possible words like "bc"
				for(i = index + 1; i < combinations.length; i++){
				
					//Check if the first letter of the value matches the letter designated by the index
					if(value.substring(0,2) == combinations[i]){
						
						//Initialize combo variable
						var combo = combinations[index];
						
						//Create the initial object
						lettersAndKeys[combo] = {};
						
						//Add starting key
						lettersAndKeys[combo].start = key-distanceReal;
						
						//Set the previous end to the start of the new letter
						if(index > 0){
							var prevCombo = combinations[index-1];
							lettersAndKeys[prevCombo].end = key-distanceReal;
						}
						
						//Increment the index
						index++;
						
						//Increment the distance real
						distanceReal++;
					}
				}
			}
		});
	
		return lettersAndKeys;
	}
}); //Closing the when function that begins when the document loads

/* 
ENDNOTES
	1) If processing time becomes a concern (which it doubtless will), needs to be improved, especially when dealing with a large list of words. Proposed solution: since the array is sorted alphabetically, jump to a word that contains the beginning letters, then move up and down the array alphabetically finding the limits where the word is no longer formed. 
	
	2) To make the analysis system more sophisticated, use the ranking of the word. For instance, do: evenWords^(average rank) - oddWords^(average rank), if it is player's turn.

	3) This method may be unecessary; it could be replaced by further utilizing the evaluatePosition() method instead.

	4) Add support for two letter combinations, etc. to make the program more efficient
*/
