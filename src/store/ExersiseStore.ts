import { makeAutoObservable } from "mobx";
import { skyengAPI } from "../API/Skyeng";

class ExersiseStore {
	word?: IWordById;
	constructor() {
		this.word;

		this.setWord(["123"]);
		makeAutoObservable(this);
	}

	async setWord(wordIds: string[]) {
		const word = await skyengAPI.getWordsById(wordIds);
		if (!word) return;
		console.log("word", word);
		this.word = word[0];
	}
}

export const exersiseStore = new ExersiseStore();
