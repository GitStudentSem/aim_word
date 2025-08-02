import { observer } from "mobx-react-lite";
import type { FC } from "react";
import { searchMeaningsStore } from "../../store/SearchMeaningsStore";

export const MeaningsList: FC = observer(() => {
	const { meanings } = searchMeaningsStore;
	if (!meanings) return null;
	return (
		<ul>
			{meanings.map((meaning) => {
				return (
					<li key={meaning.id}>
						{meaning.meanings.map((meaning) => {
							return <div key={meaning.id}>{meaning.translation.text}</div>;
						})}
					</li>
				);
			})}
		</ul>
	);
});
