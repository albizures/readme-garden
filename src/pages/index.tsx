import { search } from '../utils/github';

export default function Home() {
	return (
		<div className="bg-green-500">
			asdfa{' '}
			{search({
				stars: {
					start: 200000,
					end: 400000,
				},
			})}
		</div>
	);
}
