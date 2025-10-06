document.addEventListener("DOMContentLoaded", function () {
	const addToCartBtn = document.getElementById("add-to-cart-btn");
	const quantityInput = document.getElementById("book-quantity");
	const btnText = document.getElementById("btn-text");
	const btnIcon = document.getElementById("btn-icon");

	if (!addToCartBtn || !quantityInput || !btnText || !btnIcon) {
		console.warn("Elementos do carrinho não encontrados na página");
		return;
	}

	// Armazenar texto original do botão
	addToCartBtn.setAttribute("data-original-text", btnText.textContent);

	addToCartBtn.addEventListener("click", async function () {
		const bookId = this.getAttribute("data-book-id");
		const bookTitle = this.getAttribute("data-book-title");
		const bookImage = this.getAttribute("data-book-image");
		const quantity = parseInt(quantityInput.value);

		if (!bookId) {
			CartUtils.showNotification("Erro: ID do livro não encontrado.", "error");
			return;
		}

		if (quantity < 1 || isNaN(quantity)) {
			CartUtils.showNotification(
				"Por favor, selecione uma quantidade válida (mínimo 1).",
				"error"
			);
			quantityInput.focus();
			return;
		}

		// Estado de loading
		CartUtils.updateButtonState(addToCartBtn, "loading", btnText, btnIcon);

		try {
			await CartUtils.addToCart(bookId, quantity);

			// Estado de sucesso
			CartUtils.updateButtonState(addToCartBtn, "success", btnText, btnIcon);
			addToCartBtn.classList.add("success-state");

			// Mostrar notificação
			CartUtils.showNotification(
				`${quantity} ${quantity === 1 ? "exemplar" : "exemplares"} adicionado${
					quantity === 1 ? "" : "s"
				} ao carrinho!`,
				"success",
				{
					bookImage: bookImage,
					bookTitle: bookTitle || "Livro",
					quantity: quantity,
				}
			);

			setTimeout(() => {
				resetButton();
			}, 2500);
		} catch (error) {
			const errorMessage = error.message.includes("fetch")
				? "Erro de conexão. Verifique sua internet e tente novamente."
				: error.message;

			CartUtils.showNotification(errorMessage, "error");
			resetButton();
		}
	});

	function resetButton() {
		CartUtils.updateButtonState(addToCartBtn, "reset", btnText, btnIcon);
		addToCartBtn.classList.remove("success-state");
	}

	quantityInput.addEventListener("input", function () {
		const value = parseInt(this.value);
		if (value < 1 || isNaN(value)) {
			this.style.borderColor = "#ef4444";
		} else {
			this.style.borderColor = "";
		}
	});

	quantityInput.addEventListener("keydown", function (e) {
		// Permitir: backspace, delete, tab, escape, enter
		if (
			[46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
			// Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
			(e.keyCode === 65 && e.ctrlKey === true) ||
			(e.keyCode === 67 && e.ctrlKey === true) ||
			(e.keyCode === 86 && e.ctrlKey === true) ||
			(e.keyCode === 88 && e.ctrlKey === true)
		) {
			return;
		}

		if (
			(e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
			(e.keyCode < 96 || e.keyCode > 105)
		) {
			e.preventDefault();
		}
	});
});
