import React from "react";
import { levels } from "../../utils/levels";
import styles from "./LevelsInfo.module.css";

interface LevelsInfoProps {
	isOpen: boolean;
	onClose: () => void;
}

const LevelsInfo: React.FC<LevelsInfoProps> = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Система уровней изучения</h2>
					<button className={styles.closeButton} onClick={onClose}>
						×
					</button>
				</div>

				<div className={styles.content}>
					<div className={styles.intro}>
						<p>
							Слова изучаются по 14 уровням, от простого к сложному. 
							За каждый правильный ответ вы переходите на следующий уровень, 
							за неправильный — возвращаетесь на предыдущий.
						</p>
					</div>

					<div className={styles.levels}>
						{levels.map((level) => (
							<div key={level.level} className={styles.levelItem}>
								<div className={styles.levelHeader}>
									<span className={styles.levelNumber}>Уровень {level.level}</span>
									{level.level === 0 && (
										<span className={styles.levelType}>Ознакомление</span>
									)}
									{level.level >= 1 && level.level <= 8 && (
										<span className={styles.levelType}>Активное изучение</span>
									)}
									{level.level >= 9 && level.level <= 13 && (
										<span className={styles.levelType}>Интервальное повторение</span>
									)}
								</div>
								<p className={styles.levelDescription}>{level.description}</p>
							</div>
						))}
					</div>

					<div className={styles.summary}>
						<h3>Как это работает:</h3>
						<ul>
							<li><strong>Уровни 0-8:</strong> Активное изучение с постепенным усложнением</li>
							<li><strong>Уровни 9-13:</strong> Интервальные повторения для закрепления в долгосрочной памяти</li>
							<li><strong>Уровень 13:</strong> Слово считается выученным</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LevelsInfo; 