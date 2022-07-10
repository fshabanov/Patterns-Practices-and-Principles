import { currentLetterIdx, randomText, wrongIndices } from "../state/state.mjs";

function updateTextHighlight() {
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

export default updateTextHighlight;
