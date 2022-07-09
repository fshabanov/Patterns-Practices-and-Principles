import socket from "./game.mjs";

function startGameTimer(timer, duration, textIdx, roomName) {
	const button = document.getElementById("quit-room-btn");
	button.classList.add("display-none");

	const readyButton = document.getElementById("ready-btn");
	readyButton.classList.add("display-none");

	const timerElement = document.getElementById("timer");
	timerElement.classList.remove("display-none");
	timerElement.innerText = timer;

	const textContainer = document.getElementById("text-container");
	let randomText = "";

	const gameTimer = document.getElementById("game-timer");

	const interval = setInterval(() => {
		timer--;
		timerElement.innerText = timer;
		if (timer === 0) {
			clearInterval(interval);
			timerElement.classList.add("display-none");
			textContainer.classList.remove("display-none");
			textContainer.innerText = randomText;
			gameTimer.classList.remove("display-none");
			timeLeft(duration);
			startGame(randomText, textContainer, roomName);
		}
	}, 1000);

	fetch(`/game/texts/${textIdx}`)
		.then((res) => res.json())
		.then(({ text }) => (randomText = text));
}

function timeLeft(duration) {
	const secondsEl = document.getElementById("game-timer-seconds");
	secondsEl.innerText = duration;
	const interval = setInterval(() => {
		duration--;
		secondsEl.innerText = duration;
		if (duration === 0) {
			clearInterval(interval);
		}
	}, 1000);
}

function startGame(text, textContainer, roomName) {
	document.addEventListener("keypress", (e) =>
		handleKeyPress(e, text, textContainer, roomName)
	);
}

let currentLetterIdx = 0;
function handleKeyPress(e, text, textContainer, roomName) {
	if (e.key === text[currentLetterIdx]) {
		currentLetterIdx++;
		textContainer.innerHTML = `<span style="background-color: green;">${text.slice(
			0,
			currentLetterIdx
		)}</span><span>${text.slice(currentLetterIdx)}</span>`;
		socket.emit("CHANGE_PROGRESS", {
			progress: (currentLetterIdx / text.length) * 100,
			roomName,
		});
	}
	if (currentLetterIdx === text.length) {
		document.removeEventListener(
			"keypress",
			(e) => handleKeyPress(e, text, textContainer) // doesn't work
		);
	}
}

export default startGameTimer;
