import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import styles from "./ExerciseLevel2.module.css";

interface ExerciseLevel2Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
}

const ExerciseLevel2: React.FC<ExerciseLevel2Props> = observer(({
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
				<h3>Уровень 2: Узнавание по картинке и переводу</h3>
				<p className={styles.description}>
					Посмотрите на картинку и перевод. Узнаёте ли вы это слово?
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
						{word.translation.note && (
							<p className={styles.note}>{word.translation.note}</p>
						)}
					</div>
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
								<p>Транскрипция: [{word.transcription}]</p>
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

export default ExerciseLevel2; 