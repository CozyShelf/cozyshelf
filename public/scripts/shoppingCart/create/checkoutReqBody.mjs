/**
 * Constrói o corpo da requisição para processar o checkout.
 * Coleta todos os dados do carrinho, endereço, pagamento e cupons.
 * @param {HTMLFormElement} form - O formulário do carrinho
 * @returns {Object} O corpo da requisição formatado para o backend
 */
export function buildCheckoutReqBody(form) {
	const formData = new FormData(form);

	// Coleta itens do carrinho
	const cartItems = collectCartItems();

	// Coleta endereço selecionado
	const selectedAddress = collectSelectedAddress(form);

	// Coleta cupons aplicados
	const appliedCoupons = collectAppliedCoupons(form);

	// Coleta métodos de pagamento
	const paymentMethods = collectPaymentMethods();

	// Coleta totais calculados
	const totals = collectTotals();

	const checkoutReqBody = {
		cart: {
			items: cartItems,
			totals: totals,
		},
		delivery: {
			addressId: selectedAddress,
		},
		coupons: appliedCoupons,
		payment: paymentMethods,
		clientId: "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81",
		metadata: {
			timestamp: new Date().toISOString(),
			sessionId: generateSessionId(),
		},
	};

	return checkoutReqBody;
}

/**
 * Coleta todos os itens do carrinho com suas informações
 */
function collectCartItems() {
	const cartItems = [];
	// Busca pelos inputs de quantidade que têm data-item-id
	const quantityInputs = document.querySelectorAll(
		'input[type="number"][data-item-id]'
	);

	quantityInputs.forEach((quantityInput) => {
		const itemId = quantityInput.dataset.itemId;
		const bookId = quantityInput.dataset.bookId;
		const quantity = parseInt(quantityInput.value) || 0;

		if (itemId && bookId && quantity > 0) {
			// Procura o preço no elemento pai (li)
			const itemContainer = quantityInput.closest("li");
			let unitPrice = 0;
			let subtotal = 0;

			if (itemContainer) {
				// Busca por qualquer elemento que contenha "Preço unitário"
				const paragraphs = itemContainer.querySelectorAll("p");
				paragraphs.forEach((p) => {
					if (p.textContent.includes("Preço unitário:")) {
						// Regex mais flexível para capturar valores monetários
						const priceMatch = p.textContent.match(/R\$\s*([\d.,]+)/);
						if (priceMatch) {
							// Remove pontos de milhar e substitui vírgula por ponto
							const cleanPrice = priceMatch[1]
								.replace(/\./g, "")
								.replace(",", ".");
							unitPrice = parseFloat(cleanPrice) || 0;
						}
					}
				});

				// Se não encontrou o preço unitário, tenta calcular pelo preço total
				if (unitPrice === 0) {
					const totalPriceElement = itemContainer.querySelector(
						".font-bold.text-brown"
					);
					if (totalPriceElement) {
						const totalPriceMatch =
							totalPriceElement.textContent.match(/R\$\s*([\d.,]+)/);
						if (totalPriceMatch) {
							const cleanTotalPrice = totalPriceMatch[1]
								.replace(/\./g, "")
								.replace(",", ".");
							const totalPrice = parseFloat(cleanTotalPrice) || 0;
							unitPrice = quantity > 0 ? totalPrice / quantity : 0;
						}
					}
				}

				subtotal = unitPrice * quantity;
			}

			const item = {
				bookId: bookId,
				itemId: itemId,
				quantity: quantity,
				unitPrice: unitPrice,
				subTotal: subtotal,
			};

			cartItems.push(item);
		}
	});

	return cartItems;
}

/**
 * Coleta o endereço selecionado
 */
function collectSelectedAddress(form) {
	const addressSelect = form.querySelector('select[name="userAddress"]');
	return addressSelect ? addressSelect.value : null;
}

/**
 * Coleta cupons aplicados
 */
/**
 * Coleta cupons aplicados
 */
function collectAppliedCoupons(form) {
    const coupons = {
        promotionalCouponId: null,
        exchangeCouponIds: [],
    };

    // Cupom promocional - enviar apenas o ID
    const promotionalSelect = form.querySelector(
        'select[name="promotionalCoupon"]'
    );

    if (promotionalSelect && promotionalSelect.value) {
        coupons.promotionalCouponId = promotionalSelect.value;
    }

    // Cupons de troca - enviar apenas os IDs
    const exchangeCoupons = form.querySelectorAll(
        'input[name="exchangeCoupons"]:checked'
    );

    exchangeCoupons.forEach((coupon) => {
        if (coupon.value) {
            coupons.exchangeCouponIds.push(coupon.value);
        }
    });

    // Alternativa: usar os cupons do couponManagement.js se disponível
    if (window.appliedCoupons) {
        if (window.appliedCoupons.promotional) {
            coupons.promotionalCouponId = window.appliedCoupons.promotional._id || window.appliedCoupons.promotional.id;
        }
        
        if (window.appliedCoupons.exchange && window.appliedCoupons.exchange.length > 0) {
            coupons.exchangeCouponIds = window.appliedCoupons.exchange.map(
                coupon => coupon._id || coupon.id
            );
        }
    }

    return coupons;
}

/**
 * Coleta métodos de pagamento selecionados
 */
function collectPaymentMethods() {
	const paymentMethods = {
		cards: [],
		totalAmount: 0,
	};

	// Busca por cartões selecionados no sistema de múltiplos cartões
	const selectedCardsContainer = document.getElementById("selected-cards");

	if (selectedCardsContainer) {
		// Busca pelos inputs hidden que contêm os IDs dos cartões
		const cardIdInputs = selectedCardsContainer.querySelectorAll(
			'input[type="hidden"][name="cardUuid"]'
		);

		cardIdInputs.forEach((cardIdInput, index) => {
			const cardId = cardIdInput.value;
			// Para o valor, usa o input de número visível (mais atualizado que o hidden)
			const amountInput = selectedCardsContainer.querySelector(
				`input[type="number"][data-card-index="${index}"]`
			);

			if (cardId && amountInput) {
				const amount = parseFloat(amountInput.value) || 0;

				paymentMethods.cards.push({
					cardId: cardId,
					amount: amount,
				});
			}
		});

		// Se não encontrou pelos hidden inputs, tenta pelos inputs de número visíveis
		if (paymentMethods.cards.length === 0) {
			const amountInputs = selectedCardsContainer.querySelectorAll(
				'input[type="number"]'
			);

			amountInputs.forEach((amountInput, index) => {
				const amount = parseFloat(amountInput.value) || 0;

				// Usa um ID genérico se não encontrar o ID real
				paymentMethods.cards.push({
					cardId: `card_${index}`,
					amount: amount,
				});
			});
		}
	}

	// Calcula o total a ser pago
	paymentMethods.totalAmount = paymentMethods.cards.reduce(
		(total, card) => total + card.amount,
		0
	);

	return paymentMethods;
}

/**
 * Coleta os totais calculados
 */
// ...existing code...
function collectTotals() {
    const totals = {
        itemsSubtotal: 0,
        freight: 0,
        discount: 0,
        finalTotal: 0,
    };

    // Subtotal dos itens
    const itemsSubtotalElement = document.getElementById("items-subtotal");
    if (itemsSubtotalElement) {
        totals.itemsSubtotal = parseMoneyValue(itemsSubtotalElement.textContent);
    }

    // Frete (valor fixo por enquanto)
    totals.freight = 10.0; // Pode ser dinâmico no futuro

    // Desconto - buscar pelo texto do desconto de cupons
    const discountElements = document.querySelectorAll("p.text-green-600");
    discountElements.forEach((element) => {
        if (element.textContent.includes("- R$")) {
            // Captura o valor do desconto (remove o "- R$" e converte)
            const discountValue = parseMoneyValue(element.textContent.replace("-", ""));
            totals.discount += discountValue;
        }
    });

    // Alternativa: buscar pelo elemento pai que contém "Descontos de cupons"
    const discountSection = Array.from(document.querySelectorAll("h2")).find(h2 => 
        h2.textContent.includes("Descontos de cupons")
    );
    
    if (discountSection && totals.discount === 0) {
        const discountValueElement = discountSection.parentElement.querySelector("p.text-green-600");
        if (discountValueElement) {
            totals.discount = parseMoneyValue(discountValueElement.textContent.replace("-", ""));
        }
    }

    // Total final
    const totalElement = document.getElementById("total-display");
    if (totalElement) {
        totals.finalTotal = parseMoneyValue(totalElement.textContent);
    }

    return totals;
}
// ...existing code...

/**
 * Utilitário para converter valores monetários
 */
function parseMoneyValue(moneyString) {
	if (!moneyString) return 0;

	// Remove "R$", espaços e converte vírgula para ponto
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

/**
 * Gera um ID único para a sessão
 */
function generateSessionId() {
	return (
		"checkout_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
	);
}
