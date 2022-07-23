import { TextGenerator } from '../services/TextGenerator';

const textGenerators: {
	[roomName: string]: TextGenerator;
} = {};

export { textGenerators };
