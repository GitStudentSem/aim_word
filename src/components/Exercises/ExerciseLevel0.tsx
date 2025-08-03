import React from "react";
import { observer } from "mobx-react-lite";
import ExerciseCard from "./ExerciseCard";
import styles from "./ExerciseLevel0.module.css";

interface ExerciseLevel0Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
}

const ExerciseLevel0: React.FC<ExerciseLevel0Props> = observer(({
	word,
	onComplete,
}) => {


	const handleContinue = () => {
		onComplete(true);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3>Уровень 0: Ознакомление</h3>
				<p className={styles.description}>
					Изучите карточку слова. Обратите внимание на произношение, перевод, примеры и мнемонику.
				</p>
			</div>

			<ExerciseCard
				word={word}
				showImage={true}
				showTranslation={true}
				showTranscription={true}
				showDefinition={true}
				showExamples={true}
				showMnemonics={true}
			/>

			<div className={styles.actions}>
				<button
					className={styles.continueButton}
					onClick={handleContinue}
				>
					Продолжить
				</button>
			</div>
		</div>
	);
});

export default ExerciseLevel0; 