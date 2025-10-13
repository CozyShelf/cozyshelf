document.addEventListener("DOMContentLoaded", function () {
	const cardSelector = document.getElementById("card-selector");
	const addCardBtn = document.getElementById("add-card-to-payment");
	const selectedCardsContainer = document.getElementById("selected-cards");
	const paymentSummary = document.getElementById("payment-summary");
	const paymentBreakdown = document.getElementById("payment-breakdown");
	const remainingAmount = document.getElementById("remaining-amount");

	let selectedCards = [];
	let couponsApplied = false;

	function parseMoneyValue(moneyString) {
		if (!moneyString) return 0;

		return parseFloat(
			moneyString
				.replace(/R\$/g, "")
				.replace(/\s/g, "")
				.replace(/\./g, "".replace(",", ".")) || 0
		);
	}

	// Função para obter o valor total atual (sempre sincronizado com a validação)
	function getCurrentTotalAmount() {
		const totalElement = document.getElementById("total-display");
		return formatCurrency(parseMoneyValue(totalElement?.textContent) || 0);
	}

	// Inicializar valores totais usando a mesma lógica da validação
	let totalAmount = getCurrentTotalAmount();
	let originalTotalAmount = totalAmount; // Guardar o valor original

	// Função utilitária para formatar valores monetários
	function formatCurrency(amount) {
		return Math.round(amount * 100) / 100; // Garante 2 casas decimais
	}

	// Função utilitária para formatar valores para exibição
	function formatCurrencyDisplay(amount) {
		return formatCurrency(amount).toFixed(2).replace(".", ",");
	}

	// Função para validar se a soma dos cartões está correta
	function validateCardSum() {
		// Sempre usar o valor mais atual do display
		const currentTotal = getCurrentTotalAmount();
		const totalAmountCents = Math.round(currentTotal * 100);
		const cardSumCents = selectedCards.reduce((sum, card) => {
			return sum + Math.round((card.amount || 0) * 100);
		}, 0);

		return cardSumCents === totalAmountCents;
	}

	// Função para ajustar a soma dos cartões para bater exatamente com o total
	function adjustCardSumToTotal() {
		if (selectedCards.length === 0) return;

		// Sempre usar o valor mais atual do display
		const currentTotal = getCurrentTotalAmount();
		const totalAmountCents = Math.round(currentTotal * 100);
		let cardSumCents = selectedCards.reduce((sum, card) => {
			return sum + Math.round((card.amount || 0) * 100);
		}, 0);

		const differenceCents = totalAmountCents - cardSumCents;

		if (differenceCents !== 0) {
			// Ajustar o último cartão com a diferença
			const lastCardIndex = selectedCards.length - 1;
			const lastCardCurrentCents = Math.round(
				selectedCards[lastCardIndex].amount * 100
			);
			const adjustedLastCardCents = lastCardCurrentCents + differenceCents;

			selectedCards[lastCardIndex].amount = formatCurrency(
				adjustedLastCardCents / 100
			);
		}
	}

	// Fallback: tentar obter do data attribute se não conseguiu pelo display
	if (totalAmount === 0) {
		const dataAmount = parseFloat(
			document.querySelector("[data-total-amount]")?.dataset.totalAmount || "0"
		);
		totalAmount = formatCurrency(dataAmount);
		originalTotalAmount = formatCurrency(dataAmount);
	}

	// Listener para mudanças no total devido aos cupons
	document.addEventListener("totalAmountChanged", function (event) {
		// Sempre obter o valor atualizado do display para manter sincronização
		totalAmount = getCurrentTotalAmount();
		// Regra específica: só permite valores < R$ 10,00 se o valor RESTANTE for < R$ 10,00
		couponsApplied =
			event.detail.totalDiscount > 0 && totalAmount > 0 && totalAmount < 10;

		// Recalcular valores dos cartões se necessário
		if (selectedCards.length > 0) {
			redistributeAmountEqually();
			renderSelectedCards();
		}
		updatePaymentSummary();
	});

	// Listener para reset de cupons
	document.addEventListener("couponsReset", function (event) {
		// Sempre obter o valor atualizado do display para manter sincronização
		totalAmount = getCurrentTotalAmount();
		originalTotalAmount = formatCurrency(totalAmount);
		couponsApplied = false;

		// Redistribuir valores após reset dos cupons
		if (selectedCards.length > 0) {
			redistributeAmountEqually();
			renderSelectedCards();
		}
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

		// Adicionar o cartão primeiro
		const cardInfo = {
			id: cardId,
			brand: cardBrand,
			lastDigits: cardLastDigits,
			amount: 0, // Será calculado na redistribuição
		};

		selectedCards.push(cardInfo);

		// Redistribuir o valor total igualmente entre todos os cartões
		redistributeAmountEqually();
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
						   value="${formatCurrency(card.amount)}"
						   class="w-20 h-7 px-2 text-[11px] border border-gray-300 rounded"
						   data-card-index="${index}"
						   onchange="updateCardAmount(${index}, this.value)"
						   oninput="validateInputRange(${index}, this.value)"
						   title="${getCardAmountTitle()}"
					<input type="hidden" name="selectedCards[${index}][id]" value="${card.id}">
					<input type="hidden" name="selectedCards[${index}][amount]" value="${formatCurrency(
				card.amount
			)}"
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

		// Validar soma após renderização
		if (selectedCards.length > 0) {
			validateCardSum();
		}
	}

	function updatePaymentSummary() {
		if (!paymentBreakdown || !remainingAmount) return;

		// Sempre usar o valor mais atual do display e atualizar a variável global
		totalAmount = getCurrentTotalAmount();

		// Trabalhar com centavos para evitar problemas de arredondamento
		const totalAmountCents = Math.round(totalAmount * 100);
		const totalAllocatedCents = selectedCards.reduce(
			(sum, card) => sum + Math.round(parseFloat(card.amount || 0) * 100),
			0
		);
		const remainingCents = totalAmountCents - totalAllocatedCents;
		const remaining = remainingCents / 100;

		// Breakdown por cartão
		paymentBreakdown.innerHTML = selectedCards
			.map(
				(card) =>
					`<div class="flex justify-between">
				<span>${card.brand} **** ${card.lastDigits}:</span>
				<span>R$ ${formatCurrencyDisplay(card.amount || 0)}</span>
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
				<span>R$ ${formatCurrencyDisplay(Math.abs(remaining))}</span>
			</div>
		`;

		// Verificar diferenças muito pequenas (problemas de arredondamento)
		const remainingCentsAbs = Math.abs(remainingCents);

		if (remainingCentsAbs > 2) {
			// Diferenças maiores que 2 centavos
			if (remaining < 0) {
				remainingAmount.innerHTML +=
					'<div class="text-red-600 text-[10px] mt-1">⚠️ Valor excede o total da compra</div>';
			} else if (remaining > 0.01) {
				remainingAmount.innerHTML +=
					'<div class="text-orange-600 text-[10px] mt-1">⚠️ Valor restante deve ser pago</div>';
			}
		} else if (remainingCentsAbs > 0) {
			adjustCardSumToTotal();
			// Re-executar summary após ajuste
			setTimeout(() => updatePaymentSummary(), 50);
		}
	}

	// Função para redistribuir o valor total igualmente entre todos os cartões
	function redistributeAmountEqually() {
		if (selectedCards.length === 0) return;

		// Sempre usar o valor mais atual do display e atualizar a variável global
		totalAmount = getCurrentTotalAmount();

		// Trabalhar com centavos para evitar problemas de precisão decimal
		const totalAmountCents = Math.round(totalAmount * 100);
		const numCards = selectedCards.length;

		// Definir valor mínimo baseado na regra especial (em centavos)
		const minAmountCents = couponsApplied ? 1 : 1000; // 0.01 ou 10.00 em centavos

		// Calcular valor por cartão em centavos
		const amountPerCardCents = Math.floor(totalAmountCents / numCards);

		// Verificar se o valor por cartão atende ao mínimo
		if (amountPerCardCents < minAmountCents && numCards > 1) {
			// Calcular quantos cartões podem ter o valor mínimo
			const maxCardsWithMinAmount = Math.floor(
				totalAmountCents / minAmountCents
			);

			if (numCards > maxCardsWithMinAmount) {
				// Não é possível distribuir com o valor mínimo para todos
				const minAmountForCard = minAmountCents / 100;
				const message = couponsApplied
					? `Com o valor total de R$ ${totalAmount
							.toFixed(2)
							.replace(
								".",
								","
							)}, você pode usar no máximo ${maxCardsWithMinAmount} cartão(ões) respeitando o valor mínimo de R$ ${minAmountForCard
							.toFixed(2)
							.replace(".", ",")}.`
					: `Com o valor total de R$ ${totalAmount
							.toFixed(2)
							.replace(
								".",
								","
							)}, você pode usar no máximo ${maxCardsWithMinAmount} cartão(ões) respeitando o valor mínimo de R$ ${minAmountForCard
							.toFixed(2)
							.replace(".", ",")}.`;

				Swal.fire({
					icon: "warning",
					title: "Muitos cartões selecionados",
					text: message,
					confirmButtonColor: "#8B4513",
				});

				// Remover o último cartão adicionado
				selectedCards.pop();
				redistributeAmountEqually();
				return;
			}
		}

		// Distribuir valores trabalhando com centavos
		let totalDistributedCents = 0;

		// Atribuir valor base para todos os cartões exceto o último
		for (let i = 0; i < numCards - 1; i++) {
			selectedCards[i].amount = formatCurrency(amountPerCardCents / 100); // Converter e formatar
			totalDistributedCents += amountPerCardCents;
		}

		// O último cartão recebe o que sobrar para garantir que a soma seja exata
		if (numCards > 0) {
			const lastCardAmountCents = totalAmountCents - totalDistributedCents;
			selectedCards[numCards - 1].amount = formatCurrency(
				lastCardAmountCents / 100
			); // Converter e formatar
		}

		// Validar se a soma está correta e ajustar se necessário
		if (!validateCardSum()) {
			console.warn("⚠️ Soma dos cartões incorreta, fazendo ajuste fino...");
			adjustCardSumToTotal();
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

		// Sempre usar o valor mais atual do display
		const currentTotal = getCurrentTotalAmount();

		// Validação para soma total dos cartões usando centavos para precisão
		const otherCardsTotalCents = selectedCards.reduce((sum, card, i) => {
			return i === index
				? sum
				: sum + Math.round(parseFloat(card.amount || 0) * 100);
		}, 0);

		const parsedAmountCents = Math.round(parsedAmount * 100);
		const newTotalCents = otherCardsTotalCents + parsedAmountCents;
		const totalAmountCents = Math.round(currentTotal * 100);

		if (newTotalCents > totalAmountCents) {
			const maxAllowedCents = totalAmountCents - otherCardsTotalCents;
			const maxAllowedRounded = maxAllowedCents / 100;

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

		selectedCards[index].amount = formatCurrency(parsedAmount);
		const hiddenInput = document.querySelector(
			`input[name="selectedCards[${index}][amount]"]`
		);
		if (hiddenInput) {
			hiddenInput.value = formatCurrency(selectedCards[index].amount);
		}

		// Verificar se ainda há diferença após a edição manual e sugerir ajuste
		setTimeout(() => {
			if (!validateCardSum()) {
				const totalAmountCents = Math.round(totalAmount * 100);
				const cardSumCents = selectedCards.reduce((sum, card) => {
					return sum + Math.round((card.amount || 0) * 100);
				}, 0);
				const differenceCents = cardSumCents - totalAmountCents;

				if (Math.abs(differenceCents) <= 2) {
					// Diferença de até 2 centavos - ajustar automaticamente
					adjustCardSumToTotal();
					renderSelectedCards(); // Re-renderizar para mostrar valores ajustados
				}
			}
		}, 100);

		updatePaymentSummary();
	};

	window.removeCard = function (index) {
		selectedCards.splice(index, 1);

		// Redistribuir valores após remoção
		redistributeAmountEqually();

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

		// Sempre usar o valor mais atual do display
		const currentTotal = getCurrentTotalAmount();

		// Verificar se a soma excede o total (usando centavos para evitar problemas de precisão)
		const otherCardsTotalCents = selectedCards.reduce((sum, card, i) => {
			return i === index
				? sum
				: sum + Math.round(parseFloat(card.amount || 0) * 100);
		}, 0);

		const parsedValueCents = Math.round(parsedValue * 100);
		const newTotalCents = otherCardsTotalCents + parsedValueCents;
		const totalAmountCents = Math.round(currentTotal * 100);

		if (newTotalCents > totalAmountCents) {
			input.classList.add("border-orange-500");
			return;
		}
	};
});
