import { observer } from "mobx-react-lite";
import { useState } from "react";
import { RememberOrNotButtons } from "../RememberOrNotButtons/RememberOrNotButtons";
import SoundButton from "../SoundButton/SoundButton";
import styles from "./ExerciseLevel1.module.css";
import { LevelBadge } from "../LevelBadge/LevelBadge";

interface ExerciseLevel1Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
	level: number;
}

const ExerciseLevel1: React.FC<ExerciseLevel1Props> = observer(
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
					<div className={styles.soundSection}>
						<h4>Прослушайте слово:</h4>
						{word.soundUrl && (
							<div className={styles.soundButton}>
								<SoundButton soundUrl={word.soundUrl} />
							</div>
						)}
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
									<p>Перевод: {word.translation.text}</p>
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

export default ExerciseLevel1;
