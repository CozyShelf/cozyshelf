/**
 * Valida o formulário de checkout antes do envio
 * @param {HTMLFormElement} form - O formulário do checkout
 * @returns {boolean} - True se o formulário for válido
 */
export function validateCheckoutForm(form) {
	const errors = [];

	// Validação dos itens do carrinho
	if (!validateCartItems()) {
		errors.push("Carrinho vazio ou com itens inválidos");
	}

	// Validação do endereço
	if (!validateSelectedAddress(form)) {
		errors.push("Selecione um endereço de entrega");
	}

	// Validação do pagamento
	const paymentValidation = validatePaymentMethods();
	if (!paymentValidation.isValid) {
		errors.push(paymentValidation.message);
	}

	// Exibe erros se houver
	if (errors.length > 0) {
		showValidationErrors(errors);
		return false;
	}

	return true;
}

/**
 * Valida se existem itens no carrinho
 */
function validateCartItems() {
	// Busca pelos inputs de quantidade que têm data-item-id
	const quantityInputs = document.querySelectorAll(
		'input[type="number"][data-item-id]'
	);

	if (quantityInputs.length === 0) {
		return false;
	}

	// Verifica se pelo menos um item tem quantidade > 0
	let hasValidItems = false;
	quantityInputs.forEach((quantityInput) => {
		const quantity = parseInt(quantityInput.value) || 0;
		if (quantity > 0) {
			hasValidItems = true;
		}
	});

	return hasValidItems;
}

/**
 * Valida se um endereço foi selecionado
 */
function validateSelectedAddress(form) {
	const addressSelect = form.querySelector('select[name="userAddress"]');
	return (
		addressSelect && addressSelect.value && addressSelect.value.trim() !== ""
	);
}

/**
 * Valida os métodos de pagamento
 */
function validatePaymentMethods() {
	const totalElement = document.getElementById("total-display");
	const totalAmount = parseMoneyValue(totalElement?.textContent) || 0;

	// Se o total é 0 ou negativo (cupons cobrindo tudo), não precisa de pagamento
	if (totalAmount <= 0) {
		return { isValid: true };
	}

	// Verifica se há cartões selecionados
	const selectedCardsContainer = document.getElementById("selected-cards");

	// Busca especificamente pelos inputs de número visíveis (não os hidden)
	const amountInputs =
		selectedCardsContainer?.querySelectorAll('input[type="number"]') || [];

	if (amountInputs.length === 0) {
		return {
			isValid: false,
			message: "Selecione pelo menos um cartão de crédito para o pagamento",
		};
	}

	// Verifica se a soma dos valores dos cartões corresponde ao total
	let totalCardAmount = 0;
	let hasInvalidAmount = false;

	amountInputs.forEach((amountInput) => {
		const amount = parseFloat(amountInput.value) || 0;

		if (amount <= 0) {
			hasInvalidAmount = true;
		}

		totalCardAmount += amount;
	});

	if (hasInvalidAmount) {
		return {
			isValid: false,
			message: "Todos os cartões devem ter um valor válido maior que zero",
		};
	}

	// Tolerância para diferenças de centavos
	const tolerance = 0.01;
	const difference = Math.abs(totalCardAmount - totalAmount);

	// Debug temporário para investigar o problema
	console.log("🔍 DEBUG VALORES:");
	console.log("- Total cartões (raw):", totalCardAmount);
	console.log("- Total compra (raw):", totalAmount);
	console.log("- Diferença:", difference);
	console.log("- Tolerância:", tolerance);
	console.log("- Diferença > tolerância?", difference > tolerance);

	if (difference > tolerance) {
		let errorMessage;
		if (totalCardAmount < totalAmount) {
			const remaining = totalAmount - totalCardAmount;
			errorMessage = `Os cartões devem cobrir o valor total da compra. Faltam R$ ${remaining.toFixed(
				2
			)} para completar o pagamento de R$ ${totalAmount.toFixed(2)}.`;
		} else if (totalCardAmount > totalAmount) {
			const excess = totalCardAmount - totalAmount;
			errorMessage = `O valor dos cartões (R$ ${totalCardAmount.toFixed(
				2
			)}) está R$ ${excess.toFixed(
				2
			)} acima do total da compra (R$ ${totalAmount.toFixed(
				2
			)}). Ajuste os valores.`;
		} else {
			errorMessage = `Os cartões devem cobrir exatamente o valor total da compra (R$ ${totalAmount.toFixed(
				2
			)}).`;
		}

		return {
			isValid: false,
			message: errorMessage,
		};
	}

	return { isValid: true };
}

/**
 * Exibe erros de validação para o usuário
 */
function showValidationErrors(errors) {
	const errorMessage = errors.join("\n");

	if (typeof Swal !== "undefined") {
		// Usa SweetAlert se disponível
		Swal.fire({
			icon: "error",
			title: "Dados Incompletos",
			text: errorMessage,
			confirmButtonText: "OK",
			customClass: {
				container: "validation-error-container",
			},
		});
	} else {
		// Fallback para alert nativo
		alert("Erros encontrados:\n" + errorMessage);
	}
}

/**
 * Utilitário para converter valores monetários
 */
function parseMoneyValue(moneyString) {
	if (!moneyString) return 0;

	return (
		parseFloat(
			moneyString
				.replace(/R\$/g, "")
				.replace(/\s/g, "")
				.replace(/\./g, "") // Remove pontos de milhares
				.replace(",", ".") // Converte vírgula decimal para ponto
		) || 0
	);
}
