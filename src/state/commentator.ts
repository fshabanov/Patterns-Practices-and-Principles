import { Commentator } from '../services/commentator';

let commentator: Commentator;

function setCommentator(newCommentator: Commentator): void {
	commentator = newCommentator;
}

const roomCommentators: {
	[roomName: string]: Commentator;
} = {};

export { commentator, setCommentator, roomCommentators };
