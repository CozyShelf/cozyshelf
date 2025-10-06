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
	} else {
		console.error("❌ Card Modal elements not found:", {
			addPaymentBtn: !!addPaymentBtn,
			modalContainer: !!modalContainer,
			closeModalBtn: !!closeModalBtn,
		});
	}
});
