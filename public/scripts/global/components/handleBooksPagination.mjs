const bookContainer = document.getElementById("bookContainer");
const nextPageBtn = document.getElementById("nextPage");
const prevPageBtn = document.getElementById("prevPage");
let page =
	parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

const books = JSON.parse(bookContainer.dataset.books);
const pageSize = books.length;

if (page > 1) {
	prevPageBtn.removeAttribute("hidden");
}

if (pageSize === 0 || pageSize < 6) {
	nextPageBtn.setAttribute("hidden", "true");
}

function goToPage(newPage) {
	const url = new URL(window.location.href);
	url.searchParams.set("page", newPage);
	window.location.href = url.toString();
}

nextPageBtn.addEventListener("click", () => {
	goToPage(page + 1);
});

prevPageBtn.addEventListener("click", () => {
	if (page > 1) {
		goToPage(page - 1);
	}
});
