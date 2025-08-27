let currentSlide = 0;
const booksContainer = document.getElementById("bookContainer");
let books = [];
let totalSlides = 0;

if (booksContainer && booksContainer.dataset.books) {
	books = JSON.parse(booksContainer.dataset.books);
	totalSlides = Math.ceil(books.length / 2);
}

function goToSlide(slideIndex) {
	slideIndex = parseInt(slideIndex);

	if (slideIndex < 0 || slideIndex >= totalSlides) {
		console.warn(
			`Slide ${slideIndex} não existe. Total de slides: ${totalSlides}`
		);
		return;
	}

	currentSlide = slideIndex;
	const track = document.getElementById("bookCarousel");

	if (!track) {
		console.error("Elemento bookCarousel não encontrado");
		return;
	}

	const translateX = -slideIndex * 100;
	track.style.transform = `translateX(${translateX}%)`;
	updateDots();
}

function updateDots() {
	const dots = document.querySelectorAll(".carousel-dot, [data-slide]");

	dots.forEach((dot, index) => {
		dot.classList.remove("active", "inactive", "bg-light-title", "bg-gray");

		if (index === currentSlide) {
			dot.classList.add("active", "bg-light-title");
		} else {
			dot.classList.add("inactive", "bg-gray");
		}
	});
}

let autoPlay = null;
if (totalSlides > 1) {
	autoPlay = setInterval(() => {
		const nextSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
		goToSlide(nextSlide);
	}, 4000);
}

const carouselDots = document.getElementById("carouselDots");
if (carouselDots) {
	carouselDots.addEventListener("click", () => {
		if (autoPlay) {
			clearInterval(autoPlay);
			autoPlay = null;
		}
	});
}

document.addEventListener("DOMContentLoaded", function () {
	if (totalSlides > 0) {
		updateDots();
	}
});
