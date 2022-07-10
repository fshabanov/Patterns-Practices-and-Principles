import socket from "./game.mjs";
import updateAccuracy from "./helpers/updateAccuracy.mjs";
import updateTextHighlight from "./helpers/updateTextHighlight.mjs";
import { textContainerEl } from "./state/dom.mjs";
import { wpmInterval } from "./state/intervals.mjs";
import {
	currentLetterIdx,
	randomText,
	setCurrentLetterIdx,
	setWrongIndices,
	accuracy,
	wpm,
	wrongIndices,
	setMistakes,
	mistakes,
} from "./state/state.mjs";

function startEventListeners() {
	document.addEventListener("keypress", handleKeyPress);
	document.addEventListener("keydown", handleBackspace);
}

function removeEventListeners() {
	document.removeEventListener("keypress", handleKeyPress);
	document.removeEventListener("keydown", handleBackspace);
}

function handleBackspace(e) {
	if (e.key === "Backspace" && currentLetterIdx > 0) {
		setCurrentLetterIdx(currentLetterIdx - 1);
		setWrongIndices(wrongIndices.filter((idx) => idx !== currentLetterIdx));
		textContainerEl.innerHTML = updateTextHighlight();
		socket.emit("CHANGE_PROGRESS", {
			progress: (currentLetterIdx / randomText.length) * 100,
			accuracy,
			wpm,
		});
	}
}

function handleKeyPress(e) {
	if (e.key !== randomText[currentLetterIdx]) {
		setMistakes(mistakes + 1);
		wrongIndices.push(currentLetterIdx);
	}
	setCurrentLetterIdx(currentLetterIdx + 1);
	textContainerEl.innerHTML = updateTextHighlight();

	socket.emit("CHANGE_PROGRESS", {
		progress: (currentLetterIdx / randomText.length) * 100,
		accuracy,
		wpm,
	});
	updateAccuracy();
	if (currentLetterIdx === randomText.length) {
		removeEventListeners();
		clearInterval(wpmInterval);
	}
}

export { startEventListeners, removeEventListeners };
