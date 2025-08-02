import { observer } from "mobx-react-lite";
import { wordStore } from "../../stores/WordStore";
import styles from "./AddWordButton.module.css";

interface AddWordButtonProps {
	meaningId: number;
	className?: string;
}

const AddWordButton: React.FC<AddWordButtonProps> = ({
	meaningId,
	className = "",
}) => {
	const isSaved = wordStore.isWordSaved(meaningId.toString());

	const handleAddWord = async () => {
		await wordStore.addWordToDictionary(meaningId);
	};

	return (
		<button
			className={`${styles.addButton} ${isSaved ? styles.added : ""} ${className}`}
			onClick={handleAddWord}
			disabled={isSaved}
			type="button"
		>
			{isSaved ? "✓ Добавлено" : "+ Добавить"}
		</button>
	);
};

export default observer(AddWordButton);
