import { setIsReady } from '../changeRoom.mjs';
import { removeEventListeners } from '../eventListeners.mjs';
import {
	buttonEl,
	gameTimerEl,
	readyButtonEl,
	textContainerEl,
} from '../state/dom.mjs';
import { endGameInterval, wpmInterval } from '../state/intervals.mjs';
import { setProgress } from '../views/user.mjs';

function endGame(userOrder) {
	removeEventListeners();
	clearInterval(wpmInterval);
	clearInterval(endGameInterval);
	textContainerEl.classList.add('display-none');
	gameTimerEl.classList.add('display-none');

	setIsReady(false);

	buttonEl.classList.remove('display-none');

	readyButtonEl.classList.remove('display-none');
	readyButtonEl.innerText = 'READY';

	userOrder.forEach(({ username }) => {
		setProgress({ username, progress: 0 });
	});
}

export default endGame;
