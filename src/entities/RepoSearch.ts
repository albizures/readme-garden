import {
	getDocs,
	Timestamp,
	doc,
	addDoc,
	query,
	orderBy,
	limit,
	DocumentReference,
	updateDoc,
} from 'firebase/firestore';
import { Range } from '../types';
import type { Optional } from 'utility-types';
import { getCollection } from '../utils/firestore';

export interface RepoSearch {
	range: Range;
	lastTimeChecked: Timestamp;
	incompleteSearch: boolean;
}
type RepoSearchRef = DocumentReference<RepoSearch>;
type CreateRepoSearch = Optional<RepoSearch, 'lastTimeChecked'>;

const repoSearch = getCollection<RepoSearch>('repo-search');

// const DELTA_RANGE = 100_000;

function getDeltaRange(value: number) {
	for (let index = 1; index < 6; index++) {
		const step = 10 ** index;
		if (value / step < 10) {
			return step / 2;
		}
	}

	return 5000;
}

export function getNextRange(range: Range) {
	const { end } = range;
	return {
		start: end,
		end: end - getDeltaRange(end),
	};
}

export async function createRepoSearch(args: CreateRepoSearch) {
	const { range, lastTimeChecked = Timestamp.now(), incompleteSearch } = args;

	const ref = await addDoc(repoSearch, {
		range,
		incompleteSearch,
		lastTimeChecked,
	});

	return ref;
}

const defaultRepoSearch: RepoSearch = {
	range: {
		start: 450_000,
		end: 400_000,
	},
	incompleteSearch: false,
	lastTimeChecked: Timestamp.now(),
};

export async function getLastRepoSearch() {
	const ref = query(repoSearch, orderBy('lastTimeChecked', 'desc'), limit(1));

	const snapshot = await getDocs(ref);

	if (!snapshot.empty) {
		const last = snapshot.docs[0];
		if (last.exists()) {
			return last.data();
		}
	}

	return defaultRepoSearch;
}

export async function doneSearch(ref: RepoSearchRef) {
	updateDoc(ref, {
		lastTimeChecked: Timestamp.now(),
	});
}
