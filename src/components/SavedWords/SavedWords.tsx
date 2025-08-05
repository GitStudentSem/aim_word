import { observer } from "mobx-react-lite";
import { useState } from "react";
import { exerciseStore } from "../../stores/ExerciseStore";
import { wordStore } from "../../stores/WordStore";
import { getPartOfSpeechLabel } from "../../utils/getPartOfSpeechLabel";
import { LevelBadge } from "../LevelBadge/LevelBadge";
import SoundButton from "../SoundButton/SoundButton";
import styles from "./SavedWords.module.css";

const SavedWords: React.FC = () => {
	const [expandedWord, setExpandedWord] = useState<string | null>(null);

	const toggleExpanded = (wordId: string) => {
		setExpandedWord(expandedWord === wordId ? null : wordId);
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("ru-RU", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	if (wordStore.savedWords.length === 0) {
		return (
			<div className={styles.emptyState}>
				<div className={styles.emptyIcon}>📚</div>
				<h3>Ваш словарь пуст</h3>
				<p>Найдите и добавьте слова, чтобы они появились здесь</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>Мой словарь</h2>
				<span className={styles.count}>{wordStore.savedWords.length} слов</span>
			</div>

			<div className={styles.wordsList}>
				{wordStore.savedWords.map((savedWord) => (
					<div key={savedWord.id} className={styles.wordCard}>
						<div className={styles.wordHeader}>
							<div className={styles.wordInfo}>
								<h3 className={styles.wordText}>{savedWord.word.text}</h3>
								<span className={styles.partOfSpeech}>
									{getPartOfSpeechLabel(savedWord.word.partOfSpeechCode)}
								</span>
								{savedWord.word.transcription && (
									<span className={styles.transcription}>
										[{savedWord.word.transcription}]
									</span>
								)}
								{(() => {
									const progress = exerciseStore.wordProgress.find(
										(wp) => wp.wordId === savedWord.id,
									);
									if (progress) {
										return <LevelBadge level={progress.currentLevel} />;
									}
									return <LevelBadge />;
								})()}
							</div>

							<div className={styles.wordActions}>
								<SoundButton soundUrl={savedWord.word.soundUrl} size="small" />

								<button
									className={styles.expandButton}
									onClick={() => toggleExpanded(savedWord.id)}
									type="button"
								>
									{expandedWord === savedWord.id ? "−" : "+"}
								</button>

								<button
									className={styles.removeButton}
									onClick={async () => {
										await wordStore.removeWordFromDictionary(savedWord.id);
									}}
									type="button"
								>
									🗑️
								</button>
							</div>
						</div>

						<div className={styles.basicInfo}>
							<div className={styles.translation}>
								{savedWord.word.translation.text}
								{savedWord.word.translation.note && (
									<span className={styles.note}>
										{" "}
										— {savedWord.word.translation.note}
									</span>
								)}
							</div>
							<div className={styles.addedDate}>
								Добавлено: {formatDate(savedWord.addedAt)}
							</div>
						</div>

						{expandedWord === savedWord.id && (
							<div className={styles.expandedContent}>
								{savedWord.word.definition && (
									<div className={styles.section}>
										<h4>Определение</h4>
										<p>{savedWord.word.definition.text}</p>
									</div>
								)}

								{savedWord.word.examples &&
									savedWord.word.examples.length > 0 && (
										<div className={styles.section}>
											<h4>Примеры</h4>
											<div className={styles.examples}>
												{savedWord.word.examples.map((example) => (
													<div key={example.text} className={styles.example}>
														<p>{example.text}</p>
														<SoundButton
															soundUrl={example.soundUrl}
															size="small"
														/>
													</div>
												))}
											</div>
										</div>
									)}

								{savedWord.word.images && savedWord.word.images.length > 0 && (
									<div className={styles.section}>
										<h4>Изображения</h4>
										<div className={styles.images}>
											{savedWord.word.images.map((image) => (
												<img
													key={image.url}
													src={image.url}
													alt={savedWord.word.text}
													className={styles.wordImage}
												/>
											))}
										</div>
									</div>
								)}

								{savedWord.word.alternativeTranslations &&
									savedWord.word.alternativeTranslations.length > 0 && (
										<div className={styles.section}>
											<h4>Альтернативные переводы</h4>
											<div className={styles.alternatives}>
												{savedWord.word.alternativeTranslations.map(
													(alt, index) => (
														<div
															key={`${alt.text}-${index}`}
															className={styles.alternative}
														>
															<strong>{alt.text}</strong> —{" "}
															{alt.translation.text}
															{alt.translation.note && (
																<span className={styles.note}>
																	{" "}
																	({alt.translation.note})
																</span>
															)}
														</div>
													),
												)}
											</div>
										</div>
									)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default observer(SavedWords);
