import { addDoc, DocumentReference, Timestamp } from 'firebase/firestore';
import { Optional } from 'utility-types';
import { getCollection } from '../utils/firestore';

export interface Readme {
	url: string;
	lastTimeCheck: Timestamp;
	sections: string[];
}
export type ReadmeRef = DocumentReference<Readme>;
type CreateReadme = Optional<Readme, 'lastTimeCheck' | 'sections'>;

const readme = getCollection<Readme>('readme');

export async function createReadme(args: CreateReadme): Promise<ReadmeRef> {
	const { url, lastTimeCheck = Timestamp.now() } = args;
	const ref = await addDoc(readme, {
		url,
		lastTimeCheck,
		sections: [],
	});

	return ref;
}
