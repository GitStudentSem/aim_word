import { makeAutoObservable } from "mobx";
import { skyengAPI } from "../API/Skyeng";
import { myServerAPI } from "../API/MyServerAPI";

export interface SavedWord {
	id: string;
	word: IWordById;
	addedAt: Date;
}



class WordStore {
	searchResults: IMeaning[] = [];
	savedWords: SavedWord[] = [];
	isLoading = false;
	searchQuery = "";

	constructor() {
		makeAutoObservable(this);
		// Инициализируем загрузку слов
		this.initializeWords();
	}

	private async initializeWords() {
		await this.loadSavedWords();
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

				// Используем MyServerAPI для сохранения
				const result = await myServerAPI.addWordToDictionary(savedWord);
				if (result.success && result.data) {
					// Обновляем локальное состояние только если сохранение прошло успешно
					const exists = this.savedWords.find((sw) => sw.id === savedWord.id);
					if (!exists) {
						this.savedWords.push(savedWord);
					}
				} else {
					console.error("Error saving word:", result.error);
				}
			}
		} catch (error) {
			console.error("Error adding word to dictionary:", error);
		}
	}

	async removeWordFromDictionary(wordId: string) {
		try {
			const result = await myServerAPI.removeWordFromDictionary(wordId);
			if (result.success) {
				this.savedWords = this.savedWords.filter((word) => word.id !== wordId);
			} else {
				console.error("Error removing word:", result.error);
			}
		} catch (error) {
			console.error("Error removing word from dictionary:", error);
		}
	}



	private async loadSavedWords() {
		try {
			const result = await myServerAPI.getUserWords();
			if (result.success && result.data) {
				this.savedWords = result.data.words;
			} else {
				console.error("Error loading saved words:", result.error);
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
