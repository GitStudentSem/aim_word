import styles from "./SearchField.module.css";

interface SearchFieldProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	isLoading?: boolean;
	className?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({
	value,
	onChange,
	placeholder = "Введите слово для поиска...",
	isLoading = false,
	className = "",
}) => {
	return (
		<div className={`${styles.searchContainer} ${className}`}>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={styles.searchInput}
			/>
			{isLoading && <div className={styles.loading}>Поиск...</div>}
		</div>
	);
};

export default SearchField;
