import { startEventListeners } from "../eventListeners.mjs";
import { setWpmInterval } from "../state/intervals.mjs";
import { currentLetterIdx, setWpm } from "../state/state.mjs";

function startGame() {
	startEventListeners();

	const wpmDiv = document.getElementById("wpm");
	let seconds = 0;
	let interval = setInterval(() => {
		seconds++;
		let wpmValue = Math.round(((currentLetterIdx / seconds) * 60) / 5);
		setWpm(wpmValue);
		wpmDiv.innerText = `${wpmValue}`;
	}, 1000);
	setWpmInterval(interval);
}

export default startGame;
