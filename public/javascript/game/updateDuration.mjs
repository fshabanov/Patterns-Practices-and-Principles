import { removeEventListeners } from '../eventListeners.mjs';
import socket from '../game.mjs';
import { secondsEl } from '../state/dom.mjs';
import { endGameInterval, setEndGameInterval } from '../state/intervals.mjs';
import { wpm, timeUsed } from '../state/state.mjs';

function timeLeft(duration) {
	secondsEl.innerText = duration;
	let interval = setInterval(() => {
		duration--;
		secondsEl.innerText = duration;
		if (duration === 0) {
			clearInterval(endGameInterval);
			removeEventListeners();
			socket.emit('CHANGE_PROGRESS', {
				wpm,
				timeUsed,
			});
			socket.emit('END_GAME');
		}
	}, 1000);
	setEndGameInterval(interval);
}

export default timeLeft;
