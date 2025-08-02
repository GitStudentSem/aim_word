import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { wordStore } from "../../stores/WordStore";
import SearchField from "../SearchField/SearchField";
import WordCard from "../WordCard/WordCard";
import styles from "./SearchInput.module.css";

const SearchInput: React.FC = () => {
	const [query, setQuery] = useState("");

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (query.trim()) {
				wordStore.searchWords(query);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [query]);

	return (
		<div className={styles.container}>
			<SearchField
				value={query}
				onChange={setQuery}
				isLoading={wordStore.isLoading}
			/>

			{wordStore.searchResults.length > 0 && (
				<div className={styles.resultsContainer}>
					{wordStore.searchResults.map((word) => (
						<WordCard key={word.id} word={word} />
					))}
				</div>
			)}
		</div>
	);
};

export default observer(SearchInput);
