import { addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getCollection } from '../utils/firestore';
import { ReadmeRef } from './Readme';

interface ReadmeSection {
	title: string;
	readme: string;
}

interface CreateReadmeSection {
	title: string;
	readmeRef: ReadmeRef;
}

const readmeSection = getCollection<ReadmeSection>('readme-section');

export async function createReadmeSection(args: CreateReadmeSection) {
	const { title, readmeRef } = args;

	const ref = await addDoc(readmeSection, {
		title,
		readme: readmeRef.id,
	});

	updateDoc(readmeRef, {
		sections: arrayUnion(ref.id),
	});

	return ref;
}
