import { observer } from "mobx-react-lite";
import { useState } from "react";
import SoundButton from "../SoundButton/SoundButton";
import styles from "./ExerciseLevel7.module.css";
import { LevelBadge } from "../LevelBadge/LevelBadge";

interface ExerciseLevel7Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
	level: number;
}

const ExerciseLevel7: React.FC<ExerciseLevel7Props> = observer(
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

					<div className={styles.translationSection}>
						<h4>Перевод:</h4>
						<p>{word.translation.text}</p>
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

export default ExerciseLevel7;
