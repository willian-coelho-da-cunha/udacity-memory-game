document.getElementById('start-game').classList.remove(['modal--closed']);
document.getElementById('start-game').classList.add(['modal--opennig']);

/**
* @description
* This function is called in the first time after the page is loaded, when the user clicks on 
* start game button on a modal.
*/

function startGame() {

	/**
	 * @description
	 * Close 'start-game' modal.
	*/
	let timeOut = null;

	document.getElementsByClassName('modal__content__action__button--start-the-game')[0].setAttribute('disabled', 'true');
	document.getElementById('start-game').classList.replace('modal--opennig', 'modal--closing');
	timeOut = setTimeout(() => {
		clearTimeout(timeOut);
		document.getElementById('start-game').classList.replace('modal--closing', 'modal--closed');
		document.getElementsByClassName('modal__content__action__button--start-the-game')[0].removeAttribute('disabled');
	}, 1000);

	/*------DISTRIBUTING CARDS------*/
	card.rearrangeCards();

	/*------INITIALIZING THE TIMER------*/
	timer.timeOn();

	addEventListener();
}

function addEventListener() {
	const gameCards = document.querySelectorAll('.game__card');

	for (let i = 0; i < gameCards.length; i++) {
		gameCards[i].addEventListener('click', turnCard);
	}
}

function removeEventListener() {
	const gameCards = document.querySelectorAll('.game__card');

	for (let i = 0; i < gameCards.length; i++) {
		gameCards[i].removeEventListener('click', turnCard);
	}
}

/**
* @description
* This function is responsable for implementing the rules of the game. Recognize the target of 
* an event, apply methods and rules and prevent some mistakes during the game. As soon as, 
* verify if the user wins the game.
* @param { event } event
* Characteristics of the event.
*/

function turnCard(event) {
	/*------GETTING THE CURRENT ID------*/
	let indice = event.target.id;

	/*------CHECK IF THE CARD YOU CLICKED ON IS THE SAME AS A MATCH ALREADY FOUND------*/
	for (let i = 0; i < card.matched.length; i++) {
		if (card.matched[i].idDoc === indice) {
			return;
		}
	}

	/*------CHECK IF SAME CARD RECEIVED THE SECOND CLICK------*/
	if (card.clickedCards.length === 1) {
		if (card.clickedCards[0].idDoc === indice) {
			return;
		}
	}

	/*------INCREASE NUMBER OF CLICKS------*/
	game.click++;

	/*------PREVENTS THE USER'S THIRD CLICK WHILE A setTimeout FUNCTION DOES NOT END------*/
	if (game.click > 2) {
		return;
	}

	/*------INCREASE THE MOVE COUNTER------*/
	moveCounter.increaseCounter();

	/*------ADD STYLE CLASS------*/
	this.classList.add('game__card--clicked');

	for (let i = 0; i <= 27; i++) {
		if (indice === `rr${String(i)}`) {

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

	if (card.clickedCards.length === 2) {

		/*------CLICKED CARDS MATCH?------*/
		if (card.clickedCards[0].idCard === card.clickedCards[1].idCard) {

			/*------KEEP THE CARDS------*/
			card.matched.push(card.clickedCards[0]);
			card.matched.push(card.clickedCards[1]);

			/*------STYLE CARD------*/
			document.querySelector(`#${String(card.clickedCards[0].idDoc)}`).classList.add('game__card--matched');
			document.querySelector(`#${String(card.clickedCards[1].idDoc)}`).classList.add('game__card--matched');
			document.querySelector(`#${String(card.clickedCards[0].idDoc)}`).classList.remove('game__card--clicked');
			document.querySelector(`#${String(card.clickedCards[1].idDoc)}`).classList.remove('game__card--clicked');

			/*------CLEAR THE CLICKED CARDS ARRAY------*/
			card.clickedCards = [];

			/*------RESET NUMBER OF CLICKS------*/
			game.click = 0;

			/*------VERIFY IF ALL MATCHS WERE FOUND------*/
			if (card.matched.length === 28) {
				removeEventListener();
				game.gameOver();
			}
		} else {
			let show;

			/*------DISABLE RESTART BUTTON------*/
			document.querySelector('.restart-the-game__button').disabled = true;

			/*------SHOW CLICKED CARDS WITH SOME TIME AS DELAY------*/
			show = setTimeout(delayDisplayCard, 1000);
		}
	}
}

/**
* @description This function is called when the user doesn't get match two cards. This function is responsable for 
* preparing the game arena for a new attempt.
*/

function delayDisplayCard() {

	/*------RESTART STYLE CARD------*/
	document.querySelector(`#${String(card.clickedCards[0].idDoc)}`).textContent = '🍀';
	document.querySelector(`#${String(card.clickedCards[1].idDoc)}`).textContent = '🍀';
	document.querySelector(`#${String(card.clickedCards[0].idDoc)}`).classList.remove('game__card--clicked');
	document.querySelector(`#${String(card.clickedCards[1].idDoc)}`).classList.remove('game__card--clicked');

	/*------CLEAR THE CLICKED ARRAY------*/
	card.clickedCards = [];

	/*------RESET NUMBER OF CLICKS------*/
	game.click = 0;

	/*------END OF TIME OUT------*/
	clearTimeout(this.show);

	/*------ENABLE RESTART BUTTON------*/
	document.querySelector('.restart-the-game__button').disabled = false;
}

/**
* @description This function is responsable for restarting the game when the game ends and the user wants to play again 
*	and all the times that the user click on the restart game button. This function calls some methods to restart the game 
* and prepared the game arena. As well as, the game controllers.
*/

function restartGame() {

	removeEventListener();

	/*------CHANGE THE GAME PROPERTIES------*/
	game.click = 0;

	/*------INITIALIZING THE TIMER------*/
	timer.timeOff();

	/*------IF THE USER CLICK ON THE BUTTON WITH OUT MATCH NO CARDS------*/
	let cardMatrix = [];
	cardMatrix = document.querySelectorAll('.game__card--matched');

	if (!(cardMatrix === null)) {
		if (cardMatrix.length === 28) {

			/*------ADD ONE TO QUANTITY OF REPLAYS OF THE GAME------*/
			game.play++;
		}

		/*------REMOVE CARD-MATCH CLASS------*/
		for (let i = 0; i < cardMatrix.length; i++) {
			cardMatrix[i].textContent = '.. ? ..';
			cardMatrix[i].classList.remove('game__card--matched');
		}
	}

	/*------FIX A BUG: CLICK ON ONE CARD AND PRESS RESTART GAME BUTTON------*/
	let cardClicked;
	cardClicked = document.querySelector('.game__card--clicked');

	if (!((cardClicked === undefined) || (cardClicked === null))) {
		cardClicked.textContent = '.. ? ..';
		cardClicked.classList.remove('game__card--clicked');
	}

	/*------RESET THE CARD PROPERTIES------*/
	card.matched = [];
	card.clickedCards = [];

	/*------RESTART TIMER------*/
	timer.restartTimer();

	/*------STAR RATING AND MOVE COUNTER------*/
	starRating.restartStartRating();
	moveCounter.restartCounter();

	/*------CALL THE FUNCTION TO START THE GAME------*/
	startGame();
}

function restartGameFromGameOverModal() {
	closeGameOverModal();
	restartGame();
}

function closeGameOverModal() {
	let timeOut = null;

	document.getElementsByClassName('modal__content__action__button--close')[0].setAttribute('disabled', 'true');
	document.getElementsByClassName('modal__content__action__button--play-again')[0].setAttribute('disabled', 'true');
	document.getElementById('game-over').classList.replace('modal--opennig', 'modal--closing');
	timeOut = setTimeout(() => {
		clearTimeout(timeOut);
		document.getElementById('game-over').classList.replace('modal--closing', 'modal--closed');
		document.getElementsByClassName('modal__content__action__button--close')[0].removeAttribute('disabled');
		document.getElementsByClassName('modal__content__action__button--play-again')[0].removeAttribute('disabled');
	}, 1000);
}