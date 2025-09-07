export function setupViaCepIntegration() {
    document.addEventListener('input', async (event) => {
        if (event.target.name === 'address-cep') {
            const cepInput = event.target;
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 8) {
                await fillAddressWithViaCep(cepInput, cep);
            }
        }
    });
}

/* ========================================================== */

async function fillAddressWithViaCep(cepInput, cep) {
    try {
        const addressDiv = cepInput.closest('#address');
        if (!addressDiv) return;

        showLoadingState(cepInput, true);

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            showCepError(cepInput, 'CEP não encontrado');
            return;
        }

        fillAddressFields(addressDiv, data);        
        showLoadingState(cepInput, false);
        showCepSuccess(cepInput);

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showCepError(cepInput, 'Erro ao buscar CEP. Tente novamente.');
        showLoadingState(cepInput, false);
    }
}

/* ========================================================== */

function fillAddressFields(addressDiv, viaCepData) {
    const fieldMappings = {
        'address-street-name': viaCepData.logradouro || '',
        'address-neighborhood': viaCepData.bairro || '',
        'address-city': viaCepData.localidade || '',
        'address-state': viaCepData.uf || ''
    };

    Object.entries(fieldMappings).forEach(([fieldName, value]) => {
        const field = addressDiv.querySelector(`[name="${fieldName}"]`);
        if (field && value) {
            field.value = value;
            
            field.classList.add('auto-filled');
            
            setTimeout(() => {
                field.classList.remove('auto-filled');
            }, 2000);
        }
    });

    mapStreetType(addressDiv, viaCepData.logradouro);
}

function mapStreetType(addressDiv, logradouro) {
    if (!logradouro) return;

    const streetTypeSelect = addressDiv.querySelector('[name="address-street-type"]');
    if (!streetTypeSelect) return;

    const logradouroLower = logradouro.toLowerCase();
    
    // Mapear tipos comuns de logradouro
    if (logradouroLower.includes('avenida') || logradouroLower.includes('av ')) {
        streetTypeSelect.value = 'Avenida';
    } else if (logradouroLower.includes('rodovia') || logradouroLower.includes('rod ')) {
        streetTypeSelect.value = 'Rodovia';
    } else if (logradouroLower.includes('beco')) {
        streetTypeSelect.value = 'Beco';
    }
}

/* ========================================================== */

function showLoadingState(cepInput, isLoading) {
    if (isLoading) {
        cepInput.style.backgroundColor = '#f0f9ff';
        cepInput.style.borderColor = '#3b82f6';
        cepInput.setAttribute('placeholder', 'Buscando CEP...');
        cepInput.disabled = true;
    } else {
        cepInput.style.backgroundColor = '';
        cepInput.style.borderColor = '';
        cepInput.setAttribute('placeholder', 'XXXXXXXX');
        cepInput.disabled = false;
    }
}

function showCepSuccess(cepInput) {
    cepInput.style.borderColor = '#10b981';
    cepInput.style.backgroundColor = '#f0fdf4';
    
    setTimeout(() => {
        cepInput.style.borderColor = '';
        cepInput.style.backgroundColor = '';
    }, 2000);
}

function showCepError(cepInput, message) {
    cepInput.style.borderColor = '#ef4444';
    cepInput.style.backgroundColor = '#fef2f2';
    cepInput.disabled = false;
    
    cepInput.title = message;
    
    setTimeout(() => {
        cepInput.style.borderColor = '';
        cepInput.style.backgroundColor = '';
        cepInput.title = '';
    }, 3000);
}