import { startEventListeners } from '../eventListeners.mjs';
import socket from '../game.mjs';
import { setWpmInterval } from '../state/intervals.mjs';
import { currentLetterIdx, setTimeUsed, setWpm } from '../state/state.mjs';

function startGame() {
	startEventListeners();

	const wpmDiv = document.getElementById('wpm');
	let seconds = 0;
	let interval = setInterval(() => {
		seconds++;
		if (
			(seconds === 1 || seconds % 10 === 0) &&
			seconds % 30 !== 0 &&
			seconds !== 0
		) {
			socket.emit('RANDOM_DATA');
		}
		if (seconds % 30 === 0) {
			socket.emit('REPORT_STATUS');
		}
		let wpmValue = Math.round(((currentLetterIdx / seconds) * 60) / 5);
		setWpm(wpmValue);
		wpmDiv.innerText = `${wpmValue}`;
		setTimeUsed(seconds);
	}, 1000);
	setWpmInterval(interval);
}

export default startGame;
