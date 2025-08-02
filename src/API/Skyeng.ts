class SkyengAPI {
	private getWordByMeaningUrl: string;
	private getWordsByIdUrl: string;

	constructor() {
		this.getWordByMeaningUrl =
			"https://dictionary.skyeng.ru/api/public/v1/words/search";

		this.getWordsByIdUrl =
			"https://dictionary.skyeng.ru/api/public/v1/meanings";
	}

	/**
	 *
	 * @param word - Слово на русском или английском языке
	 */
	async getWordByMeaning(word: string): Promise<IMeaning[] | undefined> {
		try {
			const response = await fetch(
				`${this.getWordByMeaningUrl}?search=${word}`,
			);

			if (response.ok) {
				const meanings = await response.json();
				return meanings;
			}
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 *
	 * @param wordIds - Массив id слов
	 */
	async getWordsById(wordIds: string[]): Promise<IWordById[] | undefined> {
		try {
			const params = new URLSearchParams({
				ids: wordIds.join(","), // автоматически будет закодировано как "123,321"
			});
			const response = await fetch(`${this.getWordsByIdUrl}?${params}`);

			if (response.ok) {
				const words = await response.json();
				console.log("words", words);
				return words;
			}
		} catch (error) {
			console.error(error);
		}
	}
}

export const skyengAPI = new SkyengAPI();
