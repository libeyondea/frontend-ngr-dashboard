import React from 'react';

type Props = {
	q: string;
	handleChangeSearch: (value: string) => void;
	handleSubmitSearch: () => void;
};

const FilterComponent: React.FC<Props> = ({ q, handleSubmitSearch, handleChangeSearch }) => {
	const handleSubmitSearchNew = (e: React.SyntheticEvent) => {
		e.preventDefault();
		handleSubmitSearch();
	};

	const handleChangeSearchNew = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleChangeSearch(e.target.value);
	};

	return (
		<div className="flex mb-4">
			<div className="flex items-center"></div>
			<div className="ml-auto">
				<form onSubmit={handleSubmitSearchNew} className="flex">
					<input
						type="text"
						placeholder="Enter keyword"
						className="mr-4 rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
						value={q}
						onChange={handleChangeSearchNew}
						name="q"
						id="q"
					/>
					<button
						type="submit"
						className="flex items-center justify-center py-3 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white transition ease-in duration-200 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md"
					>
						Search
					</button>
				</form>
			</div>
		</div>
	);
};

export default FilterComponent;
