import { observer } from "mobx-react-lite";
import { useState } from "react";
import { LevelBadge } from "../LevelBadge/LevelBadge";
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

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			if (!userInput.trim()) return;

			const isCorrect =
				userInput.toLowerCase().trim() === word.text.toLowerCase();
			setHasAnswered(true);
			onComplete(isCorrect);
		};

		return (
			<div className={styles.container}>
				<LevelBadge level={level} />

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
