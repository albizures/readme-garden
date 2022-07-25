import ky, { HTTPError } from 'ky';
import { Timestamp } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createReadme } from '../../../entities/Readme';
import { checkReadme, getRawUrl, getReadmeUrl, searchByStars } from '../../../utils/github';
import {
	createRepoSearch,
	getLastRepoSearch,
	getNextRange,
	RepoSearch,
} from '../../../entities/RepoSearch';
import to from 'await-to-js';

interface Repo {
	full_name: string;
	html_url: string;
	description: string;
	fork: boolean;
	language: string;
	default_branch: string;
	license: {
		name: string;
	};
	topics: string[];
}

interface SearchResponse {
	total_count: 0;
	incomplete_results: boolean;
	items: Repo[];
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { range: lastRange } = await getLastRepoSearch();

	const range = getNextRange(lastRange);
	const url = searchByStars({
		stars: range,
	});

	const [error, response] = await to(ky.get(url));

	if (error || !response) {
		if (error instanceof HTTPError) {
			return {
				headers: error.response.headers,
			};
		}
		res.status(500);

		return {
			message: error.message ?? 'Unknown error',
		};
	}

	const {
		items,
		incomplete_results: incompleteSearch,
		total_count: totalCount,
	} = await response.json<SearchResponse>();

	// ℹ️ probably a good idea to do something with the errors
	await Promise.allSettled(
		items.map(async (item) => {
			const { html_url: repoUrl, default_branch: defaultBranch } = item;
			const readmeUrl = getReadmeUrl({ repoUrl, defaultBranch });

			if (await checkReadme(readmeUrl)) {
				await createReadme({
					url: getRawUrl(readmeUrl),
				});
			}
		}),
	);

	const search: RepoSearch = {
		range,
		incompleteSearch: incompleteSearch || totalCount !== items.length,
		lastTimeChecked: Timestamp.now(),
	};

	const ref = await createRepoSearch(search);

	return (
		ref.id,
		res.status(200).json({
			id: ref.id,
			...search,
		})
	);
}

export default handler;
