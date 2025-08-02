import { makeAutoObservable } from "mobx";
import { skyengAPI } from "../API/Skyeng";

class SearchMeaningsStore {
	meanings?: IMeaning[];
	constructor() {
		this.meanings;

		makeAutoObservable(this);
	}

	async findMeanings(word: string) {
		const meanings = await skyengAPI.getWordByMeaning(word);
		if (!meanings) return;
		this.meanings = meanings;
	}
}

export const searchMeaningsStore = new SearchMeaningsStore();
