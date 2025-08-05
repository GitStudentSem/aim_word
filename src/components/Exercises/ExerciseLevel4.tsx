import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { exerciseStore } from "../../stores/ExerciseStore";
import styles from "./ExerciseLevel4.module.css";
import { LevelBadge } from "../LevelBadge/LevelBadge";

interface ExerciseLevel4Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
	level: number;
}

const ExerciseLevel4: React.FC<ExerciseLevel4Props> = observer(
	({ word, level, onComplete }) => {
		const [options, setOptions] = useState<string[]>([]);
		const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
		const [hasAnswered, setHasAnswered] = useState(false);
		const [isLoading, setIsLoading] = useState(true);

		useEffect(() => {
			const generateOptions = async () => {
				setIsLoading(true);
				try {
					const randomWords = await exerciseStore.getRandomWordsForOptions(2);
					const correctAnswer = word.text;
					const wrongAnswers = randomWords.slice(0, 2);

					const allOptions = [correctAnswer, ...wrongAnswers];
					const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

					setOptions(shuffledOptions);
				} catch (error) {
					console.error("Error generating options:", error);
					setOptions([word.text, "happy", "big"]);
				} finally {
					setIsLoading(false);
				}
			};

			generateOptions();
		}, [word]);

		const handleAnswer = (answer: string) => {
			setSelectedAnswer(answer);
			setHasAnswered(true);
		};

		const handleContinue = () => {
			const isCorrect = selectedAnswer === word.text;
			onComplete(isCorrect);
		};

		if (isLoading) {
			return (
				<div className={styles.container}>
					<div className={styles.loading}>Загрузка упражнения...</div>
				</div>
			);
		}

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
							<h4>Перевод:</h4>
							<p>{word.translation.text}</p>
						</div>
						{word.definition && (
							<div className={styles.definition}>
								<h4>Описание:</h4>
								<p>{word.definition.text}</p>
							</div>
						)}
					</div>

					<div className={styles.question}>
						<h4>Выберите правильное английское слово:</h4>
						<div className={styles.options}>
							{options.map((option) => (
								<button
									key={option}
									className={`${styles.optionButton} ${
										selectedAnswer === option ? styles.selected : ""
									} ${
										hasAnswered && option === word.text ? styles.correct : ""
									} ${
										hasAnswered &&
										selectedAnswer === option &&
										option !== word.text
											? styles.incorrect
											: ""
									}`}
									onClick={() => handleAnswer(option)}
									disabled={hasAnswered}
									type="button"
								>
									{option}
								</button>
							))}
						</div>
					</div>

					{hasAnswered && (
						<div className={styles.result}>
							{selectedAnswer === word.text ? (
								<div className={styles.correct}>
									<p>
										Правильно! "{word.text}" = "{word.translation.text}"
									</p>
								</div>
							) : (
								<div className={styles.incorrect}>
									<p>Неправильно! Правильный ответ: "{word.text}"</p>
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

export default ExerciseLevel4;
