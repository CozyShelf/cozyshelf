export function setupInputMasks() {
    setupCepMask();
    setupPhoneMask();
    setupCpfMask();
    setupCardNumberMask();
    setupCardExpirationMask();
    setupBirthDateValidation();
}

/* ========================================================== */

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

// Máscara para telefone: (DD) NNNNN-NNNN
export function setupPhoneMask() {
    document.addEventListener('input', (event) => {
        if (event.target.name === 'client-phone') {
            let value = event.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
            }
            
            event.target.value = value;
        }
    });
}

// Máscara para CPF: XXX.XXX.XXX-XX
export function setupCpfMask() {
    document.addEventListener('input', (event) => {
        if (event.target.name === 'client-cpf') {
            let value = event.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length >= 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
            }
            
            event.target.value = value;
        }
    });
}

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

// Validação de data de nascimento (+18 anos)
export function setupBirthDateValidation() {
    document.addEventListener('change', (event) => {
        if (event.target.name === 'client-birth-date') {
            const birthDate = new Date(event.target.value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                event.target.setCustomValidity('Você deve ter pelo menos 18 anos');
                Swal.fire({
                    icon: 'warning',
                    title: 'Idade inválida',
                    text: 'Você deve ter pelo menos 18 anos para se cadastrar.'
                });
            } else {
                event.target.setCustomValidity('');
            }
        }
    });
    
    // Definir data máxima (18 anos atrás)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    const maxDateString = maxDate.toISOString().split('T')[0];
    
    document.querySelectorAll("input[name='client-birth-date']").forEach(input => {
        input.setAttribute('max', maxDateString);
    });
}

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

/* ========================================================== */

// Função para limpar máscaras e obter valores puros
export function getCleanValue(input) {
    const name = input.name;
    const value = input.value;
    
    switch (name) {
        case 'client-phone':
        case 'client-cpf':
        case 'card-number':
        case 'address-zip-code':
            return value.replace(/\D/g, '');
        case 'card-expiration':
            return value; // Mantém o formato MM/AAAA
        default:
            return value;
    }
}

// Função para extrair DDD e número do telefone
export function extractPhoneData(phoneValue) {
    const cleanPhone = phoneValue.replace(/\D/g, '');
    
    if (cleanPhone.length === 11) {
        return {
            ddd: cleanPhone.substring(0, 2),
            number: cleanPhone.substring(2)
        };
    } else if (cleanPhone.length === 10) {
        return {
            ddd: cleanPhone.substring(0, 2),
            number: cleanPhone.substring(2)
        };
    }
    
    throw new Error('Telefone inválido');
}