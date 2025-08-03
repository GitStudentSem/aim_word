import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { exerciseStore } from "../../stores/ExerciseStore";
import SoundButton from "../SoundButton/SoundButton";
import styles from "./ExerciseLevel3.module.css";

interface ExerciseLevel3Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
}

const ExerciseLevel3: React.FC<ExerciseLevel3Props> = observer(
	({ word, onComplete }) => {
		const [options, setOptions] = useState<string[]>([]);
		const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
		const [hasAnswered, setHasAnswered] = useState(false);
		const [isLoading, setIsLoading] = useState(true);

		useEffect(() => {
			const generateOptions = async () => {
				setIsLoading(true);
				try {
					// Получаем случайные слова для вариантов ответов
					const randomWords = await exerciseStore.getRandomWordsForOptions(2);

					// Создаем варианты ответов
					const correctAnswer = word.translation.text;
					const wrongAnswers = randomWords.slice(0, 2);

					// Перемешиваем варианты
					const allOptions = [correctAnswer, ...wrongAnswers];
					const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

					setOptions(shuffledOptions);
				} catch (error) {
					console.error("Error generating options:", error);
					// Fallback варианты
					setOptions([word.translation.text, "счастливый", "большой"]);
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
			const isCorrect = selectedAnswer === word.translation.text;
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
				<div className={styles.header}>
					<h3>Уровень 3: Выбор правильного перевода</h3>
					<p className={styles.description}>
						Прослушайте слово и выберите правильный перевод.
					</p>
				</div>

				<div className={styles.exercise}>
					<div className={styles.wordSection}>
						<h4>Слово:</h4>
						<div className={styles.wordDisplay}>
							<span className={styles.wordText}>{word.text}</span>
							{word.soundUrl && <SoundButton soundUrl={word.soundUrl} />}
						</div>
					</div>

					<div className={styles.question}>
						<h4>Выберите правильный перевод:</h4>
						<div className={styles.options}>
							{options.map((option) => (
								<button
									key={option}
									className={`${styles.optionButton} ${
										selectedAnswer === option ? styles.selected : ""
									} ${
										hasAnswered && option === word.translation.text
											? styles.correct
											: ""
									} ${
										hasAnswered &&
										selectedAnswer === option &&
										option !== word.translation.text
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
							{selectedAnswer === word.translation.text ? (
								<div className={styles.correct}>
									<p>
										Правильно! "{word.text}" = "{word.translation.text}"
									</p>
								</div>
							) : (
								<div className={styles.incorrect}>
									<p>
										Неправильно! Правильный ответ: "{word.translation.text}"
									</p>
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

export default ExerciseLevel3;
