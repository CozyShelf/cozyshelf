document.addEventListener('DOMContentLoaded', function() {
    const addressSelect = document.querySelector('select[name="userAddress"]');
    const freightDisplay = document.querySelector('#freight-display');
    const totalDisplay = document.querySelector('#total-display');
    
    // Pegar o subtotal dos itens do elemento HTML
    const itemsSubtotalElement = document.querySelector('#items-subtotal');
    if (!itemsSubtotalElement) return;
    
    const itemsSubtotalText = itemsSubtotalElement.textContent.trim();
    const itemsSubtotal = parseFloat(itemsSubtotalText.replace("R$ ", "").replace(",", "."));

    if (addressSelect && freightDisplay && totalDisplay) {
        addressSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            
            if (selectedOption.value) {
                // Pegar o frete do data attribute da option
                const freightValue = parseFloat(selectedOption.dataset.freight || '0');
                const newTotal = itemsSubtotal + freightValue;

                // Atualizar displays
                freightDisplay.textContent = `R$ ${freightValue.toFixed(2).replace('.', ',')}`;
                totalDisplay.textContent = `R$ ${newTotal.toFixed(2).replace('.', ',')}`;
            } else {
                // Resetar para valores padrão se nenhum endereço for selecionado
                const defaultFreight = parseFloat(freightDisplay.dataset.defaultFreight || '0');
                const newTotal = itemsSubtotal + defaultFreight;

                freightDisplay.textContent = `R$ ${defaultFreight.toFixed(2).replace('.', ',')}`;
                totalDisplay.textContent = `R$ ${newTotal.toFixed(2).replace('.', ',')}`;
            }
        });
    }
});