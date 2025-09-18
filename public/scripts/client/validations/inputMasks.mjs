import { setupCardInputMasks } from "../../card/validations/inputMasks.mjs";
import { setupCepMask } from "../../address/validations/inputMasks.mjs";

export function setupInputMasks() {
    setupCepMask();
    setupPhoneMask();
    setupCpfMask();
    setupCardInputMasks();
    setupBirthDateValidation();
    setupPreferredToggle();
}

/* ========================================================== */
/* ===================== INPUT MASKS ======================== */
/* ========================================================== */

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

/* ========================================================== */
/* ====================== VALIDAÇÕES ======================== */
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

// Validar e garantir que apenas um cartão seja marcado como preferencial
export function setupPreferredToggle() {
    document.addEventListener('change', function (event) {
        // Verifica se o toggle é do tipo preferencial de cartão
        if (event.target.name === 'card-is-preferred') {
            // Desmarca todos os outros toggles
            document.querySelectorAll('input[name="card-is-preferred"]').forEach(input => {
                if (input !== event.target) {
                    input.checked = false;
                }
            });
        }
    });
}

/* ========================================================== */
/* ==================== EXTRAÇÃO DE DADOS =================== */
/* ========================================================== */

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
        default:
            return value;
    }
}