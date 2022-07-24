import { TextGenerator } from '../services/textGenerator';

const textGenerators: {
	[roomName: string]: TextGenerator;
} = {};

export { textGenerators };
