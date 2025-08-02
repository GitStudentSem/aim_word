import type { SavedWord } from "../stores/WordStore";

export interface ServerResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface UserWordsResponse {
	words: SavedWord[];
	total: number;
	page: number;
	limit: number;
}

export interface AddWordRequest {
	wordId: string;
	userId?: string; // будет использоваться когда добавим авторизацию
}

export interface RemoveWordRequest {
	wordId: string;
	userId?: string;
}

class MyServerAPI {
	private baseUrl: string;
	private isServerAvailable: boolean;

	constructor() {
		// Пока что используем заглушку, позже заменим на реальный URL
		this.baseUrl = "http://localhost:3001/api";
		this.isServerAvailable = false; // Пока что сервер недоступен
	}

	/**
	 * Проверяет доступность сервера
	 */
	async checkServerAvailability(): Promise<boolean> {
		try {
			const response = await fetch(`${this.baseUrl}/health`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			this.isServerAvailable = response.ok;
			return this.isServerAvailable;
		} catch (error) {
			console.log("Server is not available, using local storage");
			this.isServerAvailable = false;
			return false;
		}
	}

	/**
	 * Получает сохраненные слова пользователя
	 */
	async getUserWords(
		userId?: string,
	): Promise<ServerResponse<UserWordsResponse>> {
		if (!this.isServerAvailable) {
			// Используем локальное хранилище
			return this.getWordsFromLocalStorage();
		}

		try {
			const response = await fetch(`${this.baseUrl}/words`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...(userId && { Authorization: `Bearer ${userId}` }),
				},
			});

			if (response.ok) {
				const data = await response.json();
				return { success: true, data };
			}
			return {
				success: false,
				error: `HTTP ${response.status}: ${response.statusText}`,
			};
		} catch (error) {
			console.error("Error fetching user words:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Добавляет слово в словарь пользователя
	 */
	async addWordToDictionary(
		word: SavedWord,
		userId?: string,
	): Promise<ServerResponse<SavedWord>> {
		if (!this.isServerAvailable) {
			// Используем локальное хранилище
			return this.addWordToLocalStorage(word);
		}

		try {
			const response = await fetch(`${this.baseUrl}/words`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(userId && { Authorization: `Bearer ${userId}` }),
				},
				body: JSON.stringify({
					wordId: word.id,
					word: word.word,
					addedAt: word.addedAt.toISOString(),
				} as AddWordRequest),
			});

			if (response.ok) {
				const data = await response.json();
				return { success: true, data };
			}
			return {
				success: false,
				error: `HTTP ${response.status}: ${response.statusText}`,
			};
		} catch (error) {
			console.error("Error adding word to dictionary:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Удаляет слово из словаря пользователя
	 */
	async removeWordFromDictionary(
		wordId: string,
		userId?: string,
	): Promise<ServerResponse<boolean>> {
		if (!this.isServerAvailable) {
			// Используем локальное хранилище
			return this.removeWordFromLocalStorage(wordId);
		}

		try {
			const response = await fetch(`${this.baseUrl}/words/${wordId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					...(userId && { Authorization: `Bearer ${userId}` }),
				},
			});

			if (response.ok) {
				return { success: true, data: true };
			}
			return {
				success: false,
				error: `HTTP ${response.status}: ${response.statusText}`,
			};
		} catch (error) {
			console.error("Error removing word from dictionary:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Синхронизирует локальные данные с сервером
	 */
	async syncWithServer(userId?: string): Promise<ServerResponse<boolean>> {
		if (!this.isServerAvailable) {
			return { success: false, error: "Server is not available" };
		}

		try {
			const localWords = this.getWordsFromLocalStorage();
			if (localWords.success && localWords.data) {
				// Отправляем все локальные слова на сервер
				for (const word of localWords.data.words) {
					await this.addWordToDictionary(word, userId);
				}

				// Очищаем локальное хранилище после успешной синхронизации
				localStorage.removeItem("savedWords");

				return { success: true, data: true };
			}

			return { success: false, error: "No local data to sync" };
		} catch (error) {
			console.error("Error syncing with server:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// Методы для работы с локальным хранилищем (fallback)

	private getWordsFromLocalStorage(): ServerResponse<UserWordsResponse> {
		try {
			const saved = localStorage.getItem("savedWords");
			if (saved) {
				const parsed = JSON.parse(saved) as SavedWord[];
				return {
					success: true,
					data: {
						words: parsed,
						total: parsed.length,
						page: 1,
						limit: parsed.length,
					},
				};
			}
			return {
				success: true,
				data: {
					words: [],
					total: 0,
					page: 1,
					limit: 0,
				},
			};
		} catch (error) {
			console.error("Error loading from localStorage:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	private addWordToLocalStorage(word: SavedWord): ServerResponse<SavedWord> {
		try {
			const saved = localStorage.getItem("savedWords");
			const words: SavedWord[] = saved ? JSON.parse(saved) : [];

			// Проверяем, не добавлено ли уже это слово
			const exists = words.find((w) => w.id === word.id);
			if (!exists) {
				words.push(word);
				localStorage.setItem("savedWords", JSON.stringify(words));
			}

			return { success: true, data: word };
		} catch (error) {
			console.error("Error adding to localStorage:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	private removeWordFromLocalStorage(wordId: string): ServerResponse<boolean> {
		try {
			const saved = localStorage.getItem("savedWords");
			if (saved) {
				const words: SavedWord[] = JSON.parse(saved);
				const filteredWords = words.filter((word) => word.id !== wordId);
				localStorage.setItem("savedWords", JSON.stringify(filteredWords));
			}

			return { success: true, data: true };
		} catch (error) {
			console.error("Error removing from localStorage:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}

export const myServerAPI = new MyServerAPI();
