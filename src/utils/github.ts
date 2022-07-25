// https://github.com/search?p=14&q=stars%3A10000..15000+size%3A%3C1000&sort=starts&type=Repositories
import ky from 'ky';
import to from 'await-to-js';
import { Range } from '../types';

function rangeToString(range: Range) {
	return `${range.end}..${range.start}`;
}

interface Args {
	stars: Range;
	page?: number;
}

export function searchByStars(args: Args) {
	const { stars } = args;
	const url = new URL('https://api.github.com/search/repositories');
	const query = url.searchParams;
	query.append('q', `stars:${rangeToString(stars)}`);
	query.append('sort', 'stars');

	return url.toString();
}

export function getRawUrl(url: string) {
	const { pathname } = new URL(url);

	return `https://raw.githubusercontent.com${pathname.replace('/blob', '')}`;
}

interface GetReadmeUrlArgs {
	defaultBranch: string;
	repoUrl: string;
}
export function getReadmeUrl(args: GetReadmeUrlArgs) {
	const { repoUrl, defaultBranch } = args;
	return `${repoUrl}/blob/${defaultBranch}/README.md`;
}

export async function checkReadme(url: string) {
	const [error] = await to(ky.get(url));

	return !error;
}
