import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import styles from "./ExerciseLevel6.module.css";

interface ExerciseLevel6Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
}

const ExerciseLevel6: React.FC<ExerciseLevel6Props> = observer(({
	word,
	onComplete,
}) => {
	const [userInput, setUserInput] = useState("");
	const [hasAnswered, setHasAnswered] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userInput.trim()) return;
		
		const isCorrect = userInput.toLowerCase().trim() === word.text.toLowerCase();
		setHasAnswered(true);
		onComplete(isCorrect);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3>Уровень 6: Ввод слова по картинке и переводу</h3>
				<p className={styles.description}>
					Введите английское слово, глядя на картинку и русский перевод.
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

				<form onSubmit={handleSubmit} className={styles.inputSection}>
					<h4>Введите английское слово:</h4>
					<input
						type="text"
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						placeholder="Введите слово..."
						className={styles.wordInput}
						disabled={hasAnswered}
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
});

export default ExerciseLevel6; 