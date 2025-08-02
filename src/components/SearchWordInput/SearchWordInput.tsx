import type { FC } from "react";

import { searchMeaningsStore } from "../../store/SearchMeaningsStore";

export const SearchWordInput: FC = () => {
	const FORM_NAME = "search";

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const inputValue = formData.get(FORM_NAME) || "";

		if (inputValue && typeof inputValue === "string") {
			searchMeaningsStore.findMeanings(inputValue);
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<input type="text" name={FORM_NAME} placeholder="Введите слово" />
			<button type="submit">Искать</button>
		</form>
	);
};
