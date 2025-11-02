document.addEventListener("DOMContentLoaded", () => {
	setTimeout(() => initExchangeModal(), 100);
});

function initExchangeModal() {
	const exchangeBtn = document.getElementById("exchange-btn");
	const modal = document.getElementById("exchange-modal");
	const closeBtn = document.getElementById("close-exchange-modal");
	const exchangeAllDiv = document.querySelector("#exchange-form > div");
	const exchangeAllCheckbox = document.getElementById("exchange-all");
	const exchangeForm = document.getElementById("exchange-form");

	if (exchangeBtn && modal) {
		exchangeBtn.addEventListener("click", () => {
			modal.classList.remove("hidden");
		});
	}

	if (closeBtn && modal) {
		closeBtn.addEventListener("click", () => {
			modal.classList.add("hidden");
		});
	}

	modal?.addEventListener("click", (e) => {
		if (e.target === modal) {
			modal.classList.add("hidden");
		}
	});

	if (exchangeAllDiv && exchangeAllCheckbox) {
		exchangeAllDiv.addEventListener("click", (e) => {
			if (e.target !== exchangeAllCheckbox) {
				exchangeAllCheckbox.checked = !exchangeAllCheckbox.checked;
				exchangeAllCheckbox.dispatchEvent(new Event("change"));
			}
		});
		exchangeAllCheckbox.addEventListener("change", function () {
			const bookCheckboxes = document.querySelectorAll(".book-checkbox");
			bookCheckboxes.forEach((cb) => {
				cb.checked = exchangeAllCheckbox.checked;
			});
		});
	}

	const submitBtn = document.querySelector(
		'#exchange-modal button[type="submit"]'
	);

	const cancelBtn = document.querySelector(
		'#exchange-modal button[type="button"]:not(#close-exchange-modal)'
	);

	if (submitBtn) {
		submitBtn.addEventListener("click", function (e) {
			e.preventDefault();
			console.log("Botão clicado!");
			handleExchangeSubmit();
		});
	} else {
		console.error("Botão de submit não encontrado!");
	}

	if (exchangeForm) {
		exchangeForm.addEventListener("submit", function (e) {
			e.preventDefault();
			handleExchangeSubmit();
		});
	}

	if (cancelBtn && modal) {
		cancelBtn.addEventListener("click", () => {
			modal.classList.add("hidden");
		});
	}
}

function handleExchangeSubmit() {
	console.log("handleExchangeSubmit chamado!");

	const orderIdInput = document.getElementById("order-id");
	const bookCheckboxes = document.querySelectorAll(".book-checkbox:checked");

	if (bookCheckboxes.length === 0) {
		Swal.fire({
			icon: "warning",
			title: "Atenção",
			text: "Selecione pelo menos um livro para trocar.",
		});
		return;
	}

	const exchangeItems = [];
	let hasInvalidQuantity = false;

	bookCheckboxes.forEach((checkbox) => {
		const bookId = checkbox.value;
		const quantityInput = document.getElementById(`quantity-${bookId}`);
		const unitPriceInput = document.getElementById(`book-price-${bookId}`);
		const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
		const maxQuantity = quantityInput ? parseInt(quantityInput.dataset.max) : 1;

		if (quantity < 1 || quantity > maxQuantity) {
			Swal.fire({
				icon: "warning",
				title: "Quantidade inválida",
				text: `A quantidade para o livro deve estar entre 1 e ${maxQuantity}.`,
			});
			hasInvalidQuantity = true;
			return;
		}

		exchangeItems.push({
			bookId,
			unitPrice: unitPriceInput ? parseFloat(unitPriceInput.textContent.replace("R$ ", "").replace(",", ".")) : 0,
			quantity: quantity.toString()
		});
	});

	if (hasInvalidQuantity || exchangeItems.length === 0) {
		return;
	}

	const requestObj = {
		orderId: orderIdInput ? orderIdInput.value : "",
		exchangeItems,
	};

	console.log("Enviando requisição:", requestObj);

	const submitBtn = document.querySelector(
		'#exchange-modal button[type="submit"]'
	);
	if (submitBtn) {
		submitBtn.disabled = true;
		submitBtn.textContent = "Processando...";
	}

	// TODO: Trocar pela rota backend
	fetch("/exchange", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestObj),
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((err) => {
					throw new Error(err.message || "Erro ao processar troca");
				});
			}
			return response.json();
		})
		.then((data) => {
			console.log("Resposta do servidor:", data);
			Swal.fire({
				icon: "success",
				title: "Troca realizada com sucesso!",
				text: "Sua solicitação de troca foi enviada.",
			}).then(() => {
				window.location.reload();
			});

			const modal = document.getElementById("exchange-modal");
			if (modal) modal.classList.add("hidden");
		})
		.catch((error) => {
			console.error("Erro na requisição:", error);
			Swal.fire({
				icon: "error",
				title: "Erro ao solicitar troca",
				text: error.message || "Ocorreu um erro ao enviar a solicitação.",
			});
		})
		.finally(() => {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = "Confirmar Troca";
			}
		});
}
