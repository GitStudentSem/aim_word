import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { exerciseStore } from "../../stores/ExerciseStore";
import { wordStore } from "../../stores/WordStore";

import ExerciseLevel0 from "./ExerciseLevel0";
import ExerciseLevel1 from "./ExerciseLevel1";
import ExerciseLevel2 from "./ExerciseLevel2";
import ExerciseLevel3 from "./ExerciseLevel3";
import ExerciseLevel4 from "./ExerciseLevel4";
import ExerciseLevel5 from "./ExerciseLevel5";
import ExerciseLevel6 from "./ExerciseLevel6";
import ExerciseLevel7 from "./ExerciseLevel7";
import ExerciseLevel8 from "./ExerciseLevel8";
import ExerciseLevel9 from "./ExerciseLevel9";
import LevelsInfo from "../LevelsInfo/LevelsInfo";
import styles from "./Exercises.module.css";

const Exercises: React.FC = observer(() => {
	const [isLoading, setIsLoading] = useState(false);
	const [showLevelsInfo, setShowLevelsInfo] = useState(false);

	// Синхронизируем слова из WordStore с ExerciseStore
	useEffect(() => {
		wordStore.savedWords.forEach(savedWord => {
			exerciseStore.addWordToProgress(savedWord.word);
		});
	}, [wordStore.savedWords]);

	const handleStartExercise = () => {
		const success = exerciseStore.startExerciseSession(10);
		if (!success) {
			setIsLoading(false);
		}
	};

	const handleCompleteExercise = (success: boolean) => {
		exerciseStore.completeExercise(success);
	};

	const renderExercise = () => {
		const { currentExercise } = exerciseStore;
		
		if (!currentExercise.isActive || !currentExercise.currentWord) {
			return null;
		}

		const level = currentExercise.currentLevel || 0;
		const word = currentExercise.currentWord.word;

		switch (level) {
			case 0:
				return (
					<ExerciseLevel0
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 1:
				return (
					<ExerciseLevel1
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 2:
				return (
					<ExerciseLevel2
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 3:
				return (
					<ExerciseLevel3
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 4:
				return (
					<ExerciseLevel4
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 5:
				return (
					<ExerciseLevel5
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 6:
				return (
					<ExerciseLevel6
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 7:
				return (
					<ExerciseLevel7
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 8:
				return (
					<ExerciseLevel8
						word={word}
						onComplete={handleCompleteExercise}
					/>
				);
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
				return (
					<ExerciseLevel9
						word={word}
						level={level}
						onComplete={handleCompleteExercise}
					/>
				);
			default:
				return <div>Неизвестный уровень упражнения</div>;
		}
	};

	const statistics = exerciseStore.getStatistics();
	const availableWords = exerciseStore.getWordsForExercise();

	return (
		<div className={styles.exercises}>
			<div className={styles.header}>
				<div className={styles.headerTop}>
					<h2>Упражнения</h2>
					<button
						className={styles.infoButton}
						onClick={() => setShowLevelsInfo(true)}
						title="Информация об уровнях"
					>
						ℹ️
					</button>
				</div>
				<div className={styles.statistics}>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{statistics.totalWords}</span>
						<span className={styles.statLabel}>Всего слов</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{statistics.completedWords}</span>
						<span className={styles.statLabel}>Выучено</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{statistics.inProgressWords}</span>
						<span className={styles.statLabel}>В процессе</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{statistics.newWords}</span>
						<span className={styles.statLabel}>Новых</span>
					</div>
				</div>
			</div>

			{exerciseStore.currentExercise.isActive ? (
				<div className={styles.exerciseContainer}>
					{exerciseStore.currentSession && (
						<div className={styles.sessionProgress}>
							<div className={styles.progressBar}>
								<div 
									className={styles.progressFill}
									style={{ 
										width: `${(exerciseStore.currentSession.completedWords / exerciseStore.currentSession.totalWords) * 100}%` 
									}}
								/>
							</div>
							<div className={styles.progressText}>
								Слово {exerciseStore.currentSession.completedWords + 1} из {exerciseStore.currentSession.totalWords}
							</div>
						</div>
					)}
					{renderExercise()}
				</div>
			) : (
				<div className={styles.startScreen}>
					{availableWords.length > 0 ? (
						<>
							<p>Готовы к тренировке? У вас есть {availableWords.length} слов для изучения.</p>
							<p className={styles.sessionInfo}>
								Каждая тренировка включает {Math.min(10, availableWords.length)} слов подряд.
							</p>
							<button
								className={styles.startButton}
								onClick={handleStartExercise}
								disabled={isLoading}
							>
								{isLoading ? "Загрузка..." : "Начать тренировку"}
							</button>
						</>
					) : (
						<div className={styles.noWords}>
							<p>У вас пока нет слов для изучения.</p>
							<p>Добавьте слова в словарь, чтобы начать тренировку.</p>
						</div>
					)}
				</div>
			)}

			<LevelsInfo isOpen={showLevelsInfo} onClose={() => setShowLevelsInfo(false)} />
		</div>
	);
});

export default Exercises; 