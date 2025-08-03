import styles from "./Navigation.module.css";

interface NavigationProps {
	activeTab: "search" | "dictionary" | "exercises";
	onTabChange: (tab: "search" | "dictionary" | "exercises") => void;
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

				<button
					className={`${styles.tab} ${activeTab === "exercises" ? styles.active : ""}`}
					onClick={() => onTabChange("exercises")}
					type="button"
				>
					<span className={styles.tabIcon}>🎯</span>
					<span className={styles.tabText}>Упражнения</span>
				</button>
			</div>
		</nav>
	);
};

export default Navigation;
