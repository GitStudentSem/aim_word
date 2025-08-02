import styles from "./SoundButton.module.css";

interface SoundButtonProps {
	soundUrl: string;
	className?: string;
	size?: "small" | "medium" | "large";
	disabled?: boolean;
}

const SoundButton: React.FC<SoundButtonProps> = ({
	soundUrl,
	className = "",
	size = "medium",
	disabled = false,
}) => {
	const handlePlay = () => {
		if (disabled || !soundUrl) return;

		try {
			const audio = new Audio(soundUrl);
			audio.play().catch((error) => {
				console.error("Error playing audio:", error);
			});
		} catch (error) {
			console.error("Error creating audio:", error);
		}
	};

	if (!soundUrl) {
		return null;
	}

	return (
		<button
			className={`${styles.soundButton} ${styles[size]} ${className}`}
			onClick={handlePlay}
			disabled={disabled}
			type="button"
			title="Воспроизвести звук"
		>
			🔊
		</button>
	);
};

export default SoundButton;
