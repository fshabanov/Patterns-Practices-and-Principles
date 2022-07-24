import { CommentSender } from '../services/commentSender';

const roomCommentators: {
	[roomName: string]: CommentSender;
} = {};

export { roomCommentators };
