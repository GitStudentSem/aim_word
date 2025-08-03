import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import styles from "./ExerciseLevel5.module.css";

interface ExerciseLevel5Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
}

const ExerciseLevel5: React.FC<ExerciseLevel5Props> = observer(
	({ word, onComplete }) => {
		const [assembledWord, setAssembledWord] = useState("");
		const [availableLetters, setAvailableLetters] = useState<string[]>([]);
		const [hasAnswered, setHasAnswered] = useState(false);

		// Инициализация букв при загрузке компонента
		useEffect(() => {
			const letters = word.text.split("").sort(() => Math.random() - 0.5);
			setAvailableLetters(letters);
		}, [word]);

		const handleLetterClick = (letter: string, index: number) => {
			if (hasAnswered) return;

			setAssembledWord((prev) => prev + letter);
			setAvailableLetters((prev) => prev.filter((_, i) => i !== index));
		};

		const handleRemoveLetter = () => {
			if (hasAnswered || assembledWord.length === 0) return;

			const lastLetter = assembledWord[assembledWord.length - 1];
			setAssembledWord((prev) => prev.slice(0, -1));
			setAvailableLetters((prev) => [...prev, lastLetter]);
		};

		const handleCheck = () => {
			const isCorrect = assembledWord.toLowerCase() === word.text.toLowerCase();
			setHasAnswered(true);
			onComplete(isCorrect);
		};

		return (
			<div className={styles.container}>
				<div className={styles.header}>
					<h3>Уровень 5: Сборка слова из букв</h3>
					<p className={styles.description}>
						Соберите слово из букв. Подсказка: картинка и перевод.
					</p>
				</div>

				<div className={styles.exercise}>
					<div className={styles.visualSection}>
						{word.images && word.images.length > 0 && (
							<div className={styles.imageContainer}>
								<img
									src={word.images[0].url}
									alt={word.text}
									className={styles.wordImage}
								/>
							</div>
						)}
						<div className={styles.translation}>
							<h4>Перевод:</h4>
							<p>{word.translation.text}</p>
						</div>
					</div>

					<div className={styles.wordAssembly}>
						<h4>Соберите слово:</h4>
						<div className={styles.assembledWord}>
							{assembledWord || "_".repeat(word.text.length)}
						</div>
						<button
							className={styles.removeButton}
							onClick={handleRemoveLetter}
							disabled={assembledWord.length === 0 || hasAnswered}
							type="button"
						>
							← Удалить букву
						</button>
					</div>

					<div className={styles.lettersSection}>
						<h4>Доступные буквы:</h4>
						<div className={styles.letters}>
							{availableLetters.map((letter, index) => (
								<button
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={`${letter}-${index}`}
									className={styles.letterButton}
									onClick={() => handleLetterClick(letter, index)}
									disabled={hasAnswered}
									type="button"
								>
									{letter}
								</button>
							))}
						</div>
					</div>

					<div className={styles.actions}>
						<button
							className={styles.checkButton}
							onClick={handleCheck}
							disabled={assembledWord.length === 0 || hasAnswered}
							type="button"
						>
							Проверить
						</button>
					</div>

					{hasAnswered && (
						<div className={styles.result}>
							{assembledWord.toLowerCase() === word.text.toLowerCase() ? (
								<div className={styles.correct}>
									<p>Правильно! "{word.text}"</p>
								</div>
							) : (
								<div className={styles.incorrect}>
									<p>Неправильно! Правильный ответ: "{word.text}"</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	},
);

export default ExerciseLevel5;
