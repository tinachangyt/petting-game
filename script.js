$(function(){
	$(".game-over__window").css("display", "none");
	$(".info-window").css("display", "none");
	$(".player-combo").css("display", "none");

	var choiceOnePath = "images/dog-small.png";
	var choiceTwoPath = "images/cat-small.png";
	var extraLifePath = "images/heart.png";
	var multiplierPath = "images/multiplier.png"
	var multiplier = 1;
	var userChoice = null;
	var playerScore = 0;
	var playerLives = 3;
	var lifeTime = 3000;
	var otherLifeTime = 2000;
	var difficulty = 1;
	var difficultyThreshold = 100;
	var comboMeter = 0;
	var comboMultiplier = 1;

	// determine which animal the user chooses
	// when the element is clicked, a "choice-selected" class is added to it to indicate that is has been selected. 
	// that class is styled so the user will know it is the current selection
	// if the other animal was previously chosen, it will be "unselected" by removing the "choice-selected" class
	$(".animal-choice__one").on("click touchstart", function() {
		userChoice = "choice--one";
		$(this).addClass("choice-selected");
		if ($(".animal-choice__two").hasClass("choice-selected")) {
			$(".animal-choice__two").removeClass("choice-selected");
		}
	});
	// same as the previous one
	$(".animal-choice__two").on("click touchstart", function() {
		userChoice = "choice--two";
		$(this).addClass("choice-selected");
		if ($(".animal-choice__one").hasClass("choice-selected")) {
			$(".animal-choice__one").removeClass("choice-selected");
		}
	});
	// once the start button is clicked, the game starts
	// the start window is hidden from the view
	// a time is randomly generated
	// after this amount of time has passed, the generate function (which controls the game) will start
	$(".start-button").on("click", function() {
		$(".info-window").css("display", "block");
		$(".footer").hide();
		$(".start-window").hide();
		// var time = ;
		setTimeout(function() {
			generateAnimals();
			generateLife();
			generateMultiplier();
		}, generateRandomTime());
	});
	// this is the generate function which controls the game
	// it calls the generate animals function which generates the pictures of the animals
	// it also generates a random time
	// after the random amount of time has passed, this function will call itself to keep the game going -- self-propagation (recursive)
	function generateAnimals() {
		if (playerLives <= 0) {
			return;
		}// ^if playerLives less or equals to 0, stop the function generateAnimals.
		if (userChoice == "choice--one") {
			var generateUserChoice = generateChoiceOne;
			var generateNonChoice = generateChoiceTwo;
		}
		else {
			var generateUserChoice = generateChoiceTwo;
			var generateNonChoice = generateChoiceOne;
		}
		for (var i = 0; i < difficulty; i = i + 1) {
			generateNonChoice();
		}
		generateUserChoice();
		setTimeout(function() { 
			generateAnimals();
		}, generateRandomTime(250, 750));
	}



	// this random time generating function controls the interval in which the animals are generated
	// 0.75s is the lower limit and 2.75 seconds is the upper limit
	
	// function generateRandomTime() {
	// 	return 200+(Math.floor(Math.random()*750));
	// }

	// function generateRandomTimeLife() {
	// 	return 30000+(Math.floor(Math.random()*30000));
	// }

	function generateRandomTime(minTime, additionalTime) {
		return minTime + (Math.floor(Math.random() * additionalTime));
	}



	// generate an id for each animal img which is placed onto the page
	// this way the removeAnimal function will know which animal img to delete (looks for the ID)
	function generateAnimalID() {
		return Math.floor(Math.random() * 100000);
	}
	// this function just generates one of each animal
	// well make it more complex after 

	// this function just generates a position for each animal image
	// it will generate an value between 0-100 for the x and y coordinate
	function generatePosition() {
		var xVal = Math.floor(Math.random() * 100);
		var yVal = Math.floor(Math.random() * 100);
		var position = {
			x: xVal,
			y: yVal
		};
		return position;
	}
	// this will generate one animal
	// it will first call the generate position function to get an x and y coordinate
	// it checks that the coordinates are within the set boundaries (90% of the screen)
	// if the coordinates are not, it will generate another position (keep going until the coordinates are correct); works with a while loop
	// next it will add the img to the html with the append function
	function generateChoiceOne() {
		while (true) {
			var position = generatePosition();
			if (position.x >= 10 && position.x <= 90 && position.y >= 10 && position.y <= 90) {
				break; //the break is for breaking the while loop when the proper position has been returned from the generatePosition function. When the while loop breaks, the image will show on screen.
			}
		}
		var temporaryID = generateAnimalID();
		$(".wrapper").append(`<img src="${choiceOnePath}" style="left: ${position.x}%; top: ${position.y}%" class="animal-image choice--one" id="${temporaryID}">`);
		setTimeout(function() {
			$("#" + temporaryID).remove();
		}, lifeTime);
	}
	// same as the previous one but for the other animals
	function generateChoiceTwo() {
		while (true) {
			var position = generatePosition();
			if (position.x >= 10 && position.x <= 90 && position.y >= 10 && position.y <= 90) {
				break;
			}
		}
		var temporaryID = generateAnimalID();
		$(".wrapper").append(`<img src="${choiceTwoPath}" style="left: ${position.x}%; top: ${position.y}%" class="animal-image choice--two" id="${temporaryID}">`);
		setTimeout(function() {
			$("#" + temporaryID).remove();
		}, lifeTime);
	}


	// on click event which checks if the animal images have been clicked
	// once clicked, the image will be removed
	// if the image matches the player choice, the player gains points
	// if the image does not match the player choice, the player will lose a life
	$(".wrapper").on("click", ".animal-image", function() {

		$(".player-combo__value").html(comboMeter);
		if (playerScore > difficultyThreshold) {
			difficulty = difficulty + 1;
			difficultyThreshold = difficultyThreshold * 2;
		}
		if ($(this).hasClass(userChoice)) {
			playerScore = playerScore + (5 * multiplier * comboMultiplier);
			comboMeter = comboMeter + 1;
			switch (comboMeter) {
				case 20:
					comboMultiplier = 2;
					$(".player-combo").css("display", "block");
					break;
				case 50:
					comboMultiplier = 3;
					break;
				case 100:
					comboMultiplier = 4;
					break;
				case 150:
					comboMultiplier = 5;
					break;
			}
		}
		else {
			playerLives = playerLives - 1;
			comboMeter = 0;
			$(".player-combo").css("display", "none");
		}
		if (playerLives <= 0) {
			$(".animal-image").remove();
			$(".extra-life").remove();
			$(".game-over__window").css("display", "block");
		}
		$(".player-score").html(playerScore);
		$(".player-lives").html(playerLives);
		this.remove();
	});




	$(".wrapper").on("click", ".extra-life", function() {
		playerLives = playerLives + 1;
		$(".player-lives").html(playerLives);
		$(".extra-life").remove();
	});

	$(".wrapper").on("click", ".multiplier", function() {
		multiplier = 2;
		setTimeout(function() {
			multiplier = 1;
		}, 10000);
		$(".multiplier").remove();
	});


	function generateLife() {
		setTimeout(function() { 
			while (true) {
				var position = generatePosition();
				if (position.x >= 10 && position.x <= 90 && position.y >= 10 && position.y <= 90) {
					break;
				}
			}
			if (playerLives <= 0) {
				return;
			}
			$(".wrapper").append(`<img src="${extraLifePath}" style="left: ${position.x}%; top: ${position.y}%" class="extra-life">`);
			setTimeout(function() {
				$(".extra-life").remove();
			}, otherLifeTime);
			generateLife();
		}, generateRandomTime(30000, 30000));
	}

	function generateMultiplier() {
		setTimeout(function() { 
			while (true) {
				var position = generatePosition();
				if (position.x >= 10 && position.x <= 90 && position.y >= 10 && position.y <= 90) {
					break;
				}
			}
			if (playerLives <= 0) {
				return;
			}
			$(".wrapper").append(`<img src="${multiplierPath}" style="left: ${position.x}%; top: ${position.y}%" class="multiplier">`);
			setTimeout(function() {
				$(".multiplier").remove();
			}, otherLifeTime);
			generateMultiplier();
		}, generateRandomTime(30000, 30000));
	}
});