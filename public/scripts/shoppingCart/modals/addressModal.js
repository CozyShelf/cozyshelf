document.addEventListener("DOMContentLoaded", function () {
	// Aguardar um pouco para garantir que todos os elementos estejam carregados
	setTimeout(initAddressModal, 100);
});

function initAddressModal() {
	const addAddressBtn = document.getElementById("add-address");
	const modalContainer = document.getElementById("address-modal-container");
	const closeModalBtn = document.getElementById("close-address-modal");
	const form = document.getElementById("address-form");

	if (addAddressBtn && modalContainer && closeModalBtn && form) {
		addAddressBtn.addEventListener("click", () => {
			openModal();
		});

		closeModalBtn.addEventListener("click", () => {
			closeModal();
		});

		modalContainer.addEventListener("click", (e) => {
			if (e.target === modalContainer) {
				closeModal();
			}
		});

		// O formulário já tem sua própria lógica de submit via addressDetails.ejs
	} else {
		console.error("❌ Address Modal elements not found:", {
			addAddressBtn: !!addAddressBtn,
			modalContainer: !!modalContainer,
			closeModalBtn: !!closeModalBtn,
			form: !!form,
		});
	}

	function openModal() {
		modalContainer.classList.remove("hidden");
		modalContainer.style.display = "flex";

		// Limpar formulário
		if (form) {
			form.reset();
		}

		// Focar no primeiro campo
		const firstField = form?.querySelector(
			'input[name="address-short-phrase"]'
		);
		if (firstField) {
			setTimeout(() => firstField.focus(), 100);
		}
	}

	function closeModal() {
		modalContainer.classList.add("hidden");
		modalContainer.style.display = "none";

		// Limpar formulário
		if (form) {
			form.reset();
		}
	}
}
