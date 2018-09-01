$("#question").modal();

function startGame(){
	/*------CHANGE THE GAME PROPERTIES------*/
	game.gameOn = true;
	game.gameOff = false;
	game.click = 0;

	/*------IF RESTART THE GAME: REMOVE CARD-MATCH CLASS------*/
	let verifyClass = document.querySelector(".card-match");
	if (!(verifyClass === null)) {
		/*------ADD ONE TO QUANTITY OF REPLAYS OF THE GAME------*/
		game.play++;

		/*------REMOVE CARD-MATCH CLASS------*/
		let cardMatrix = [];
		cardMatrix = document.querySelectorAll(".card");
		for (let i = 0; i < cardMatrix.length; i++) {
			cardMatrix[i].textContent = "Willian";
			cardMatrix[i].classList.remove("card-match");
		}
	}

	/*------RESET THE CARD PROPERTIES------*/
	card.matchedCards = 0;
	card.matched = [];
	card.clickedCards = [];

	/*------DISTRIBUTING CARDS------*/
	card.rearrangeCards();

	/*------INITIALIZING THE TIMER------*/
	timer.restartTimer();
	timer.timeOn();

	/*------STAR RATING AND MOVE COUNTER------*/
	starRating.restartStartRating();
	moveCounter.restartCounter();

	/*------GETTING THE CONTAINER------*/
	let container = document.querySelector("#game-arena");
	
	$(container).on('click', 'DIV', turnCard);
}

function turnCard(event){
	/*------GETTING THE CURRENT ID------*/
	let indice = event.target.id;

	/*------INCREASE THE MOVE COUNTER------*/
	moveCounter.increaseCounter();

	/*------ADD STYLE CLASS------*/
	this.classList.add("card-clicked");

	for (let i = 0; i <= 27; i++) {
		if (indice === "rr"+i){
			/*------DISPLAY THE CARD------*/
			this.textContent = card.rearrangedCards[i].card;
			/*------kEEP THE CARD------*/
			let objCard = {
				idDoc: indice,
				card: card.rearrangedCards[i].card,
				idCard: card.rearrangedCards[i].id
			};
			card.clickedCards.push(objCard);
		}
	}
	if (card.clickedCards.length === 2){
				/*------CLICKED CARDS MATCH?------*/
		if (card.clickedCards[0].idCard === card.clickedCards[1].idCard) {

			/*------ADD ONE TO MATCHED CARDS------*/
			card.matchedCards++;

			/*------KEEP THE CARDS------*/
			card.matched.push(card.clickedCards[0]);
			card.matched.push(card.clickedCards[1]);

			/*------STYLE CARD------*/
			document.querySelector("#" + card.clickedCards[0].idDoc).classList.add("card-match");
			document.querySelector("#" + card.clickedCards[1].idDoc).classList.add("card-match");
			document.querySelector("#" + card.clickedCards[0].idDoc).classList.remove("card-clicked");
			document.querySelector("#" + card.clickedCards[1].idDoc).classList.remove("card-clicked");

			/*------CLEAR THE CLICKED CARDS ARRAY------*/
			card.clickedCards = [];

			/*------VERIFY IF ALL MATCHS WERE FOUND------*/
			if (card.matchedCards === 14) {
				game.gameOver();
			}
		}
	}
}

function delayDisplayCard(){}