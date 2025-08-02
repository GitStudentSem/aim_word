import { makeAutoObservable } from "mobx";
import { skyengAPI } from "../API/Skyeng";

export interface SavedWord {
	id: string;
	word: IWordById;
	addedAt: Date;
}

// Интерфейс для данных из localStorage (без Date объекта)
interface SavedWordFromStorage {
	id: string;
	word: IWordById;
	addedAt: string; // ISO строка даты
}

class WordStore {
	searchResults: IMeaning[] = [];
	savedWords: SavedWord[] = [];
	isLoading = false;
	searchQuery = "";

	constructor() {
		makeAutoObservable(this);
		this.loadSavedWords();
	}

	setSearchQuery(query: string) {
		this.searchQuery = query;
	}

	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	setSearchResults(results: IMeaning[]) {
		this.searchResults = results;
	}

	async searchWords(query: string) {
		if (!query.trim()) {
			this.setSearchResults([]);
			return;
		}

		this.setLoading(true);
		try {
			const results = await skyengAPI.getWordByMeaning(query);
			if (results) {
				this.setSearchResults(results);
			}
		} catch (error) {
			console.error("Error searching words:", error);
			this.setSearchResults([]);
		} finally {
			this.setLoading(false);
		}
	}

	async addWordToDictionary(meaningId: number) {
		try {
			const wordData = await skyengAPI.getWordsById([meaningId.toString()]);
			if (wordData && wordData.length > 0) {
				const word = wordData[0];
				const savedWord: SavedWord = {
					id: word.id,
					word,
					addedAt: new Date(),
				};

				// Проверяем, не добавлено ли уже это слово
				const exists = this.savedWords.find((sw) => sw.id === savedWord.id);
				if (!exists) {
					this.savedWords.push(savedWord);
					this.saveSavedWords();
				}
			}
		} catch (error) {
			console.error("Error adding word to dictionary:", error);
		}
	}

	removeWordFromDictionary(wordId: string) {
		this.savedWords = this.savedWords.filter((word) => word.id !== wordId);
		this.saveSavedWords();
	}

	private saveSavedWords() {
		localStorage.setItem("savedWords", JSON.stringify(this.savedWords));
	}

	private loadSavedWords() {
		try {
			const saved = localStorage.getItem("savedWords");
			if (saved) {
				const parsed = JSON.parse(saved) as SavedWordFromStorage[];
				this.savedWords = parsed.map((item: SavedWordFromStorage) => ({
					...item,
					addedAt: new Date(item.addedAt),
				}));
			}
		} catch (error) {
			console.error("Error loading saved words:", error);
		}
	}

	get isWordSaved() {
		return (wordId: string) =>
			this.savedWords.some((word) => word.id === wordId);
	}
}

export const wordStore = new WordStore();
