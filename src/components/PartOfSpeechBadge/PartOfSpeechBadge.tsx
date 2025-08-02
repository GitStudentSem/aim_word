import { getPartOfSpeechLabel } from "../../utils/getPartOfSpeechLabel";
import styles from "./PartOfSpeechBadge.module.css";

interface PartOfSpeechBadgeProps {
	code: string;
	className?: string;
}

const PartOfSpeechBadge: React.FC<PartOfSpeechBadgeProps> = ({
	code,
	className = "",
}) => {
	return (
		<span className={`${styles.badge} ${className}`}>
			{getPartOfSpeechLabel(code)}
		</span>
	);
};

export default PartOfSpeechBadge;
