import { observer } from "mobx-react-lite";
import ExerciseCard from "./ExerciseCard";
import styles from "./ExerciseLevel0.module.css";
import { LevelBadge } from "../LevelBadge/LevelBadge";

interface ExerciseLevel0Props {
	word: IWordById;
	onComplete: (success: boolean) => void;
	level: number;
}

const ExerciseLevel0: React.FC<ExerciseLevel0Props> = observer(
	({ word, level, onComplete }) => {
		const handleContinue = () => {
			onComplete(true);
		};

		return (
			<div className={styles.container}>
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
						type="button"
					>
						Продолжить
					</button>
				</div>
			</div>
		);
	},
);

export default ExerciseLevel0;
