function getCategoryStyles(category) {
	const styleMap = {
		"Literatura Clássica": {
			bg: "bg-amber-100",
			text: "text-amber-700",
			border: "border-amber-200",
		},
		"Romance Contemporâneo": {
			bg: "bg-pink-100",
			text: "text-pink-700",
			border: "border-pink-200",
		},
		"Fantasia Épica": {
			bg: "bg-purple-100",
			text: "text-purple-700",
			border: "border-purple-200",
		},
		"Romance Paranormal": {
			bg: "bg-gray-100",
			text: "text-gray-700",
			border: "border-gray-200",
		},
		"Romance Dramático": {
			bg: "bg-red-100",
			text: "text-red-700",
			border: "border-red-200",
		},
		"Ficção Distópica": {
			bg: "bg-slate-100",
			text: "text-slate-700",
			border: "border-slate-200",
		},
		"Literatura Infantojuvenil": {
			bg: "bg-blue-100",
			text: "text-blue-700",
			border: "border-blue-200",
		},
		"Literatura Brasileira": {
			bg: "bg-green-100",
			text: "text-green-700",
			border: "border-green-200",
		},
		"Realismo Mágico": {
			bg: "bg-indigo-100",
			text: "text-indigo-700",
			border: "border-indigo-200",
		},
		"Literatura Americana": {
			bg: "bg-cyan-100",
			text: "text-cyan-700",
			border: "border-cyan-200",
		},
		"Romance Clássico": {
			bg: "bg-rose-100",
			text: "text-rose-700",
			border: "border-rose-200",
		},
		"Literatura Moderna": {
			bg: "bg-teal-100",
			text: "text-teal-700",
			border: "border-teal-200",
		},
		"Literatura Francesa": {
			bg: "bg-emerald-100",
			text: "text-emerald-700",
			border: "border-emerald-200",
		},
		"Teatro Clássico": {
			bg: "bg-orange-100",
			text: "text-orange-700",
			border: "border-orange-200",
		},
		"Literatura Russa": {
			bg: "bg-red-100",
			text: "text-red-700",
			border: "border-red-200",
		},
	};

	return (
		styleMap[category] || {
			bg: "bg-gray-100",
			text: "text-gray-700",
			border: "border-gray-200",
		}
	);
}

function getCategoryIcon(category) {
	const iconMap = {
		"Literatura Clássica": "auto_stories",
		"Romance Contemporâneo": "favorite",
		"Fantasia Épica": "sword",
		"Romance Paranormal": "psychology",
		"Romance Dramático": "theater_comedy",
		"Ficção Distópica": "visibility",
		"Literatura Infantojuvenil": "child_care",
		"Literatura Brasileira": "flag",
		"Realismo Mágico": "auto_awesome",
		"Literatura Americana": "outlined_flag",
		"Romance Clássico": "favorite_border",
		"Literatura Moderna": "schedule",
		"Literatura Francesa": "local_cafe",
		"Teatro Clássico": "theater_comedy",
		"Literatura Russa": "landscape",
	};
	return iconMap[category] || "book";
}

function applyCategoryStyles() {
	const span = document.getElementById("tag-span");
	const iconSpan = document.getElementById("tag-category-icon");

	if (!span || !iconSpan) {
		console.warn("Elementos tag-span ou tag-category-icon não encontrados");
		return;
	}

	const activeCategory = span.dataset.cat;
	if (!activeCategory) {
		console.warn("Atributo data-cat não encontrado no elemento tag-span");
		return;
	}

	const styles = getCategoryStyles(activeCategory);

	span.classList.add(styles.bg, styles.text, styles.border);

	iconSpan.innerHTML = getCategoryIcon(activeCategory);
}

document.addEventListener("DOMContentLoaded", function () {
	applyCategoryStyles();
});
