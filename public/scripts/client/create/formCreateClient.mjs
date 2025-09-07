export function setupClientForm() {
    const form = document.getElementById("client-register-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        try {
            const requestBody = buildRequestBody(form);
            console.log("Request Body:", requestBody); // Debug
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
    
    // Dados pessoais do cliente
    const clientData = {
        name: formData.get("client-name"),
        birthDate: formData.get("client-birth-date"),
        cpf: formData.get("client-cpf"),
        email: formData.get("client-email"),
        password: {
            value: formData.get("client-password"),
            confirmation: formData.get("client-password-repeat")
        },
        gender: formData.get("client-gender"),
        telephone: {
            ddd: formData.get("client-phone").substring(0, 2), // Extrair DDD
            number: formData.get("client-phone").substring(2), // Extrair número
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
            zipCode: addressData.get("address-cep"),
            number: addressData.get("address-number"),
            residenceType: addressData.get("address-residence-type"),
            streetName: addressData.get("address-street-name"),
            streetType: addressData.get("address-street-type"),
            neighborhood: addressData.get("address-neighborhood"),
            shortPhrase: addressData.get("address-short-phrase"),
            observation: "", // Campo não presente no formulário
            city: addressData.get("address-city"),
            state: addressData.get("address-state"),
            country: {
                name: "Brasil",
                acronym: "BR"
            },
            type: addressData.get("address-street-type") // Assumindo que é o último select
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

        // Verificar se é preferencial - correção aqui
        const isPreferredCheckbox = cardDiv.querySelector("input[name='card-is-preferred'][type='checkbox']");
        const isPreferred = isPreferredCheckbox ? isPreferredCheckbox.checked : false;

        const card = {
            number: cardData.get("card-number"),
            nameOnCard: cardData.get("card-impress-name"),
            cvv: cardData.get("card-cvv"),
            expiryDate: generateExpiryDate(), // Função auxiliar para gerar data de expiração
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

function generateExpiryDate() {
    // Gera uma data de expiração futura (2 anos a partir de agora)
    const now = new Date();
    const expiryYear = (now.getFullYear() + 2).toString().slice(-2);
    const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
    return `${expiryMonth}/${expiryYear}`;
}

async function submitClientRegistration(requestBody) {
    try {
        // Mostrar loading
        Swal.fire({
            title: 'Processando...',
            text: 'Cadastrando cliente, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch('/client/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            // Sucesso
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Cliente cadastrado com sucesso!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirecionar ou limpar formulário
                    window.location.href = '/client/login'; // ou outra página
                }
            });
        } else {
            // Erro do servidor
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

// Função auxiliar para validar formulário antes do envio
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