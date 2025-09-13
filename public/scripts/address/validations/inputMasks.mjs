// Máscara para CEP: XXXXX-XXX
export function setupCepMask() {
    document.addEventListener('input', (event) => {
        if (event.target.name === 'address-zip-code') {
            let value = event.target.value.replace(/\D/g, '');
            
            if (value.length > 8) {
                value = value.substring(0, 8);
            }
            
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            
            event.target.value = value;
        }
    });
}
