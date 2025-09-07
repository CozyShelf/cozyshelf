import { getCleanValue, extractPhoneData } from './inputMasks.mjs';

export function setupClientForm() {
    const form = document.getElementById("client-register-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        if (!validateForm(form)) {
            return;
        }
    
        try {
            const requestBody = buildRequestBody(form);
            console.log("Request Body:", requestBody);
            await submitClientRegistration(requestBody);
        } catch (error) {
            console.error("Erro ao processar formulário:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao processar os dados do formulário.'
            });
        }
    });
}

function buildRequestBody(form) {
    const formData = new FormData(form);
    
    // Extrair dados do telefone
    const phoneInput = form.querySelector("input[name='client-phone']");
    const phoneData = extractPhoneData(phoneInput.value);
    
    // Dados pessoais do cliente
    const clientData = {
        name: formData.get("client-name"),
        birthDate: formData.get("client-birth-date"),
        cpf: getCleanValue(form.querySelector("input[name='client-cpf']")),
        email: formData.get("client-email"),
        password: {
            value: formData.get("client-password"),
            confirmation: formData.get("client-password-repeat")
        },
        gender: formData.get("client-gender"),
        telephone: {
            ddd: phoneData.ddd,
            number: phoneData.number,
            type: formData.get("client-phone-type")
        }
    };

    // Processar endereços
    const addresses = [];
    const addressDivs = form.querySelectorAll("#address");
    
    addressDivs.forEach((addressDiv) => {
        const addressData = new FormData();
        const inputs = addressDiv.querySelectorAll("input, select");
        
        inputs.forEach(input => {
            if (input.name && input.value) {
                addressData.set(input.name, input.value);
            }
        });
        
        const address = {
            zipCode:addressData.get("address-zip-code"),
            number: addressData.get("address-number"),
            residenceType: addressData.get("address-residence-type"),
            streetName: addressData.get("address-street-name"),
            streetType: addressData.get("address-street-type"),
            neighborhood: addressData.get("address-neighborhood"),
            shortPhrase: addressData.get("address-short-phrase"),
            observation: "",
            city: addressData.get("address-city"),
            state: addressData.get("address-state"),
            country: {
                name: "Brasil",
                acronym: "BR"
            },
            type: addressData.get("address-type")
        };

        addresses.push(address);
    });
    
    // Processar cartões
    const cards = [];
    const cardDivs = form.querySelectorAll("#card");
    
    cardDivs.forEach((cardDiv) => {
        const cardData = new FormData();
        const inputs = cardDiv.querySelectorAll("input, select");
        
        inputs.forEach(input => {
            if (input.name && input.value && input.type !== 'checkbox') {
                cardData.set(input.name, input.value);
            }
        });

        const isPreferredCheckbox = cardDiv.querySelector("input[name='card-is-preferred'][type='checkbox']");
        const isPreferred = isPreferredCheckbox ? isPreferredCheckbox.checked : false;

        const cardNumberInput = cardDiv.querySelector("input[name='card-number']");
        const expirationInput = cardDiv.querySelector("input[name='card-expiration']");
        
        const card = {
            number: getCleanValue(cardNumberInput),
            nameOnCard: cardData.get("card-impress-name"),
            cvv: cardData.get("card-cvv"),
            expiryDate: formatExpirationDate(expirationInput.value),
            isPreferred: isPreferred,
            cardFlag: {
                description: cardData.get("card-flag")
            }
        };

        cards.push(card);
    });

    return {
        clientData,
        addresses,
        cards
    };
}

function formatExpirationDate(dateString) {
    if (!dateString) return '';
    
    // Se estiver no formato MM/AAAA, converte para MM/AA
    if (dateString.includes('/')) {
        const [month, year] = dateString.split('/');
        if (year.length === 4) {
            return `${month}/${year.slice(-2)}`;
        }
        return dateString;
    }
    
    return dateString;
}

async function submitClientRegistration(requestBody) {
    try {
        Swal.fire({
            title: 'Processando...',
            text: 'Cadastrando cliente, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch('/api/clients/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Cliente cadastrado com sucesso!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/client/login';
                }
            });
        } else {
            throw new Error(result.message || 'Erro no servidor');
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        
        let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        Swal.fire({
            icon: 'error',
            title: 'Erro no Cadastro',
            text: errorMessage,
            confirmButtonText: 'Tentar Novamente'
        });
    }
}

function validateForm(form) {
    const passwords = {
        password: form.querySelector("input[name='client-password']").value,
        confirmation: form.querySelector("input[name='client-password-repeat']").value
    };

    if (passwords.password !== passwords.confirmation) {
        Swal.fire({
            icon: 'warning',
            title: 'Senhas não coincidem',
            text: 'Por favor, verifique se as senhas são iguais.'
        });
        return false;
    }

    // Verificar se há pelo menos um endereço
    const addresses = form.querySelectorAll("#address");
    if (addresses.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Endereço obrigatório',
            text: 'É necessário cadastrar pelo menos um endereço.'
        });
        return false;
    }

    // Verificar se há pelo menos um cartão
    const cards = form.querySelectorAll("#card");
    if (cards.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cartão obrigatório',
            text: 'É necessário cadastrar pelo menos um cartão.'
        });
        return false;
    }

    return true;
}