document.addEventListener('DOMContentLoaded', function() {
    const addressSelect = document.querySelector('select[name="userAddress"]');
    const freightDisplay = document.querySelector('#freight-value');
    const totalDisplay = document.querySelector('#total-display');
    
    // Pegar o subtotal dos itens do elemento HTML
    const itemsSubtotalElement = document.querySelector('#items-subtotal');
    const discountDisplay = document.querySelector('#coupons-discount');

    if (!itemsSubtotalElement) return;

    const itemsSubtotalText = itemsSubtotalElement.textContent.trim();
    const itemsSubtotal = parseFloat(itemsSubtotalText.replace("R$ ", "").replace(",", "."));

    // Função para extrair o valor do desconto
    function getDiscountValue() {
        if (!discountDisplay) return 0;
        
        const discountText = discountDisplay.textContent.trim();
        // O texto vem como "- R$ 10,00", então removemos "- R$ " e convertemos
        const discountValue = discountText.replace("- R$ ", "").replace(",", ".");
        return parseFloat(discountValue) || 0;
    }

    if (addressSelect && freightDisplay && totalDisplay) {
        addressSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const currentDiscount = getDiscountValue();
            
            if (selectedOption.value) {
                // Pegar o frete do data attribute da option
                const freightValue = parseFloat(selectedOption.dataset.freight || '0');
                const newTotal = itemsSubtotal + freightValue - currentDiscount;

                // Atualizar displays
                freightDisplay.textContent = `R$ ${freightValue.toFixed(2).replace('.', ',')}`;
                totalDisplay.textContent = `R$ ${Math.max(0, newTotal).toFixed(2).replace('.', ',')}`;
            } else {
                // Resetar para valores padrão se nenhum endereço for selecionado
                const defaultFreight = parseFloat(freightDisplay.dataset.defaultFreight || '0');
                const newTotal = itemsSubtotal + defaultFreight - currentDiscount;

                freightDisplay.textContent = `R$ ${defaultFreight.toFixed(2).replace('.', ',')}`;
                totalDisplay.textContent = `R$ ${Math.max(0, newTotal).toFixed(2).replace('.', ',')}`;
            }
        });
    }
});