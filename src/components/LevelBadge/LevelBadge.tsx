import type { FC } from "react";
import styles from "./LevelBadge.module.css";

interface LevelBadgeProps {
	level?: number;
}
export const LevelBadge: FC<LevelBadgeProps> = ({ level = "новый" }) => {
	return <span className={styles.levelBadge}>Уровень: {level}</span>;
};
