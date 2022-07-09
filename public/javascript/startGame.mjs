import { setIsReady } from "./changeRoom.mjs";
import socket from "./game.mjs";
import { showResultsModal } from "./views/modal.mjs";
import { setProgress } from "./views/user.mjs";

const button = document.getElementById("quit-room-btn");
const readyButton = document.getElementById("ready-btn");
const textContainer = document.getElementById("text-container");
const secondsEl = document.getElementById("game-timer-seconds");
const gameTimer = document.getElementById("game-timer");
const accuracy = document.getElementById("accuracy");

let randomText = "";
let interval;
let currentLetterIdx = 0;
let wpmValue = 0;

function startGameTimer(timer, duration, textIdx) {
	currentLetterIdx = 0;
	accuracyPercent = 0;
	wpmValue = 0;
	mistakes = 0;
	button.classList.add("display-none");

	readyButton.classList.add("display-none");

	const timerElement = document.getElementById("timer");
	timerElement.classList.remove("display-none");
	timerElement.innerText = timer;

	const timerInterval = setInterval(() => {
		timer--;
		timerElement.innerText = timer;
		if (timer === 0) {
			clearInterval(timerInterval);
			timerElement.classList.add("display-none");
			textContainer.classList.remove("display-none");
			textContainer.innerHTML = createTextBackground();
			gameTimer.classList.remove("display-none");
			timeLeft(duration);
			startGame();
		}
	}, 1000);

	fetch(`/game/texts/${textIdx}`)
		.then((res) => res.json())
		.then(({ text }) => (randomText = text));
}

function timeLeft(duration) {
	secondsEl.innerText = duration;
	interval = setInterval(() => {
		duration--;
		secondsEl.innerText = duration;
		if (duration === 0) {
			clearInterval(interval);
			removeKeypressEvent();
			socket.emit("END_GAME");
		}
	}, 1000);
}

let wpmInterval;

function startGame() {
	document.addEventListener("keypress", handleKeyPress);
	document.addEventListener("keydown", handleBackspace);
	const wpmDiv = document.getElementById("wpm");
	let seconds = 0;
	wpmInterval = setInterval(() => {
		seconds++;
		wpmValue = Math.round(((currentLetterIdx / seconds) * 60) / 5);
		wpmDiv.innerText = `${wpmValue}`;
	}, 1000);
}

let wrongIndices = [];
let mistakes = 0;
let accuracyPercent = 0;

function handleBackspace(e) {
	if (e.key === "Backspace") {
		currentLetterIdx--;
		wrongIndices = wrongIndices.filter((idx) => idx !== currentLetterIdx);
		textContainer.innerHTML = createTextBackground();
		socket.emit("CHANGE_PROGRESS", {
			progress: (currentLetterIdx / randomText.length) * 100,
			accuracy: accuracyPercent,
			wpm: wpmValue,
		});
	}
}

function handleKeyPress(e) {
	if (e.key !== randomText[currentLetterIdx]) {
		mistakes++;
		wrongIndices.push(currentLetterIdx);
	}
	currentLetterIdx++;
	textContainer.innerHTML = createTextBackground();

	socket.emit("CHANGE_PROGRESS", {
		progress: (currentLetterIdx / randomText.length) * 100,
		accuracy: accuracyPercent,
		wpm: wpmValue,
	});
	updateAccuracy();
	if (currentLetterIdx === randomText.length) {
		removeKeypressEvent();
		clearInterval(wpmInterval);
	}
}

function removeKeypressEvent() {
	document.removeEventListener("keypress", handleKeyPress);
	document.removeEventListener("keydown", handleBackspace);
}

function endGame(userOrder) {
	removeKeypressEvent();
	clearInterval(wpmInterval);
	clearInterval(interval);
	textContainer.classList.add("display-none");
	gameTimer.classList.add("display-none");

	setIsReady(false);

	showResultsModal({
		usersSortedArray: userOrder,
		onClose: () => {
			button.classList.remove("display-none");

			readyButton.classList.remove("display-none");
			readyButton.innerText = "READY";
		},
	});

	userOrder.forEach(({ username }) => {
		setProgress({ username, progress: 0 });
	});
}

function createTextBackground() {
	let text = "";

	for (let i = 0; i < randomText.length; i++) {
		if (i === currentLetterIdx) {
			text += `<span style="border-bottom: 3px solid green;">${randomText[i]}</span>`;
		} else if (i > currentLetterIdx) {
			text += `<span>${randomText.slice(currentLetterIdx + 1)}</span>`;
			break;
		} else {
			if (wrongIndices.includes(i)) {
				text += `<span style="background-color: crimson;">${randomText[i]}</span>`;
			} else {
				text += `<span style="background-color: greenyellow;">${randomText[i]}</span>`;
			}
		}
	}

	return text;
}

function updateAccuracy() {
	if (currentLetterIdx === 0) {
		accuracyPercent = 0;
		accuracy.innerText = "0";
		return;
	}
	accuracyPercent = Math.round(
		((currentLetterIdx - mistakes) / currentLetterIdx) * 100
	);
	accuracy.innerText = `${accuracyPercent}`;
}

export default startGameTimer;

export { endGame };
