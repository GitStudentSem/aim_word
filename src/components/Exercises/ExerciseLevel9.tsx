import { useState } from "react";
import { observer } from "mobx-react-lite";
import SoundButton from "../SoundButton/SoundButton";
import styles from "./ExerciseLevel9.module.css";

interface ExerciseLevel9Props {
	word: IWordById;
	level: number;
	onComplete: (success: boolean) => void;
}

const ExerciseLevel9: React.FC<ExerciseLevel9Props> = observer(
	({ word, level, onComplete }) => {
		const [userInput, setUserInput] = useState("");
		const [hasAnswered, setHasAnswered] = useState(false);

		const getLevelInfo = () => {
			const intervals = [3, 6, 12, 24, 48];
			const intervalIndex = level - 9;
			const days = intervals[intervalIndex] || 3;

			return {
				days,
				description: `Вспомните слово через ${days} дней. Введите его по памяти.`,
			};
		};

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			if (!userInput.trim()) return;

			const isCorrect =
				userInput.toLowerCase().trim() === word.text.toLowerCase();
			setHasAnswered(true);
			onComplete(isCorrect);
		};

		const levelInfo = getLevelInfo();

		return (
			<div className={styles.container}>
				<div className={styles.header}>
					<h3>Уровень {level}: Интервальное повторение</h3>
					<p className={styles.description}>{levelInfo.description}</p>
				</div>

				<div className={styles.exercise}>
					<div className={styles.audioSection}>
						<h4>Прослушайте слово:</h4>
						{word.soundUrl && (
							<div className={styles.soundButton}>
								<SoundButton soundUrl={word.soundUrl} />
							</div>
						)}
					</div>

					<form onSubmit={handleSubmit} className={styles.inputSection}>
						<h4>Введите английское слово:</h4>
						<input
							type="text"
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							placeholder="Введите слово..."
							className={styles.wordInput}
							disabled={hasAnswered}
							// biome-ignore lint/a11y/noAutofocus: <explanation>
							autoFocus
						/>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={!userInput.trim() || hasAnswered}
						>
							Проверить
						</button>
					</form>

					{hasAnswered && (
						<div className={styles.result}>
							{userInput.toLowerCase().trim() === word.text.toLowerCase() ? (
								<div className={styles.correct}>
									<p>Правильно! "{word.text}"</p>
									{level === 13 && (
										<p className={styles.completed}>
											Поздравляем! Слово выучено!
										</p>
									)}
								</div>
							) : (
								<div className={styles.incorrect}>
									<p>Неправильно! Правильный ответ: "{word.text}"</p>
									<p>Перевод: {word.translation.text}</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	},
);

export default ExerciseLevel9;
