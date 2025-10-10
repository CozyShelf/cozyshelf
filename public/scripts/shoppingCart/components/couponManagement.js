document.addEventListener("DOMContentLoaded", function () {
	const applyCouponsBtn = document.getElementById("apply-coupons");
	const promotionalCouponSelect = document.querySelector(
		'select[name="promotionalCoupon"]'
	);
	const exchangeCouponCheckboxes = document.querySelectorAll(
		'input[name="exchangeCoupons"]'
	);
	const itemsSubtotalElement = document.getElementById("items-subtotal");
	const totalDisplayElement = document.getElementById("total-display");
	const couponDiscountElement = document.querySelector(".text-light-green");

	let originalTotal = 0;
	let originalSubtotal = 0;
	let freight = 10; // Valor fixo do frete
	let appliedPromotionalCoupon = null;
	let appliedExchangeCoupons = [];

	// Mock data dos cupons (mesma estrutura do controller)
	const PROMOTIONAL_COUPONS = [
		{ code: "PROMO10", name: "Desconto de Primavera", discount: 10 },
		{ code: "WELCOME15", name: "Boas-vindas", discount: 15 },
		{ code: "BLACKFRIDAY", name: "Black Friday", discount: 25 },
	];

	const EXCHANGE_COUPONS = [
		{ code: "TROCA001", name: "Cupom de Troca #001", value: 15.0 },
		{ code: "TROCA002", name: "Cupom de Troca #002", value: 25.5 },
		{ code: "TROCA003", name: "Cupom de Troca #003", value: 10.0 },
		{ code: "TROCA004", name: "Cupom de Troca #004", value: 30.0 },
	];

	// Inicializar valores originais
	function initializeOriginalValues() {
		if (totalDisplayElement && totalDisplayElement.dataset.totalAmount) {
			originalTotal = parseFloat(totalDisplayElement.dataset.totalAmount);
		} else if (totalDisplayElement) {
			originalTotal = parseFloat(
				totalDisplayElement.textContent.replace("R$ ", "").replace(",", ".")
			);
		}

		if (itemsSubtotalElement) {
			originalSubtotal = parseFloat(
				itemsSubtotalElement.textContent.replace("R$ ", "").replace(",", ".")
			);
		}

		// Expor valores originais para outros scripts
		window.couponManagement = {
			originalTotal: originalTotal,
			originalSubtotal: originalSubtotal,
			freight: freight,
		};

		console.log("Valores iniciais:", {
			originalTotal,
			originalSubtotal,
			freight,
		});
	}

	// Função para calcular desconto dos cupons
	function calculateCouponDiscounts() {
		let totalDiscount = 0;
		let selectedExchangeCoupons = [];
		let selectedPromotionalCoupon = null;

		// Verificar cupom promocional selecionado
		if (promotionalCouponSelect && promotionalCouponSelect.value) {
			const promoCode = promotionalCouponSelect.value;
			selectedPromotionalCoupon = PROMOTIONAL_COUPONS.find(
				(coupon) => coupon.code === promoCode
			);

			if (selectedPromotionalCoupon) {
				// Desconto percentual sobre o subtotal de itens
				const promoDiscount =
					(originalSubtotal * selectedPromotionalCoupon.discount) / 100;
				totalDiscount += promoDiscount;
				console.log(
					`Cupom promocional ${
						selectedPromotionalCoupon.code
					}: -R$ ${promoDiscount.toFixed(2)}`
				);
			}
		}

		// Verificar cupons de troca selecionados
		exchangeCouponCheckboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				const exchangeCode = checkbox.value;
				const exchangeCoupon = EXCHANGE_COUPONS.find(
					(coupon) => coupon.code === exchangeCode
				);

				if (exchangeCoupon) {
					totalDiscount += exchangeCoupon.value;
					selectedExchangeCoupons.push(exchangeCoupon);
					console.log(
						`Cupom de troca ${
							exchangeCoupon.code
						}: -R$ ${exchangeCoupon.value.toFixed(2)}`
					);
				}
			}
		});

		// Nota: Não limitamos o desconto aqui, pois o excesso será convertido em cupom de troca
		// O sistema permitirá descontos maiores que o valor total

		return {
			totalDiscount,
			selectedPromotionalCoupon,
			selectedExchangeCoupons,
		};
	}

	// Função para atualizar os valores na tela
	function updateDisplayedValues() {
		const discounts = calculateCouponDiscounts();

		// Calcular valores considerando que desconto pode exceder total
		let effectiveDiscount = discounts.totalDiscount;
		let newTotal = Math.max(0, originalTotal - discounts.totalDiscount);

		// Se desconto excede o valor total, mostrar desconto limitado na tela
		if (discounts.totalDiscount > originalTotal) {
			effectiveDiscount = originalTotal; // Para exibição na tela
			newTotal = 0;
		}

		// Atualizar desconto de cupons (mostra desconto efetivo na tela)
		if (couponDiscountElement) {
			couponDiscountElement.textContent = `- R$ ${effectiveDiscount
				.toFixed(2)
				.replace(".", ",")}`;

			// Atualizar cor baseado no valor
			if (discounts.totalDiscount > 0) {
				couponDiscountElement.className = "text-green-600 font-semibold";
			} else {
				couponDiscountElement.className = "text-gray-500";
			}
		}

		// Atualizar total
		if (totalDisplayElement) {
			totalDisplayElement.textContent = `R$ ${newTotal
				.toFixed(2)
				.replace(".", ",")}`;
			totalDisplayElement.dataset.totalAmount = newTotal.toString();
		}

		// Calcular excedente se houver
		const hasExcess = discounts.totalDiscount > originalTotal;
		const excessAmount = hasExcess
			? discounts.totalDiscount - originalTotal
			: 0;

		// Salvar cupons aplicados globalmente para uso em outros scripts
		window.appliedCoupons = {
			promotional: discounts.selectedPromotionalCoupon,
			exchange: discounts.selectedExchangeCoupons,
			totalDiscount: discounts.totalDiscount,
			effectiveDiscount: hasExcess ? originalTotal : discounts.totalDiscount,
			newTotal: newTotal,
			hasExcess: hasExcess,
			excessAmount: excessAmount,
		};

		// Disparar evento para notificar outros scripts sobre mudança no total
		const totalChangeEvent = new CustomEvent("totalAmountChanged", {
			detail: {
				newTotal: newTotal,
				originalTotal: originalTotal,
				totalDiscount: discounts.totalDiscount,
				appliedCoupons: window.appliedCoupons,
			},
		});
		document.dispatchEvent(totalChangeEvent);

		console.log("Valores atualizados:", {
			originalTotal,
			totalDiscount: discounts.totalDiscount,
			effectiveDiscount: hasExcess ? originalTotal : discounts.totalDiscount,
			newTotal,
			hasExcess,
			excessAmount: hasExcess ? excessAmount : 0,
		});
	}

	// Função para atualizar status visual dos cupons
	function updateCouponsStatus() {
		const statusDiv = document.getElementById("applied-coupons-status");
		const statusList = document.getElementById("applied-coupons-list");
		const resetBtn = document.getElementById("reset-coupons");

		if (!statusDiv || !statusList || !resetBtn) return;

		const discounts = calculateCouponDiscounts();

		if (discounts.totalDiscount > 0) {
			// Mostrar status de cupons aplicados
			const couponNames = [];
			if (discounts.selectedPromotionalCoupon) {
				couponNames.push(
					`${discounts.selectedPromotionalCoupon.name} (-${discounts.selectedPromotionalCoupon.discount}%)`
				);
			}
			discounts.selectedExchangeCoupons.forEach((coupon) => {
				couponNames.push(
					`${coupon.name} (-R$ ${coupon.value.toFixed(2).replace(".", ",")})`
				);
			});

			statusList.innerHTML = couponNames
				.map((name) => `<div>• ${name}</div>`)
				.join("");
			statusDiv.style.display = "block";
			resetBtn.style.display = "block";
		} else {
			// Ocultar status
			statusDiv.style.display = "none";
			resetBtn.style.display = "none";
		}
	}

	// Função para atualizar controles de pagamento
	function updatePaymentControls() {
		const discounts = calculateCouponDiscounts();
		const hasExcess = discounts.totalDiscount >= originalTotal;

		// Elementos de controle de pagamento
		const paymentControls = document.getElementById("payment-controls");
		const paymentWarning = document.getElementById("payment-disabled-warning");
		const selectedCardsContainer = document.getElementById("selected-cards");
		const paymentSummary = document.getElementById("payment-summary");

		if (hasExcess) {
			// Cupons cobrem tudo - desabilitar pagamento
			if (paymentControls) {
				paymentControls.style.opacity = "0.5";
				paymentControls.style.pointerEvents = "none";

				// Desabilitar elementos individuais
				const cardSelector = document.getElementById("card-selector");
				const addCardBtn = document.getElementById("add-card-to-payment");
				const addPaymentBtn = document.getElementById("add-payment");

				if (cardSelector) cardSelector.disabled = true;
				if (addCardBtn) addCardBtn.disabled = true;
				if (addPaymentBtn) addPaymentBtn.disabled = true;
			}

			// Mostrar aviso
			if (paymentWarning) {
				paymentWarning.style.display = "block";
			}

			// Limpar cartões selecionados
			if (selectedCardsContainer) {
				selectedCardsContainer.innerHTML = "";
			}

			// Ocultar resumo de pagamento
			if (paymentSummary) {
				paymentSummary.style.display = "none";
			}
		} else {
			// Valor restante - habilitar pagamento
			if (paymentControls) {
				paymentControls.style.opacity = "1";
				paymentControls.style.pointerEvents = "auto";

				// Habilitar elementos individuais
				const cardSelector = document.getElementById("card-selector");
				const addCardBtn = document.getElementById("add-card-to-payment");
				const addPaymentBtn = document.getElementById("add-payment");

				if (cardSelector) cardSelector.disabled = false;
				if (addCardBtn) addCardBtn.disabled = false;
				if (addPaymentBtn) addPaymentBtn.disabled = false;
			}

			// Ocultar aviso
			if (paymentWarning) {
				paymentWarning.style.display = "none";
			}
		}
	}

	// Função para aplicar cupons
	function applyCoupons() {
		const discounts = calculateCouponDiscounts();

		if (discounts.totalDiscount === 0) {
			Swal.fire({
				icon: "info",
				title: "Nenhum cupom selecionado",
				text: "Selecione pelo menos um cupom para aplicar desconto.",
				confirmButtonColor: "#8B4513",
			});
			return;
		}

		appliedPromotionalCoupon = discounts.selectedPromotionalCoupon;
		appliedExchangeCoupons = discounts.selectedExchangeCoupons;

		updateDisplayedValues();
		updateCouponsStatus();
		updatePaymentControls();

		// Mostrar feedback de sucesso simples
		const couponNames = [];
		if (appliedPromotionalCoupon) {
			couponNames.push(
				`${appliedPromotionalCoupon.name} (${appliedPromotionalCoupon.discount}%)`
			);
		}
		appliedExchangeCoupons.forEach((coupon) => {
			couponNames.push(
				`${coupon.name} (R$ ${coupon.value.toFixed(2).replace(".", ",")})`
			);
		});

		Swal.fire({
			icon: "success",
			title: "Cupons aplicados!",
			html: `
                <p>Cupons aplicados com sucesso:</p>
                <ul style="text-align: left; margin: 10px 0;">
                    ${couponNames.map((name) => `<li>• ${name}</li>`).join("")}
                </ul>
                <p><strong>Desconto total: R$ ${discounts.totalDiscount
									.toFixed(2)
									.replace(".", ",")}</strong></p>
            `,
			confirmButtonColor: "#8B4513",
		});
	}

	// Event listeners
	if (applyCouponsBtn) {
		applyCouponsBtn.addEventListener("click", applyCoupons);
	}

	// Inicializar
	initializeOriginalValues();

	// Função global para resetar cupons
	window.resetCoupons = function () {
		appliedPromotionalCoupon = null;
		appliedExchangeCoupons = [];

		if (promotionalCouponSelect) {
			promotionalCouponSelect.selectedIndex = 0;
		}

		exchangeCouponCheckboxes.forEach((checkbox) => {
			checkbox.checked = false;
		});

		// Restaurar valores originais
		if (couponDiscountElement) {
			couponDiscountElement.textContent = "- R$ 0,00";
			couponDiscountElement.className = "text-light-green";
		}

		if (totalDisplayElement) {
			totalDisplayElement.textContent = `R$ ${originalTotal
				.toFixed(2)
				.replace(".", ",")}`;
			totalDisplayElement.dataset.totalAmount = originalTotal.toString();
		}

		window.appliedCoupons = null;

		// Atualizar status visual
		updateCouponsStatus();
		updatePaymentControls(); // Reabilitar controles de pagamento

		// Disparar evento de reset
		const resetEvent = new CustomEvent("couponsReset", {
			detail: { originalTotal },
		});
		document.dispatchEvent(resetEvent);

		// Feedback visual
		Swal.fire({
			icon: "info",
			title: "Cupons removidos",
			text: "Todos os cupons foram removidos. Os valores originais foram restaurados.",
			confirmButtonColor: "#8B4513",
			timer: 2000,
			timerProgressBar: true,
		});
	};
});
