document.addEventListener("DOMContentLoaded", function () {
    const applyCouponsBtn = document.getElementById("apply-coupons");
    const promotionalCouponSelect = document.querySelector('select[name="promotionalCoupon"]');
    const exchangeCouponCheckboxes = document.querySelectorAll('input[name="exchangeCoupons"]');
    const itemsSubtotalElement = document.getElementById("items-subtotal");
    const totalDisplayElement = document.getElementById("total-display");
    const couponDiscountElement = document.querySelector(".text-light-green");

    let originalTotal = 0;
    let originalSubtotal = 0;
    let freight = 10; // Valor fixo do frete
    let appliedPromotionalCoupon = null;
    let appliedExchangeCoupons = [];

    // Obter dados dinâmicos dos cupons do backend
    const promotionalCoupons = window.promotionalCoupons || [];
    const exchangeCoupons = window.exchangeCoupons || [];

    console.log("=== INICIALIZANDO COUPON MANAGEMENT ===");
    console.log("Dados dos cupons carregados:");
    console.log("Promotional coupons:", promotionalCoupons);
    console.log("Exchange coupons:", exchangeCoupons);

    // Debug: verificar se os elementos foram encontrados
    console.log("=== VERIFICANDO ELEMENTOS DOM ===");
    console.log("applyCouponsBtn:", applyCouponsBtn);
    console.log("promotionalCouponSelect:", promotionalCouponSelect);
    console.log("exchangeCouponCheckboxes:", exchangeCouponCheckboxes.length, "encontrados");
    console.log("totalDisplayElement:", totalDisplayElement);

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

        console.log("=== CALCULANDO DESCONTOS ===");

        // Verificar cupom promocional selecionado
        if (promotionalCouponSelect) {
            console.log("Valor do select promocional:", promotionalCouponSelect.value);
            
            if (promotionalCouponSelect.value && promotionalCouponSelect.value !== "") {
                const promoId = promotionalCouponSelect.value;
                selectedPromotionalCoupon = promotionalCoupons.find(
                    (coupon) => (coupon.id === promoId || coupon._id === promoId)
                );

                if (selectedPromotionalCoupon) {
                    // Usar _value se existir, senão usar value
                    const couponValue = selectedPromotionalCoupon._value || selectedPromotionalCoupon.value;
                    const promoDiscount = (originalSubtotal * parseFloat(couponValue)) / 100;
                    totalDiscount += promoDiscount;
                    console.log(`✅ Cupom promocional aplicado: ${selectedPromotionalCoupon._description || selectedPromotionalCoupon.description}: -R$ ${promoDiscount.toFixed(2)}`);
                } else {
                    console.log("❌ Cupom promocional não encontrado na lista para ID:", promoId);
                }
            }
        } else {
            console.log("❌ Select promocional não encontrado");
        }

        // Verificar cupons de troca selecionados
        console.log("Verificando cupons de troca...");
        console.log("Checkboxes encontrados:", exchangeCouponCheckboxes.length);
        
        exchangeCouponCheckboxes.forEach((checkbox, index) => {
            console.log(`Checkbox ${index}: checked=${checkbox.checked}, value=${checkbox.value}, name=${checkbox.name}`);
            
            if (checkbox.checked) {
                const exchangeId = checkbox.value;
                const exchangeCoupon = exchangeCoupons.find(
                    (coupon) => (coupon.id === exchangeId || coupon._id === exchangeId)
                );

                if (exchangeCoupon) {
                    // Usar _value se existir, senão usar value
                    const couponValue = exchangeCoupon._value || exchangeCoupon.value;
                    const parsedValue = parseFloat(couponValue);
                    totalDiscount += parsedValue;
                    selectedExchangeCoupons.push(exchangeCoupon);
                    console.log(`✅ Cupom de troca aplicado: ${exchangeCoupon._description || exchangeCoupon.description}: -R$ ${parsedValue.toFixed(2)}`);
                } else {
                    console.log("❌ Cupom de troca não encontrado na lista para ID:", exchangeId);
                    console.log("IDs disponíveis:", exchangeCoupons.map(c => c._id || c.id));
                }
            }
        });

        console.log("=== RESULTADO FINAL ===");
        console.log("Total discount:", totalDiscount);
        console.log("Selected promotional:", selectedPromotionalCoupon);
        console.log("Selected exchange:", selectedExchangeCoupons);

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
            effectiveDiscount = originalTotal;
            newTotal = 0;
        }

        // Atualizar desconto de cupons
        if (couponDiscountElement) {
            couponDiscountElement.textContent = `- R$ ${effectiveDiscount.toFixed(2).replace(".", ",")}`;

            if (discounts.totalDiscount > 0) {
                couponDiscountElement.className = "text-green-600 font-semibold";
            } else {
                couponDiscountElement.className = "text-light-green";
            }
        }

        // Atualizar total
        if (totalDisplayElement) {
            totalDisplayElement.textContent = `R$ ${newTotal.toFixed(2).replace(".", ",")}`;
            totalDisplayElement.dataset.totalAmount = newTotal.toString();
        }

        // Calcular excedente se houver
        const hasExcess = discounts.totalDiscount > originalTotal;
        const excessAmount = hasExcess ? discounts.totalDiscount - originalTotal : 0;

        // Salvar cupons aplicados globalmente
        window.appliedCoupons = {
            promotional: discounts.selectedPromotionalCoupon,
            exchange: discounts.selectedExchangeCoupons,
            totalDiscount: discounts.totalDiscount,
            effectiveDiscount: hasExcess ? originalTotal : discounts.totalDiscount,
            newTotal: newTotal,
            hasExcess: hasExcess,
            excessAmount: excessAmount,
        };

        // Disparar evento para notificar outros scripts
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
            const couponNames = [];
            if (discounts.selectedPromotionalCoupon) {
                const coupon = discounts.selectedPromotionalCoupon;
                const description = coupon._description || coupon.description;
                const value = coupon._value || coupon.value;
                couponNames.push(`${description} (-${parseFloat(value)}%)`);
            }
            discounts.selectedExchangeCoupons.forEach((coupon) => {
                const description = coupon._description || coupon.description;
                const value = coupon._value || coupon.value;
                couponNames.push(`${description} (-R$ ${parseFloat(value).toFixed(2).replace(".", ",")})`);
            });

            statusList.innerHTML = couponNames
                .map((name) => `<div>• ${name}</div>`)
                .join("");
            statusDiv.style.display = "block";
            resetBtn.style.display = "block";
        } else {
            statusDiv.style.display = "none";
            resetBtn.style.display = "none";
        }
    }

    // Função para atualizar controles de pagamento
    function updatePaymentControls() {
        const discounts = calculateCouponDiscounts();
        const hasExcess = discounts.totalDiscount >= originalTotal;

        const paymentControls = document.getElementById("payment-controls");
        const paymentWarning = document.getElementById("payment-disabled-warning");
        const selectedCardsContainer = document.getElementById("selected-cards");
        const paymentSummary = document.getElementById("payment-summary");

        if (hasExcess) {
            if (paymentControls) {
                paymentControls.style.opacity = "0.5";
                paymentControls.style.pointerEvents = "none";

                const cardSelector = document.getElementById("card-selector");
                const addCardBtn = document.getElementById("add-card-to-payment");
                const addPaymentBtn = document.getElementById("add-payment");

                if (cardSelector) cardSelector.disabled = true;
                if (addCardBtn) addCardBtn.disabled = true;
                if (addPaymentBtn) addPaymentBtn.disabled = true;
            }

            if (paymentWarning) {
                paymentWarning.style.display = "block";
            }

            if (selectedCardsContainer) {
                selectedCardsContainer.innerHTML = "";
            }

            if (paymentSummary) {
                paymentSummary.style.display = "none";
            }
        } else {
            if (paymentControls) {
                paymentControls.style.opacity = "1";
                paymentControls.style.pointerEvents = "auto";

                const cardSelector = document.getElementById("card-selector");
                const addCardBtn = document.getElementById("add-card-to-payment");
                const addPaymentBtn = document.getElementById("add-payment");

                if (cardSelector) cardSelector.disabled = false;
                if (addCardBtn) addCardBtn.disabled = false;
                if (addPaymentBtn) addPaymentBtn.disabled = false;
            }

            if (paymentWarning) {
                paymentWarning.style.display = "none";
            }
        }
    }

    // Função para aplicar cupons
    function applyCoupons() {
        console.log("=== APLICANDO CUPONS ===");
        
        const discounts = calculateCouponDiscounts();

        console.log("Discounts calculados:", discounts);

        if (discounts.totalDiscount === 0) {
            console.log("❌ Nenhum desconto calculado!");
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

        const couponNames = [];
        if (appliedPromotionalCoupon) {
            const description = appliedPromotionalCoupon._description || appliedPromotionalCoupon.description;
            const value = appliedPromotionalCoupon._value || appliedPromotionalCoupon.value;
            couponNames.push(`${description} (${parseFloat(value)}%)`);
        }
        appliedExchangeCoupons.forEach((coupon) => {
            const description = coupon._description || coupon.description;
            const value = coupon._value || coupon.value;
            couponNames.push(`${description} (R$ ${parseFloat(value).toFixed(2).replace(".", ",")})`);
        });

        Swal.fire({
            icon: "success",
            title: "Cupons aplicados!",
            html: `
                <p>Cupons aplicados com sucesso:</p>
                <ul style="text-align: left; margin: 10px 0;">
                    ${couponNames.map((name) => `<li>• ${name}</li>`).join("")}
                </ul>
                <p><strong>Desconto total: R$ ${discounts.totalDiscount.toFixed(2).replace(".", ",")}</strong></p>
            `,
            confirmButtonColor: "#8B4513",
        });
    }

    // Event listeners
    if (applyCouponsBtn) {
        applyCouponsBtn.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("=== BOTÃO APLICAR CUPONS CLICADO ===");
            applyCoupons();
        });
        console.log("✅ Event listener adicionado ao botão aplicar cupons");
    } else {
        console.error("❌ Botão 'apply-coupons' não encontrado!");
    }

    // Inicializar
    initializeOriginalValues();

    // Função global para resetar cupons
    window.resetCoupons = function () {
        console.log("=== RESETANDO CUPONS ===");
        
        appliedPromotionalCoupon = null;
        appliedExchangeCoupons = [];

        if (promotionalCouponSelect) {
            promotionalCouponSelect.selectedIndex = 0;
        }

        exchangeCouponCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        if (couponDiscountElement) {
            couponDiscountElement.textContent = "- R$ 0,00";
            couponDiscountElement.className = "text-light-green";
        }

        if (totalDisplayElement) {
            totalDisplayElement.textContent = `R$ ${originalTotal.toFixed(2).replace(".", ",")}`;
            totalDisplayElement.dataset.totalAmount = originalTotal.toString();
        }

        window.appliedCoupons = null;

        updateCouponsStatus();
        updatePaymentControls();

        const resetEvent = new CustomEvent("couponsReset", {
            detail: { originalTotal },
        });
        document.dispatchEvent(resetEvent);

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