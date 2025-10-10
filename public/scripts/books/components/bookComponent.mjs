document.addEventListener("DOMContentLoaded", function () {
	// Event delegation para botões de adicionar ao carrinho nos componentes
	document.addEventListener("click", async function (e) {
		if (e.target.closest(".add-to-cart-component-btn")) {
			const button = e.target.closest(".add-to-cart-component-btn");
			const bookId = button.getAttribute("data-book-id");
			const bookTitle = button.getAttribute("data-book-title");
			const bookImage = button.getAttribute("data-book-image");

			const btnText = button.querySelector(".btn-text");
			const btnIcon = button.querySelector(".btn-icon");

			if (!bookId) {
				CartUtils.showNotification(
					"Erro: ID do livro não encontrado.",
					"error"
				);
				return;
			}

			// Armazenar texto original do botão
			if (!button.getAttribute("data-original-text")) {
				button.setAttribute("data-original-text", btnText.textContent);
			}

			// Estado de loading
			CartUtils.updateButtonState(button, "loading", btnText, btnIcon);

			try {
				await CartUtils.addToCart(bookId, 1);

				// Estado de sucesso
				CartUtils.updateButtonState(button, "success", btnText, btnIcon);

				// Mostrar notificação
				CartUtils.showNotification(
					"1 exemplar adicionado ao carrinho!",
					"success",
					{
						bookImage: bookImage,
						bookTitle: bookTitle,
						quantity: 1,
					}
				);

				// Resetar botão após 2.5 segundos
				setTimeout(() => {
					CartUtils.updateButtonState(button, "reset", btnText, btnIcon);
				}, 2500);
			} catch (error) {
				console.error("Erro ao adicionar ao carrinho:", error);

				const errorMessage = error.message.includes("fetch")
					? "Erro de conexão. Verifique sua internet e tente novamente."
					: error.message;

				CartUtils.showNotification(errorMessage, "error");
				CartUtils.updateButtonState(button, "reset", btnText, btnIcon);
			}
		}
	});
});
