export function setupPasswordUpdateForm() {
    const form = document.getElementById("update-password-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        if (!validateForm(form)) {
            return;
        }
    
        try {
            const requestBody = buildRequestBody(form);
            console.log("Request Body:", requestBody);
            
            const clientId = getClientId();
            await submitPasswordUpdate(clientId, requestBody);
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
    
    // Dados para atualização de senha conforme IUpdatePasswordData
    const passwordData = {
        currentPassword: formData.get("current-password"),
        newPassword: formData.get("new-password"),
        newPasswordConfirmation: formData.get("confirm-new-password")
    };

    return passwordData;
}
function getClientId() {
    // Pegar da URL no formato /clients/:id/password
    const pathParts = window.location.pathname.split('/');
    const clientsIndex = pathParts.indexOf('clients');
    if (clientsIndex !== -1 && pathParts[clientsIndex + 1]) {
        return pathParts[clientsIndex + 1];
    }
    
    throw new Error('ID do cliente não encontrado na URL');
}

async function submitPasswordUpdate(clientId, requestBody) {
    try {
        Swal.fire({
            title: 'Processando...',
            text: 'Atualizando senha, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`/api/clients/${clientId}/password`, {
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
                text: 'Senha atualizada com sucesso!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Limpar o formulário após sucesso
                    document.getElementById("update-password-form").reset();
                    // Opcional: redirecionar para página de perfil
                    // window.location.href = '/clients/profile';
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
    const currentPassword = form.querySelector("input[name='current-password']").value;
    const newPassword = form.querySelector("input[name='new-password']").value;
    const confirmNewPassword = form.querySelector("input[name='confirm-new-password']").value;

    // Verificar se as novas senhas coincidem
    if (newPassword !== confirmNewPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Senhas não coincidem',
            text: 'A nova senha e a confirmação devem ser iguais.'
        });
        return false;
    }

    // Verificar se a nova senha não é igual à atual
    if (currentPassword === newPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Nova senha inválida',
            text: 'A nova senha deve ser diferente da senha atual.'
        });
        return false;
    }

    return true;
}