import {
	collection,
	DocumentData,
	CollectionReference,
} from 'firebase/firestore';
import { store } from './firebase';

export function getCollection<T = DocumentData>(name: string) {
	return collection(store, name) as CollectionReference<T>;
}
