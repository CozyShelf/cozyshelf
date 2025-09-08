document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            
            const clientId = extractClientIdFromUrl(btn.href);
            
            Swal.fire({
                title: 'Você tem certeza?',
                text: 'Esta ação irá inativar o cliente permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#9F9F9F',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Sim, inativar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteClient(clientId);
                }
            });
        });
    });
});

async function deleteClient(clientId) {
    try {
        // Mostrar loading
        Swal.fire({
            title: 'Processando...',
            text: 'Inativando cliente, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`/api/clients/${clientId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Sucesso - recarregar página
            Swal.fire({
                icon: 'success',
                title: 'Cliente inativado!',
                text: 'O cliente foi inativado com sucesso.',
                confirmButtonText: 'OK'
            }).then(() => {
                location.reload();
            });
        } else {
            // Erro do servidor
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no servidor');
        }

    } catch (error) {
        console.error('Erro ao inativar cliente:', error);
        
        let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        Swal.fire({
            icon: 'error',
            title: 'Erro ao inativar cliente',
            text: errorMessage,
            confirmButtonText: 'Tentar Novamente'
        });
    }
}

function extractClientIdFromUrl(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}