import WordMeaning from "../WordMeaning/WordMeaning";
import styles from "./WordCard.module.css";

interface WordCardProps {
	word: {
		id: number;
		text: string;
		meanings: Array<{
			id: number;
			partOfSpeechCode: string;
			translation: {
				text: string;
				note?: string;
			};
			transcription?: string;
			soundUrl?: string;
		}>;
	};
}

const WordCard: React.FC<WordCardProps> = ({ word }) => {
	return (
		<div className={styles.wordCard}>
			<div className={styles.wordHeader}>
				<h3 className={styles.wordText}>{word.text}</h3>
				<span className={styles.wordId}>#{word.id}</span>
			</div>

			{word.meanings.map((meaning) => (
				<WordMeaning key={meaning.id} meaning={meaning} />
			))}
		</div>
	);
};

export default WordCard;
