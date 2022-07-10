import { accuracyEl } from "../state/dom.mjs";
import { currentLetterIdx, mistakes, setAccuracy } from "../state/state.mjs";

function updateAccuracy() {
	if (currentLetterIdx === 0) {
		setAccuracy(0);
		accuracyEl.innerText = "0";
		return;
	}
	let accuracyPercent = Math.round(
		((currentLetterIdx - mistakes) / currentLetterIdx) * 100
	);
	setAccuracy(accuracyPercent);
	accuracyEl.innerText = `${accuracyPercent}`;
}

export default updateAccuracy;
