import { observer } from "mobx-react-lite";
import { useState } from "react";
import { RememberOrNotButtons } from "../RememberOrNotButtons/RememberOrNotButtons";
import styles from "./ExerciseLevel2.module.css";
import { LevelBadge } from "../LevelBadge/LevelBadge";

interface ExerciseLevel2Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
	level: number;
}

const ExerciseLevel2: React.FC<ExerciseLevel2Props> = observer(
	({ word, level, onComplete }) => {
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
				<LevelBadge level={level} />

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
							<h4>{word.translation.text}</h4>
							{word.translation.note && (
								<p className={styles.note}>{word.translation.note}</p>
							)}
						</div>
					</div>

					<RememberOrNotButtons
						userAnswer={userAnswer}
						handleAnswer={handleAnswer}
						hasAnswered={hasAnswered}
					/>

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
								type="button"
							>
								Продолжить
							</button>
						</div>
					)}
				</div>
			</div>
		);
	},
);

export default ExerciseLevel2;
