$(function(){

	var choiceOnePath = "images/dog-small.png";
	var choiceTwoPath = "images/cat-small.png";
	var extraLifePath = "images/heart.png";
	var userChoice = null;
	var playerScore = 0;
	var playerLives = 3;
	var lifeTime = 3000;



	// if user selects dog, change class name of choice--one to userChoice in the generateChoiceOne() function.
	function userSelection() {
		$(".animal-choice__one").on("click touchstart", function() {
			userChoice = "choice--one";

			$(".animal-choice__two").removeClass("choice-selected");
			$(this).addClass("choice-selected");
		});

		// if user selects cat, change class name of choice--two to userChoice in the generateChoiceTwo() function.
		$(".animal-choice__two").on("click touchstart", function() {
			userChoice = "choice--two";

			$(".animal-choice__one").removeClass("choice-selected");
			$(this).addClass("choice-selected");
		});
	};



	function startGame() {
		$(".start-btn").on("click", function() {
			$(".record-window, .volume-btn").css("display", "block");
			$(".start-window, footer").hide();

			generateAnimals();
			generateLife();
		});
	};



	function generateAnimals() {
		if (playerLives > 0) {
			generateChoiceOne();
			generateChoiceTwo();

			setTimeout(function() { 
				generateAnimals();
			}, generateRandomTime(200, 350));

		} else if (playerLives <= 0) {
			$(".animal-image, .extra-life").remove();
			$(".game-over__window").css("display", "block");
		};
	};



	function generateRandomTime(minTime, additionalTime) {
		return minTime + (Math.floor(Math.random() * additionalTime));
	};



	// generate an id for each animal img which is placed onto the page
	// this way the generateChoiceOne() and generateChoiceTwo() function will know which animal img to append or delete (looks for the ID)
	function generateAnimalID() {
		return Math.floor(Math.random() * 100000);
	};



	// this function generates a position for each animal image
	// it will create a value between 0-100 for the x and y coordinate
	function generatePosition() {
		var xVal = Math.floor(Math.random() * 100);
		var yVal = Math.floor(Math.random() * 100);
		var position = {
			x: xVal,
			y: yVal
		};
		return position;
	};



	function generateChoiceOne() {
		var position = generatePosition();
		var temporaryID = generateAnimalID();

		if (position.x >= 10 && position.x <= 90 && position.y >= 10 && position.y <= 90) {

			$(".wrapper").append(`<img src="${choiceOnePath}" style="left: ${position.x}%; top: ${position.y}%" class="animal-image choice--one" id="${temporaryID}">`);

			setTimeout(function() {
				$("#" + temporaryID).remove();
			}, lifeTime);
		};
	};



	function generateChoiceTwo() {
		var position = generatePosition();
		var temporaryID = generateAnimalID();

		if (position.x >= 10 && position.x <= 90 && position.y >= 10 && position.y <= 90) {

			$(".wrapper").append(`<img src="${choiceTwoPath}" style="left: ${position.x}%; top: ${position.y}%" class="animal-image choice--two" id="${temporaryID}">`);

			setTimeout(function() {
				$("#" + temporaryID).remove();
			}, lifeTime);
		};
	};



	function generateLife() {
		var position = generatePosition();

		if (playerLives > 0) {
			if (position.x >= 10 && position.x <= 90 && position.y >= 10 && position.y <= 90) {

				$(".wrapper").append(`<img src="${extraLifePath}" style="left: ${position.x}%; top: ${position.y}%" class="extra-life">`);

				setTimeout(function() {
					$(".extra-life").remove();
				}, 2000);
			}

			setTimeout(function() {
				generateLife();
			}, generateRandomTime(30000, 3000));
		};
	};



	// if the image matches the player's choice, the player gains points
	// if the image does not match the player choice, the player will lose a life
	// remove animal image on click
	function updateRecords() {
		$(".wrapper").on("click", ".animal-image", function() {
			if ($(this).hasClass(userChoice)) {
				playerScore = playerScore + 5;
			}
			else {
				playerLives = playerLives - 1;
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
	};



	// play audio when clicking on the animal image
	function playAudio() {
		$(".wrapper").on("click", ".choice--one", function() {
			$("#woof").get(0).currentTime = 0;
			$("#woof").get(0).play();
			// $("#woof")[0].play();
		});

		$(".wrapper").on("click", ".choice--two", function() {
			$("#meow").get(0).currentTime = 0;
			$("#meow").get(0).play();
		});
	};



	function muteAudio() {
		$(".volume-btn").on("click", function() {
			$(".fa-volume-up, .fa-volume-off").toggleClass("fa-volume-off fa-volume-up");

			if ($(".volume-btn > .fa").hasClass("fa-volume-off")) {
				$("audio").remove();
			} else {
				$(".audio").append(`
					<audio id="woof" src="sounds/woof.mp3"></audio>
					<audio id="meow" src="sounds/meow.mp3"></audio>
				`);
			};
		});
	};



	userSelection();
	startGame();
	updateRecords();
	playAudio();
	muteAudio();
});