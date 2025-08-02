import styles from "./Navigation.module.css";

interface NavigationProps {
	activeTab: "search" | "dictionary";
	onTabChange: (tab: "search" | "dictionary") => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
	return (
		<nav className={styles.navigation}>
			<div className={styles.tabs}>
				<button
					className={`${styles.tab} ${activeTab === "search" ? styles.active : ""}`}
					onClick={() => onTabChange("search")}
					type="button"
				>
					<span className={styles.tabIcon}>🔍</span>
					<span className={styles.tabText}>Поиск</span>
				</button>

				<button
					className={`${styles.tab} ${activeTab === "dictionary" ? styles.active : ""}`}
					onClick={() => onTabChange("dictionary")}
					type="button"
				>
					<span className={styles.tabIcon}>📚</span>
					<span className={styles.tabText}>Словарь</span>
				</button>
			</div>
		</nav>
	);
};

export default Navigation;
