document.addEventListener("DOMContentLoaded", function () {
	const CLIENT_ID = "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";

	async function addQuantityToCart(bookId, quantityToAdd) {
		try {
			const response = await fetch("/api/carts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clientID: CLIENT_ID,
					bookID: bookId,
					quantity: quantityToAdd,
				}),
			});

			if (response.ok) {
				window.location.reload();
			} else {
				const result = await response.json();
				throw new Error(result.message || "Erro ao adicionar quantidade");
			}
		} catch (error) {
			console.error("Erro ao adicionar quantidade:", error);
			showNotification(
				error.message || "Erro ao adicionar quantidade. Tente novamente.",
				"error"
			);
		}
	}

	async function removeQuantityFromCart(bookId, quantityToRemove) {
		try {
			const response = await fetch("/api/carts/remove", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clientID: CLIENT_ID,
					bookID: bookId,
					quantity: quantityToRemove,
				}),
			});

			if (response.ok) {
				window.location.reload();
			} else {
				const result = await response.json();
				throw new Error(result.message || "Erro ao remover quantidade");
			}
		} catch (error) {
			console.error("Erro ao remover quantidade:", error);
			showNotification(
				error.message || "Erro ao remover quantidade. Tente novamente.",
				"error"
			);
		}
	}

	async function removeCartItem(itemId) {
		try {
			const response = await fetch(`/api/carts/${itemId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				const allItems = document.querySelectorAll("li[data-item-id]");
				const isLastItem = allItems.length <= 1;

				const itemElement = document
					.querySelector(`[data-item-id="${itemId}"]`)
					.closest("li");
				itemElement.style.transition = "all 0.3s ease-out";
				itemElement.style.transform = "translateX(-100%)";
				itemElement.style.opacity = "0";

				setTimeout(() => {
					itemElement.remove();

					const remainingItems = document.querySelectorAll("li[data-item-id]");
					if (remainingItems.length === 0) {
						window.location.reload();
					}
				}, 300);

				if (!isLastItem) {
					showNotification("Item removido do carrinho", "success");
				}
			} else {
				const result = await response.json();
				throw new Error(result.message || "Erro ao remover item");
			}
		} catch (error) {
			console.error("Erro ao remover item:", error);
			showNotification(
				error.message || "Erro ao remover item. Tente novamente.",
				"error"
			);
		}
	}

	const cartContainer =
		document.querySelector(".cart-items-container") || document.body;

	cartContainer.addEventListener("click", function (e) {
		if (e.target.closest(".quantity-btn")) {
			e.preventDefault();
			const button = e.target.closest(".quantity-btn");
			const itemId = button.getAttribute("data-item-id");
			const bookId = button.getAttribute("data-book-id");
			const action = button.getAttribute("data-action");
			const quantityInput = document.querySelector(
				`.quantity-input[data-item-id="${itemId}"]`
			);

			let currentQuantity = parseInt(quantityInput.value);

			if (action === "increase" && currentQuantity < 99) {
				addQuantityToCart(bookId, 1);
			} else if (action === "decrease" && currentQuantity > 1) {
				removeQuantityFromCart(bookId, 1);
			}
		}

		if (e.target.closest(".remove-btn")) {
			e.preventDefault();
			const button = e.target.closest(".remove-btn");
			const itemId = button.getAttribute("data-item-id");

			Swal.fire({
				title: "Remover item?",
				text: "Tem certeza que deseja remover este item do seu carrinho?",
				icon: "question",
				showCancelButton: true,
				confirmButtonColor: "#ef4444",
				cancelButtonColor: "#6b7280",
				confirmButtonText: "Sim, remover",
				cancelButtonText: "Cancelar",
				reverseButtons: true,
				focusCancel: true,
				customClass: {
					container: "cart-remove-modal",
					popup: "rounded-lg",
					title: "text-lg font-semibold text-dark-gray",
					content: "text-sm text-gray-600",
					confirmButton: "font-medium px-6 py-2 rounded-lg",
					cancelButton: "font-medium px-6 py-2 rounded-lg",
				},
			}).then((result) => {
				if (result.isConfirmed) {
					removeCartItem(itemId);
				}
			});
		}
	});

	document.addEventListener("focus", function (e) {
		if (e.target.classList && e.target.classList.contains("quantity-input")) {
			e.target.setAttribute("data-original-quantity", e.target.value);
		}
	});

	document.addEventListener("change", function (e) {
		if (e.target.classList && e.target.classList.contains("quantity-input")) {
			const input = e.target;
			const bookId = input.getAttribute("data-book-id");
			const originalQuantity = parseInt(
				input.getAttribute("data-original-quantity")
			);
			let newQuantity = parseInt(input.value);

			if (isNaN(newQuantity) || newQuantity < 1) {
				newQuantity = 1;
			} else if (newQuantity > 99) {
				newQuantity = 99;
			}

			input.value = newQuantity;

			const difference = newQuantity - originalQuantity;

			if (difference > 0) {
				addQuantityToCart(bookId, difference);
			} else if (difference < 0) {
				removeQuantityFromCart(bookId, Math.abs(difference));
			}
		}
	});

	// Função para mostrar notificações usando CartUtils
	function showNotification(message, type = "info") {
		CartUtils.showNotification(message, type);
	}
});
