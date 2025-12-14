export function setupCardInputMasks() {
    setupCardNumberMask();
}

/* ========================================================== */
/* ===================== INPUT MASKS ======================== */
/* ========================================================== */

// Máscara para número do cartão: XXXX XXXX XXXX XXXX
export function setupCardNumberMask() {
    document.addEventListener('input', (event) => {
        if (event.target.name === 'card-number') {
            let value = event.target.value.replace(/\D/g, '');
            
            if (value.length > 16) {
                value = value.substring(0, 16);
            }
            
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            
            event.target.value = value;
        }
    });
}
