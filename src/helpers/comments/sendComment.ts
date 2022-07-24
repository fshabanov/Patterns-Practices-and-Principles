import { CommentType, User } from '../../@types';
import { textGenerators } from '../../state';
import { roomCommentators } from '../../state/commentator';

function sendComment(
	roomName: string,
	type: CommentType,
	args?: User | User[]
) {
	const commentator = roomCommentators[roomName];
	const textGenerator = textGenerators[roomName];
	switch (type) {
		case CommentType.START_GAME:
			commentator.sendComment(textGenerator.startGame());
			break;
		case CommentType.END_GAME:
			commentator.sendComment(textGenerator.endGame(args as User[]));
			break;
		case CommentType.JOIN_ROOM:
			commentator.sendComment(textGenerator.newUser(args as User));
			break;
		case CommentType.LEAVE_ROOM:
			commentator.sendComment(textGenerator.leaveRoom(args as User));
			break;
		case CommentType.USER_READY:
			commentator.sendComment(textGenerator.userReady(args as User));
			break;
		case CommentType.USER_NOT_READY:
			commentator.sendComment(textGenerator.userNotReady(args as User));
			break;
		case CommentType.REPORT_STATUS:
			commentator.sendComment(textGenerator.reportStatus());
			break;
		case CommentType.USER_NEAR:
			commentator.sendComment(textGenerator.userNear(args as User));
			break;
		case CommentType.USER_FINISHED:
			commentator.sendComment(textGenerator.userFinished(args as User));
			break;
		case CommentType.RANDOM_DATA:
			commentator.sendComment(textGenerator.randomText());
		default:
			break;
	}
}

export { sendComment };
