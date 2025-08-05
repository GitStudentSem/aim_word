import { observer } from "mobx-react-lite";
import styles from "./RememberOrNotButtons.module.css";

interface RememberOrNotProps {
	userAnswer: boolean | null;
	handleAnswer: (answer: boolean) => void;
	hasAnswered: boolean;
}

export const RememberOrNotButtons: React.FC<RememberOrNotProps> = observer(
	({ userAnswer, handleAnswer, hasAnswered }) => {
		return (
			<div className={styles.question}>
				<h4>Узнаёте ли вы это слово?</h4>

				<div className={styles.answerButtons}>
					<button
						className={`${styles.answerButton} ${styles.rememberButton} ${
							userAnswer ? styles.selected : ""
						}`}
						onClick={() => handleAnswer(true)}
						disabled={hasAnswered}
						type="button"
					>
						Помню
					</button>

					<button
						className={`${styles.answerButton} ${styles.dontRememberButton} ${
							!userAnswer ? styles.selected : ""
						}`}
						onClick={() => handleAnswer(false)}
						disabled={hasAnswered}
						type="button"
					>
						Не помню
					</button>
				</div>
			</div>
		);
	},
);
