import { extractPhoneData } from '../inputMasks/inputMasks.mjs';

export function setupClientDetailsForm() {
    const form = document.getElementById("client-details-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        if (!validateForm(form)) {
            return;
        }
    
        try {
            const requestBody = buildRequestBody(form);
            const clientId = getClientId();
            await submitClientUpdate(clientId, requestBody.clientData);
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
    
    // Dados pessoais do cliente para atualização
    const clientData = {
        name: formData.get("client-name"),
        birthDate: formData.get("client-birth-date"),
        cpf: formData.get("client-cpf"),
        email: formData.get("client-email"),
        gender: formData.get("client-gender"),
        telephone: {
            ddd: phoneData.ddd,
            number: phoneData.number,
            type: formData.get("client-phone-type")
        }
    };

    console.log("Client Data:", clientData);
    
    return { clientData };
}

function getClientId() {
    // Opção 1: Pegar de uma variável global (se disponível)
    if (window.clientId) {
        return window.clientId;
    }
    
    // Opção 2: Pegar de um data attribute no form
    const form = document.getElementById("client-details-form");
    const clientId = form.dataset.clientId;
    if (clientId) {
        return clientId;
    }
    
    // Opção 3: Pegar da URL (se estiver no formato /clients/:id/details)
    const pathParts = window.location.pathname.split('/');
    const clientsIndex = pathParts.indexOf('clients');
    if (clientsIndex !== -1 && pathParts[clientsIndex + 1]) {
        return pathParts[clientsIndex + 1];
    }
    
    throw new Error('ID do cliente não encontrado');
}

async function submitClientUpdate(clientId, requestBody) {
    try {
        Swal.fire({
            title: 'Processando...',
            text: 'Atualizando dados do cliente, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`/api/clients/${clientId}`, {
            method: 'PUT',
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
                text: 'Dados atualizados com sucesso!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
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
            title: 'Erro na Atualização',
            text: errorMessage,
            confirmButtonText: 'Tentar Novamente'
        });
    }
}

function validateForm(form) {
    // Validações básicas já são feitas pelo HTML (required fields)
    // Aqui você pode adicionar validações específicas se necessário
    
    const email = form.querySelector("input[name='client-email']").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'warning',
            title: 'Email inválido',
            text: 'Por favor, insira um email válido.'
        });
        return false;
    }

    return true;
}