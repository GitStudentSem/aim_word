import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import SoundButton from "../SoundButton/SoundButton";
import styles from "./ExerciseLevel1.module.css";

interface ExerciseLevel1Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
}

const ExerciseLevel1: React.FC<ExerciseLevel1Props> = observer(({
	word,
	onComplete,
}) => {
	const [hasAnswered, setHasAnswered] = useState(false);
	const [userAnswer, setUserAnswer] = useState<boolean | null>(null);

	const handleAnswer = (answer: boolean) => {
		setUserAnswer(answer);
		setHasAnswered(true);
	};

	const handleContinue = () => {
		onComplete(userAnswer === true);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3>Уровень 1: Узнавание по звуку</h3>
				<p className={styles.description}>
					Прослушайте слово и определите, узнаёте ли вы его.
				</p>
			</div>

			<div className={styles.exercise}>
				<div className={styles.soundSection}>
					<h4>Прослушайте слово:</h4>
					{word.soundUrl && (
						<div className={styles.soundButton}>
							<SoundButton soundUrl={word.soundUrl} />
						</div>
					)}
				</div>

				<div className={styles.question}>
					<h4>Узнаёте ли вы это слово?</h4>
					<div className={styles.answerButtons}>
						<button
							className={`${styles.answerButton} ${styles.rememberButton} ${
								userAnswer === true ? styles.selected : ""
							}`}
							onClick={() => handleAnswer(true)}
							disabled={hasAnswered}
						>
							Помню
						</button>
						<button
							className={`${styles.answerButton} ${styles.dontRememberButton} ${
								userAnswer === false ? styles.selected : ""
							}`}
							onClick={() => handleAnswer(false)}
							disabled={hasAnswered}
						>
							Не помню
						</button>
					</div>
				</div>

				{hasAnswered && (
					<div className={styles.result}>
						{userAnswer ? (
							<div className={styles.correct}>
								<p>Отлично! Вы узнали слово "{word.text}".</p>
							</div>
						) : (
							<div className={styles.incorrect}>
								<p>Правильный ответ: "{word.text}"</p>
								<p>Перевод: {word.translation.text}</p>
							</div>
						)}
						<button
							className={styles.continueButton}
							onClick={handleContinue}
						>
							Продолжить
						</button>
					</div>
				)}
			</div>
		</div>
	);
});

export default ExerciseLevel1; 