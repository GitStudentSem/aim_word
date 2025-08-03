import { observer } from "mobx-react-lite";
import PartOfSpeechBadge from "../PartOfSpeechBadge/PartOfSpeechBadge";
import SoundButton from "../SoundButton/SoundButton";
import styles from "./ExerciseCard.module.css";

interface ExerciseCardProps {
	word: IWordById;
	showImage?: boolean;
	showTranslation?: boolean;
	showTranscription?: boolean;
	showDefinition?: boolean;
	showExamples?: boolean;
	showMnemonics?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = observer(
	({
		word,
		showImage = true,
		showTranslation = true,
		showTranscription = true,
		showDefinition = false,
		showExamples = false,
		showMnemonics = false,
	}) => {
		return (
			<div className={styles.card}>
				<div className={styles.header}>
					<div className={styles.wordInfo}>
						<h3 className={styles.wordText}>{word.text}</h3>
						{showTranscription && word.transcription && (
							<span className={styles.transcription}>
								[{word.transcription}]
							</span>
						)}
						<PartOfSpeechBadge code={word.partOfSpeechCode} />
					</div>
					{word.soundUrl && <SoundButton soundUrl={word.soundUrl} />}
				</div>

				{showImage && word.images && word.images.length > 0 && (
					<div className={styles.imageContainer}>
						<img
							src={word.images[0].url}
							alt={word.text}
							className={styles.wordImage}
						/>
					</div>
				)}

				{showTranslation && (
					<div className={styles.translation}>
						<h4>Перевод:</h4>
						<p>{word.translation.text}</p>
						{word.translation.note && (
							<p className={styles.note}>{word.translation.note}</p>
						)}
					</div>
				)}

				{showDefinition && word.definition && (
					<div className={styles.definition}>
						<h4>Определение:</h4>
						<p>{word.definition.text}</p>
						{word.definition.soundUrl && (
							<SoundButton soundUrl={word.definition.soundUrl} />
						)}
					</div>
				)}

				{showExamples && word.examples && word.examples.length > 0 && (
					<div className={styles.examples}>
						<h4>Примеры:</h4>
						{word.examples.map((example) => (
							<div key={example.text} className={styles.example}>
								<p>{example.text}</p>
								{example.soundUrl && (
									<SoundButton soundUrl={example.soundUrl} />
								)}
							</div>
						))}
					</div>
				)}

				{showMnemonics && word.mnemonics && (
					<div className={styles.mnemonics}>
						<h4>Мнемоника:</h4>
						<p>{word.mnemonics}</p>
					</div>
				)}

				{word.alternativeTranslations &&
					word.alternativeTranslations.length > 0 && (
						<div className={styles.alternatives}>
							<h4>Альтернативные переводы:</h4>
							{word.alternativeTranslations.map((alt, index) => (
								<div
									key={`${alt.text}-${index}`}
									className={styles.alternative}
								>
									<strong>{alt.text}</strong> — {alt.translation.text}
									{alt.translation.note && (
										<span className={styles.note}>
											{" "}
											({alt.translation.note})
										</span>
									)}
								</div>
							))}
						</div>
					)}
			</div>
		);
	},
);

export default ExerciseCard;
