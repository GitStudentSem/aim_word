import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { wordStore } from "../../stores/WordStore";
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

	const handleAddWord = async (meaningId: number) => {
		await wordStore.addWordToDictionary(meaningId);
	};

	const getPartOfSpeechLabel = (code: string) => {
		const labels: Record<string, string> = {
			noun: "сущ.",
			verb: "глаг.",
			adj: "прил.",
			adv: "нареч.",
			prep: "предл.",
			conj: "союз",
			pron: "местоим.",
			interj: "междом.",
			num: "числ.",
		};
		return labels[code] || code;
	};

	return (
		<div className={styles.container}>
			<div className={styles.searchContainer}>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Введите слово для поиска..."
					className={styles.searchInput}
				/>
				{wordStore.isLoading && <div className={styles.loading}>Поиск...</div>}
			</div>

			{wordStore.searchResults.length > 0 && (
				<div className={styles.resultsContainer}>
					{wordStore.searchResults.map((word) => (
						<div key={word.id} className={styles.wordCard}>
							<div className={styles.wordHeader}>
								<h3 className={styles.wordText}>{word.text}</h3>
								<span className={styles.wordId}>#{word.id}</span>
							</div>

							{word.meanings.map((meaning) => (
								<div key={meaning.id} className={styles.meaningItem}>
									<div className={styles.meaningHeader}>
										<span className={styles.partOfSpeech}>
											{getPartOfSpeechLabel(meaning.partOfSpeechCode)}
										</span>
										{meaning.transcription && (
											<span className={styles.transcription}>
												[{meaning.transcription}]
											</span>
										)}
									</div>

									<div className={styles.translation}>
										{meaning.translation.text}
										{meaning.translation.note && (
											<span className={styles.note}>
												{" "}
												— {meaning.translation.note}
											</span>
										)}
									</div>

									<div className={styles.actions}>
										{meaning.soundUrl && (
											<button
												className={styles.soundButton}
												onClick={() => {
													const audio = new Audio(meaning.soundUrl);
													audio.play();
												}}
												type="button"
											>
												🔊
											</button>
										)}

										<button
											className={`${styles.addButton} ${
												wordStore.isWordSaved(meaning.id.toString())
													? styles.added
													: ""
											}`}
											onClick={() => handleAddWord(meaning.id)}
											disabled={wordStore.isWordSaved(meaning.id.toString())}
											type="button"
										>
											{wordStore.isWordSaved(meaning.id.toString())
												? "✓ Добавлено"
												: "+ Добавить"}
										</button>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default observer(SearchInput);
