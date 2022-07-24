import { Commentator } from '../services/commentator';

const roomCommentators: {
	[roomName: string]: Commentator;
} = {};

export { roomCommentators };
