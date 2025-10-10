document.addEventListener("DOMContentLoaded", function () {
	const cardSelector = document.getElementById("card-selector");
	const addCardBtn = document.getElementById("add-card-to-payment");
	const selectedCardsContainer = document.getElementById("selected-cards");
	const paymentSummary = document.getElementById("payment-summary");
	const paymentBreakdown = document.getElementById("payment-breakdown");
	const remainingAmount = document.getElementById("remaining-amount");

	let selectedCards = [];
	let totalAmount = parseFloat(
		document.querySelector("[data-total-amount]")?.dataset.totalAmount || "0"
	);
	let originalTotalAmount = totalAmount; // Guardar o valor original
	let couponsApplied = false; // Flag para saber se cupons foram aplicados

	if (totalAmount === 0) {
		const totalText =
			document.querySelector("#total-display")?.textContent || "";
		totalAmount =
			parseFloat(totalText.replace("R$ ", "").replace(",", ".")) || 0;
		originalTotalAmount = totalAmount;
	}

	// Listener para mudanças no total devido aos cupons
	document.addEventListener("totalAmountChanged", function (event) {
		totalAmount = event.detail.newTotal;
		// Regra específica: só permite valores < R$ 10,00 se o valor RESTANTE for < R$ 10,00
		couponsApplied =
			event.detail.totalDiscount > 0 && totalAmount > 0 && totalAmount < 10;

		console.log("Total atualizado devido aos cupons:", {
			newTotal: totalAmount,
			originalTotal: originalTotalAmount,
			totalDiscount: event.detail.totalDiscount,
			specialPaymentAllowed: couponsApplied,
		});

		// Recalcular valores dos cartões se necessário
		updatePaymentSummary();
	});

	// Listener para reset de cupons
	document.addEventListener("couponsReset", function (event) {
		totalAmount = event.detail.originalTotal;
		originalTotalAmount = totalAmount;
		couponsApplied = false;
		updatePaymentSummary();
	});

	addCardBtn?.addEventListener("click", function () {
		const selectedOption = cardSelector.options[cardSelector.selectedIndex];
		if (!selectedOption.value) return;

		const cardId = selectedOption.value;
		const cardBrand = selectedOption.dataset.cardBrand;
		const cardLastDigits = selectedOption.dataset.cardLastDigits;

		if (selectedCards.find((card) => card.id === cardId)) {
			Swal.fire({
				icon: "warning",
				title: "Cartão já adicionado",
				text: "Este cartão já foi adicionado à lista de pagamento!",
				confirmButtonColor: "#8B4513",
			});
			return;
		}

		// Calcular valor já alocado em outros cartões
		const alreadyAllocated = selectedCards.reduce(
			(sum, card) => sum + parseFloat(card.amount || 0),
			0
		);
		const remainingAmount = Math.max(0, totalAmount - alreadyAllocated);

		// Definir valor mínimo baseado na regra especial
		const minAmountForCard = couponsApplied ? 0.01 : 10;

		// Sugerir o valor restante ou o mínimo, o que for apropriado
		let suggestedAmount;
		if (couponsApplied) {
			suggestedAmount =
				remainingAmount > 0 ? remainingAmount : minAmountForCard;
		} else {
			suggestedAmount = Math.max(
				minAmountForCard,
				Math.min(remainingAmount, minAmountForCard)
			);
		}

		// Arredondar para evitar problemas de precisão
		suggestedAmount = Math.round(suggestedAmount * 100) / 100;

		const cardInfo = {
			id: cardId,
			brand: cardBrand,
			lastDigits: cardLastDigits,
			amount: suggestedAmount,
		};

		selectedCards.push(cardInfo);
		renderSelectedCards();
		updatePaymentSummary();

		cardSelector.selectedIndex = 0;
	});

	function renderSelectedCards() {
		if (!selectedCardsContainer) return;

		selectedCardsContainer.innerHTML = "";

		selectedCards.forEach((card, index) => {
			const cardDiv = document.createElement("div");
			cardDiv.className =
				"flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg";
			cardDiv.innerHTML = `
				<div class="flex-1">
					<span class="font-medium text-[12px]">${card.brand} **** ${
				card.lastDigits
			}</span>
				</div>
				<input type="hidden" name="cardUuid" value="${card.id}">
				<div class="flex items-center gap-2">
					<label class="text-[11px] text-gray-600">R$</label>
					<input type="number"
						   step="0.01"
						   min="0"
						   value="${card.amount}"
						   class="w-20 h-7 px-2 text-[11px] border border-gray-300 rounded"
						   data-card-index="${index}"
						   onchange="updateCardAmount(${index}, this.value)"
						   oninput="validateInputRange(${index}, this.value)"
						   title="${getCardAmountTitle()}"
					<input type="hidden" name="selectedCards[${index}][id]" value="${card.id}">
					<input type="hidden" name="selectedCards[${index}][amount]" value="${
				card.amount
			}">
				</div>
				<button type="button"
						onclick="removeCard(${index})"
						class="text-red-500 hover:text-red-700 text-[12px] ml-2"
						title="Remover cartão">
					✕
				</button>
			`;
			selectedCardsContainer.appendChild(cardDiv);
		});

		// Mostrar/ocultar resumo
		if (paymentSummary) {
			paymentSummary.style.display =
				selectedCards.length > 0 ? "block" : "none";
		}
	}

	function updatePaymentSummary() {
		if (!paymentBreakdown || !remainingAmount) return;

		const totalAllocated = selectedCards.reduce(
			(sum, card) => sum + parseFloat(card.amount || 0),
			0
		);
		const remaining = totalAmount - totalAllocated;

		// Breakdown por cartão
		paymentBreakdown.innerHTML = selectedCards
			.map(
				(card) =>
					`<div class="flex justify-between">
				<span>${card.brand} **** ${card.lastDigits}:</span>
				<span>R$ ${parseFloat(card.amount || 0)
					.toFixed(2)
					.replace(".", ",")}</span>
			</div>`
			)
			.join("");

		// Valor restante
		remainingAmount.innerHTML = `
			<div class="flex justify-between ${
				remaining < 0
					? "text-red-600"
					: remaining > 0
					? "text-orange-600"
					: "text-green-600"
			}">
				<span>Valor restante:</span>
				<span>R$ ${Math.abs(remaining).toFixed(2).replace(".", ",")}</span>
			</div>
		`;

		if (remaining < 0) {
			remainingAmount.innerHTML +=
				'<div class="text-red-600 text-[10px] mt-1">⚠️ Valor excede o total da compra</div>';
		} else if (remaining > 0) {
			remainingAmount.innerHTML +=
				'<div class="text-orange-600 text-[10px] mt-1">⚠️ Valor restante deve ser pago</div>';
		}
	}

	// Função auxiliar para obter o título do input baseado nas regras atuais
	function getCardAmountTitle() {
		if (couponsApplied) {
			return `Valor: R$ 0,01 - R$ ${totalAmount
				.toFixed(2)
				.replace(
					".",
					","
				)} (Valores menores que R$ 10,00 permitidos pois o valor restante é menor que R$ 10,00)`;
		} else {
			return `Valor: R$ 10,00 - R$ ${totalAmount.toFixed(2).replace(".", ",")}`;
		}
	}

	// Funções globais
	window.updateCardAmount = function (index, amount) {
		const parsedAmount = parseFloat(amount) || 0;
		const minAmount = couponsApplied ? 0.01 : 10; // Valor mínimo dinâmico
		const input = document.querySelector(`input[data-card-index="${index}"]`);

		// Validação para valores negativos
		if (parsedAmount < 0) {
			Swal.fire({
				icon: "error",
				title: "Valor inválido",
				text: "O valor não pode ser negativo",
				confirmButtonColor: "#8B4513",
			});

			if (input) {
				input.value = selectedCards[index].amount || minAmount;
			}
			return;
		}

		// Validação para valor mínimo (com regra especial para cupons)
		if (parsedAmount > 0 && parsedAmount < minAmount) {
			const errorMessage = couponsApplied
				? `Valor mínimo por cartão é R$ ${minAmount
						.toFixed(2)
						.replace(".", ",")}`
				: `Valor mínimo por cartão é R$ ${minAmount
						.toFixed(2)
						.replace(
							".",
							","
						)}. Para valores menores que R$ 10,00, aplique cupons que resultem em um valor restante menor que R$ 10,00.`;

			Swal.fire({
				icon: "error",
				title: "Valor inválido",
				text: errorMessage,
				confirmButtonColor: "#8B4513",
			});

			if (input) {
				input.value = selectedCards[index].amount || minAmount;
			}
			return;
		}

		// CORREÇÃO: Validação para soma total dos cartões - permitir exatamente o total
		const otherCardsTotal = selectedCards.reduce((sum, card, i) => {
			return i === index ? sum : sum + parseFloat(card.amount || 0);
		}, 0);

		// Usar Math.round para evitar problemas de precisão decimal
		const newTotalCents = Math.round((otherCardsTotal + parsedAmount) * 100);
		const totalAmountCents = Math.round(totalAmount * 100);

		if (newTotalCents > totalAmountCents) {
			const maxAllowed = totalAmount - otherCardsTotal;
			// Arredondar para 2 casas decimais para evitar problemas de precisão
			const maxAllowedRounded = Math.round(maxAllowed * 100) / 100;

			Swal.fire({
				icon: "warning",
				title: "Valor excede o total",
				text: `A soma dos valores dos cartões não pode exceder o total do pedido. Valor máximo permitido para este cartão: R$ ${maxAllowedRounded
					.toFixed(2)
					.replace(".", ",")}`,
				confirmButtonColor: "#8B4513",
			});

			if (input) {
				input.value = selectedCards[index].amount || minAmount;
			}
			return;
		}

		selectedCards[index].amount = parsedAmount;
		const hiddenInput = document.querySelector(
			`input[name="selectedCards[${index}][amount]"]`
		);
		if (hiddenInput) {
			hiddenInput.value = selectedCards[index].amount;
		}
		updatePaymentSummary();
	};

	window.removeCard = function (index) {
		selectedCards.splice(index, 1);
		renderSelectedCards();
		updatePaymentSummary();
	};

	// Validação em tempo real durante a digitação
	window.validateInputRange = function (index, value) {
		const input = document.querySelector(`input[data-card-index="${index}"]`);
		if (!input) return;

		const parsedValue = parseFloat(value);
		const minAmount = couponsApplied ? 0.01 : 10;

		// Remover classes de erro anteriores
		input.classList.remove(
			"border-red-500",
			"border-orange-500",
			"border-green-500"
		);

		// Valor negativo
		if (parsedValue < 0) {
			input.classList.add("border-red-500");
			return;
		}

		// Valor abaixo do mínimo
		if (parsedValue > 0 && parsedValue < minAmount) {
			input.classList.add("border-red-500");
			return;
		}

		// Valor entre limites especiais
		if (!couponsApplied && parsedValue > 0 && parsedValue < 10) {
			// Valor entre 0.01 e 9.99 sem cupons apropriados - não permitido
			input.classList.add("border-red-500");
			return;
		} else if (couponsApplied && parsedValue >= 0.01 && parsedValue < 10) {
			// Valor entre 0.01 e 9.99 COM valor restante < R$ 10,00 - permitido, mas com destaque
			input.classList.add("border-green-500");
		}

		// Verificar se a soma excede o total (usando centavos para evitar problemas de precisão)
		const otherCardsTotal = selectedCards.reduce((sum, card, i) => {
			return i === index ? sum : sum + parseFloat(card.amount || 0);
		}, 0);

		const newTotalCents = Math.round((otherCardsTotal + parsedValue) * 100);
		const totalAmountCents = Math.round(totalAmount * 100);

		if (newTotalCents > totalAmountCents) {
			input.classList.add("border-orange-500");
			return;
		}
	};
});
