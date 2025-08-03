import { useState } from "react";
import Navigation from "./components/Navigation/Navigation";
import SavedWords from "./components/SavedWords/SavedWords";
import SearchInput from "./components/SearchInput/SearchInput";
import Exercises from "./components/Exercises/Exercises";
import "./App.module.css";

const App: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"search" | "dictionary" | "exercises">("search");

	return (
		<div className="app">
			<Navigation activeTab={activeTab} onTabChange={setActiveTab} />

			<main className="main">
				{activeTab === "search" && <SearchInput />}
				{activeTab === "dictionary" && <SavedWords />}
				{activeTab === "exercises" && <Exercises />}
			</main>
		</div>
	);
};

export default App;
