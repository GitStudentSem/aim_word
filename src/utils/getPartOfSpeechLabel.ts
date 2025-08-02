export const getPartOfSpeechLabel = (code: string): string => {
	const labels: Record<string, string> = {
		n: "сущ.",
		v: "глаг.",
		j: "прил.",
		r: "нареч.",
		prp: "предл.",
		prn: "местоим.",
		crd: "числ.",
		cjc: "союз",
		exc: "междом.",
		det: "артикль",
		abb: "сокр.",
		x: "частица",
		ord: "порядк. числ.",
		md: "модальный глаг.",
		ph: "фраза",
		phi: "идиома",
	};
	return labels[code] || code;
};
