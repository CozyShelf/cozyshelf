document.addEventListener("DOMContentLoaded", function () {
	const addPaymentBtn = document.getElementById("add-payment");
	const modalContainer = document.getElementById("modal-container");
	const closeModalBtn = document.getElementById("close-modal");

	if (addPaymentBtn && modalContainer && closeModalBtn) {
		addPaymentBtn.addEventListener("click", () => {
			modalContainer.classList.remove("hidden");
			modalContainer.style.display = "flex";
		});

		closeModalBtn.addEventListener("click", () => {
			modalContainer.classList.add("hidden");
			modalContainer.style.display = "none";
		});

		modalContainer.addEventListener("click", (e) => {
			if (e.target === modalContainer) {
				modalContainer.classList.add("hidden");
				modalContainer.style.display = "none";
			}
		});

		// Listener para fechar modal automaticamente após criação bem-sucedida (apenas no carrinho)
		document.addEventListener("entityCreated", (event) => {
			if (event.detail.type === "success") {
				modalContainer.classList.add("hidden");
				modalContainer.style.display = "none";
				// Recarregar a lista de cartões se existir
				const cardSelect = document.getElementById("card-selector");
				if (cardSelect) {
					window.location.reload(); // Recarregar para atualizar a lista de cartões
				}
			}
		});
	} else {
		console.error("❌ Card Modal elements not found:", {
			addPaymentBtn: !!addPaymentBtn,
			modalContainer: !!modalContainer,
			closeModalBtn: !!closeModalBtn,
		});
	}
});
