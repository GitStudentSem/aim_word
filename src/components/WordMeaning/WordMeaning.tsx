import SoundButton from "../SoundButton/SoundButton";
import AddWordButton from "../AddWordButton/AddWordButton";
import PartOfSpeechBadge from "../PartOfSpeechBadge/PartOfSpeechBadge";
import styles from "./WordMeaning.module.css";

interface WordMeaningProps {
	meaning: {
		id: number;
		partOfSpeechCode: string;
		translation: {
			text: string;
			note?: string;
		};
		transcription?: string;
		soundUrl?: string;
	};
}

const WordMeaning: React.FC<WordMeaningProps> = ({ meaning }) => {
	return (
		<div className={styles.meaningItem}>
			<div className={styles.meaningHeader}>
				<PartOfSpeechBadge code={meaning.partOfSpeechCode} />
				{meaning.transcription && (
					<span className={styles.transcription}>
						[{meaning.transcription}]
					</span>
				)}
			</div>

			<div className={styles.translation}>
				{meaning.translation.text}
				{meaning.translation.note && (
					<span className={styles.note}> — {meaning.translation.note}</span>
				)}
			</div>

			<div className={styles.actions}>
				<SoundButton soundUrl={meaning.soundUrl || ""} size="medium" />
				<AddWordButton meaningId={meaning.id} />
			</div>
		</div>
	);
};

export default WordMeaning;
