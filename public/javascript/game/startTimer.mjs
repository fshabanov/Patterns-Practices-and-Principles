import updateTextHighlight from "../helpers/updateTextHighlight.mjs";
import startGame from "./startGame.mjs";
import {
	buttonEl,
	gameTimerEl,
	readyButtonEl,
	textContainerEl,
} from "../state/dom.mjs";
import {
	setAccuracy,
	setCurrentLetterIdx,
	setMistakes,
	setRandomText,
	setWpm,
} from "../state/state.mjs";
import timeLeft from "./updateDuration.mjs";

function startGameTimer(timer, duration, textIdx) {
	setCurrentLetterIdx(0);
	setAccuracy(0);
	setWpm(0);
	setMistakes(0);

	buttonEl.classList.add("display-none");

	readyButtonEl.classList.add("display-none");

	const timerElement = document.getElementById("timer");
	timerElement.classList.remove("display-none");
	timerElement.innerText = timer;

	const timerInterval = setInterval(() => {
		timer--;
		timerElement.innerText = timer;
		if (timer === 0) {
			clearInterval(timerInterval);
			timerElement.classList.add("display-none");
			textContainerEl.classList.remove("display-none");
			textContainerEl.innerHTML = updateTextHighlight();
			gameTimerEl.classList.remove("display-none");
			timeLeft(duration);
			startGame();
		}
	}, 1000);

	fetch(`/game/texts/${textIdx}`)
		.then((res) => res.json())
		.then(({ text }) => setRandomText(text));
}

export default startGameTimer;
