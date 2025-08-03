import { makeAutoObservable } from "mobx";
import { levels } from "../utils/levels";

import { skyengAPI } from "../API/Skyeng";

export interface WordProgress {
	wordId: string;
	word: IWordById;
	currentLevel: number;
	lastCompletedAt?: Date;
	nextReviewAt?: Date;
	completedLevels: number[];
	errors: number;
	addedAt: Date;
}

export interface ExerciseSession {
	id: string;
	wordId: string;
	level: number;
	startedAt: Date;
	completedAt?: Date;
	success: boolean;
	attempts: number;
}

export interface WordExerciseSession {
	words: WordProgress[];
	currentWordIndex: number;
	totalWords: number;
	completedWords: number;
	correctAnswers: number;
	startTime: Date;
}

export interface ExerciseState {
	isActive: boolean;
	currentWord?: WordProgress;
	currentLevel?: number;
	exerciseType?: string;
	options?: string[];
	correctAnswer?: string;
	userAnswer?: string;
	showResult: boolean;
	isCorrect: boolean;
	attempts: number;
}

export interface WordExerciseSession {
	words: WordProgress[];
	currentWordIndex: number;
	totalWords: number;
	completedWords: number;
	correctAnswers: number;
	startTime: Date;
}

class ExerciseStore {
	wordProgress: WordProgress[] = [];
	exerciseSessions: ExerciseSession[] = [];
	currentExercise: ExerciseState = {
		isActive: false,
		showResult: false,
		isCorrect: false,
		attempts: 0,
	};
	currentSession: WordExerciseSession | null = null;
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
		this.loadProgress();
	}

	// Загрузка прогресса из localStorage
	private async loadProgress() {
		try {
			const saved = localStorage.getItem("wordProgress");
			if (saved) {
				const parsed = JSON.parse(saved);
				this.wordProgress = parsed.map((item: any) => ({
					...item,
					lastCompletedAt: item.lastCompletedAt ? new Date(item.lastCompletedAt) : undefined,
					nextReviewAt: item.nextReviewAt ? new Date(item.nextReviewAt) : undefined,
					addedAt: new Date(item.addedAt),
				}));
			}
		} catch (error) {
			console.error("Error loading progress:", error);
		}
	}

	// Сохранение прогресса в localStorage
	private saveProgress() {
		try {
			localStorage.setItem("wordProgress", JSON.stringify(this.wordProgress));
		} catch (error) {
			console.error("Error saving progress:", error);
		}
	}

	// Добавление слова в прогресс
	addWordToProgress(word: IWordById) {
		const exists = this.wordProgress.find(wp => wp.wordId === word.id);
		if (!exists) {
			const newProgress: WordProgress = {
				wordId: word.id,
				word,
				currentLevel: 0,
				completedLevels: [],
				errors: 0,
				addedAt: new Date(),
			};
			this.wordProgress.push(newProgress);
			this.saveProgress();
		}
	}

	// Получение слов для упражнений
	getWordsForExercise(): WordProgress[] {
		const now = new Date();
		return this.wordProgress.filter(word => {
			// Если слово на уровне 0, оно готово к упражнениям
			if (word.currentLevel === 0) return true;
			
			// Если есть nextReviewAt и время пришло
			if (word.nextReviewAt && word.nextReviewAt <= now) return true;
			
			// Если слово не завершено (уровень < 13)
			return word.currentLevel < 13;
		});
	}

	// Получение случайных слов для сессии упражнений
	getWordsForSession(count: number = 10): WordProgress[] {
		const availableWords = this.getWordsForExercise();
		if (availableWords.length === 0) return [];
		
		// Перемешиваем слова
		const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);
		
		// Возвращаем нужное количество слов
		return shuffledWords.slice(0, Math.min(count, availableWords.length));
	}

	// Получение случайного слова для упражнения
	getRandomWordForExercise(): WordProgress | null {
		const availableWords = this.getWordsForExercise();
		if (availableWords.length === 0) return null;
		
		const randomIndex = Math.floor(Math.random() * availableWords.length);
		return availableWords[randomIndex];
	}

	// Начало сессии упражнений
	startExerciseSession(wordCount: number = 10) {
		const words = this.getWordsForSession(wordCount);
		if (words.length === 0) return false;
		
		this.currentSession = {
			words,
			currentWordIndex: 0,
			totalWords: words.length,
			completedWords: 0,
			correctAnswers: 0,
			startTime: new Date(),
		};
		
		// Начинаем первое упражнение
		this.startExercise(words[0]);
		return true;
	}

	// Начало упражнения
	startExercise(wordProgress: WordProgress) {
		this.currentExercise = {
			isActive: true,
			currentWord: wordProgress,
			currentLevel: wordProgress.currentLevel,
			showResult: false,
			isCorrect: false,
			attempts: 0,
		};
	}

	// Завершение упражнения
	completeExercise(success: boolean) {
		if (!this.currentExercise.currentWord) return;

		const wordId = this.currentExercise.currentWord.wordId;
		const level = this.currentExercise.currentLevel || 0;
		
		// Обновляем прогресс слова
		const wordIndex = this.wordProgress.findIndex(wp => wp.wordId === wordId);
		if (wordIndex !== -1) {
			const word = this.wordProgress[wordIndex];
			
			if (success) {
				// Правильный ответ - переходим на следующий уровень
				const nextLevel = Math.min(level + 1, 13);
				word.currentLevel = nextLevel;
				word.completedLevels.push(level);
				
				// Устанавливаем время следующего повторения для интервальных уровней
				if (nextLevel >= 9) {
					const intervals = [3, 6, 12, 24, 48]; // дни для уровней 9-13
					const intervalIndex = nextLevel - 9;
					if (intervalIndex < intervals.length) {
						const nextReview = new Date();
						nextReview.setDate(nextReview.getDate() + intervals[intervalIndex]);
						word.nextReviewAt = nextReview;
					}
				}
			} else {
				// Неправильный ответ - возвращаемся на предыдущий уровень
				word.currentLevel = Math.max(level - 1, 0);
				word.errors++;
			}
			
			word.lastCompletedAt = new Date();
			this.wordProgress[wordIndex] = word;
		}

		// Сохраняем сессию упражнения
		const session: ExerciseSession = {
			id: Date.now().toString(),
			wordId,
			level,
			startedAt: new Date(),
			completedAt: new Date(),
			success,
			attempts: this.currentExercise.attempts,
		};
		this.exerciseSessions.push(session);

		// Обновляем статистику сессии
		if (this.currentSession) {
			this.currentSession.completedWords++;
			if (success) {
				this.currentSession.correctAnswers++;
			}
		}

		// Сохраняем прогресс
		this.saveProgress();

		// Проверяем, есть ли еще слова в сессии
		if (this.currentSession && this.currentSession.currentWordIndex < this.currentSession.words.length - 1) {
			// Переходим к следующему слову
			this.currentSession.currentWordIndex++;
			const nextWord = this.currentSession.words[this.currentSession.currentWordIndex];
			this.startExercise(nextWord);
		} else {
			// Сессия завершена
			this.completeSession();
		}
	}

	// Завершение сессии
	completeSession() {
		this.currentSession = null;
		this.currentExercise = {
			isActive: false,
			showResult: false,
			isCorrect: false,
			attempts: 0,
		};
	}

	// Получение описания уровня
	getLevelDescription(level: number): string {
		const levelData = levels.find(l => l.level === level);
		return levelData?.description || "Неизвестный уровень";
	}

	// Получение статистики
	getStatistics() {
		const totalWords = this.wordProgress.length;
		const completedWords = this.wordProgress.filter(w => w.currentLevel === 13).length;
		const inProgressWords = this.wordProgress.filter(w => w.currentLevel > 0 && w.currentLevel < 13).length;
		const newWords = this.wordProgress.filter(w => w.currentLevel === 0).length;

		return {
			totalWords,
			completedWords,
			inProgressWords,
			newWords,
		};
	}

	// Получение случайных слов для вариантов ответов
	async getRandomWordsForOptions(count: number): Promise<string[]> {
		try {
			// Получаем случайные слова из API
			const randomWords = await skyengAPI.getWordByMeaning("the");
			if (randomWords && randomWords.length > 0) {
				return randomWords.slice(0, count).map(word => word.text);
			}
		} catch (error) {
			console.error("Error getting random words:", error);
		}
		
		// Fallback - возвращаем базовые слова
		return ["happy", "good", "big", "small", "fast", "slow", "new", "old"];
	}
}

export const exerciseStore = new ExerciseStore(); 