let wpm = 0;
let accuracy = 0;
let mistakes = 0;
let currentLetterIdx = 0;
let randomText = "";
let wrongIndices = [];

function setWpm(newWpm) {
	wpm = newWpm;
}

function setAccuracy(newAccuracy) {
	accuracy = newAccuracy;
}

function setMistakes(newMistakes) {
	mistakes = newMistakes;
}

function setCurrentLetterIdx(newCurrentLetterIdx) {
	currentLetterIdx = newCurrentLetterIdx;
}

function setRandomText(newText) {
	randomText = newText;
}

function setWrongIndices(newWrongIndices) {
	wrongIndices = newWrongIndices;
}

export {
	wpm,
	setWpm,
	accuracy,
	setAccuracy,
	mistakes,
	setMistakes,
	currentLetterIdx,
	setCurrentLetterIdx,
	randomText,
	setRandomText,
	wrongIndices,
	setWrongIndices,
};
