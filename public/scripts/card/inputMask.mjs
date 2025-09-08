
export function setupCardInputMasks() {
    setupCardExpirationMask();
    setupCardNumberMask();
}

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

// Máscara para data de validade do cartão: MM/AAAA
export function setupCardExpirationMask() {
    document.addEventListener('input', (event) => {
        if (event.target.name === 'card-expiration') {
            let value = event.target.value.replace(/\D/g, '');
            
            if (value.length > 6) {
                value = value.substring(0, 6);
            }
            
            // Validar mês durante a digitação
            if (value.length >= 2) {
                const month = parseInt(value.substring(0, 2));
                if (month > 12) {
                    value = '12' + value.substring(2);
                } else if (month === 0) {
                    value = '01' + value.substring(2);
                }
            }
            
            if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d)/, '$1/$2');
            }
            
            event.target.value = value;
            
            // Validar se a data não é anterior ao mês atual
            if (value.length === 7) {
                validateCardExpiration(event.target, value);
            }
        }
    });
    
    // Validação ao sair do campo
    document.addEventListener('blur', (event) => {
        if (event.target.name === 'card-expiration') {
            const value = event.target.value;
            if (value.length === 7) {
                validateCardExpiration(event.target, value);
            }
        }
    }, true);
}

/* ========================================================== */

// Validação da data de validade do cartão
function validateCardExpiration(input, dateString) {
    if (!dateString || dateString.length !== 7) {
        input.setCustomValidity('Formato inválido. Use MM/AAAA');
        return false;
    }
    
    const [month, year] = dateString.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Validar mês
    if (monthNum < 1 || monthNum > 12) {
        input.setCustomValidity('Mês inválido. Use valores entre 01 e 12');
        return false;
    }
    
    // Validar se não é data passada
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        const newYear = monthNum < currentMonth ? currentYear + 1 : currentYear;
        const newValue = month + '/' + newYear;
        input.value = newValue;
        input.setCustomValidity('');
        return true;
    }
    
    // Se chegou até aqui, a data é válida
    input.setCustomValidity('');
    return true;
}
