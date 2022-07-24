import { updateInnerText } from '../helpers/domHelper.mjs';

const commentParagraph = document.getElementById('commentator');

// Partial Application

const changeComment = (innerText) =>
	updateInnerText(commentParagraph, innerText);

export { changeComment };
