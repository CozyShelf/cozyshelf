// Validação para cupons com mensagem sobre excedente
document.addEventListener("DOMContentLoaded", function () {
	const promotionalCouponSelect = document.querySelector(
		'select[name="promotionalCoupon"]'
	);
	const exchangeCouponCheckboxes = document.querySelectorAll(
		'input[name="exchangeCoupons"]'
	);

	// Mock data para validação (deve ser sincronizado com couponManagement.js)
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

	// Função para obter o valor total ORIGINAL (antes de qualquer desconto)
	function getOriginalTotalValue() {
		// Primeiro tenta pegar do window.couponManagement se existir
		if (window.couponManagement && window.couponManagement.originalTotal) {
			return window.couponManagement.originalTotal;
		}

		// Se não, calcula subtotal + frete
		const currentSubtotal = getCurrentSubtotal();
		const freight = 10; // Valor fixo do frete
		return currentSubtotal + freight;
	}

	// Função para calcular subtotal de itens
	function getCurrentSubtotal() {
		const subtotalElement = document.getElementById("items-subtotal");
		if (subtotalElement) {
			return parseFloat(
				subtotalElement.textContent.replace("R$ ", "").replace(",", ".")
			);
		}
		return 0;
	}

	// Função para calcular desconto potencial dos cupons selecionados
	function calculatePotentialDiscount() {
		let totalDiscount = 0;
		const currentSubtotal = getCurrentSubtotal();

		// Cupom promocional
		if (promotionalCouponSelect && promotionalCouponSelect.value) {
			const promoCode = promotionalCouponSelect.value;
			const promoCoupon = PROMOTIONAL_COUPONS.find(
				(coupon) => coupon.code === promoCode
			);
			if (promoCoupon) {
				totalDiscount += (currentSubtotal * promoCoupon.discount) / 100;
			}
		}

		// Cupons de troca
		exchangeCouponCheckboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				const exchangeCode = checkbox.value;
				const exchangeCoupon = EXCHANGE_COUPONS.find(
					(coupon) => coupon.code === exchangeCode
				);
				if (exchangeCoupon) {
					totalDiscount += exchangeCoupon.value;
				}
			}
		});

		return totalDiscount;
	}

	// Função para mostrar informação sobre excedente (não bloqueia mais)
	function showExcessiveCouponInfo(originalTotalValue, potentialDiscount) {
		if (potentialDiscount > originalTotalValue) {
			const excessAmount = potentialDiscount - originalTotalValue;

			Swal.fire({
				icon: "info",
				title: "Cupons aplicados com sucesso",
				html: `
                    <div style="text-align: left;">
                        <p><strong>Situação:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Valor total da compra: <strong>R$ ${originalTotalValue
															.toFixed(2)
															.replace(".", ",")}</strong></li>
                            <li>Desconto dos cupons: <strong>R$ ${potentialDiscount
															.toFixed(2)
															.replace(".", ",")}</strong></li>
                            <li>Excedente: <strong>R$ ${excessAmount
															.toFixed(2)
															.replace(".", ",")}</strong></li>
                        </ul>
                        
                        <div style="background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #28a745;">
                            <p><strong>✅ Boa notícia!</strong></p>
                            <p>Sua compra está totalmente paga pelos cupons. O excedente de <strong>R$ ${excessAmount
															.toFixed(2)
															.replace(
																".",
																","
															)}</strong> será convertido em um novo cupom de troca para você usar em futuras compras.</p>
                        </div>
                    </div>
                `,
				confirmButtonText: "Entendi",
				confirmButtonColor: "#28a745",
			});
		}

		return Promise.resolve(true); // Sempre permite aplicar
	}

	// Interceptar o botão de aplicar cupons para mostrar informação sobre excedente
	const applyCouponsBtn = document.getElementById("apply-coupons");
	if (applyCouponsBtn) {
		const originalClick = applyCouponsBtn.onclick;
		applyCouponsBtn.onclick = async function (event) {
			const originalTotal = getOriginalTotalValue();
			const potentialDiscount = calculatePotentialDiscount();

			// Mostrar informação sobre excedente se necessário (não bloqueia)
			if (potentialDiscount > originalTotal) {
				// Mostrar informação após aplicar os cupons
				setTimeout(() => {
					showExcessiveCouponInfo(originalTotal, potentialDiscount);
				}, 1500);
			}

			// Sempre permite executar a função original
			if (originalClick) {
				return originalClick.call(this, event);
			}
		};
	}
});
