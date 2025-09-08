document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const addressId = btn.getAttribute('href').replace('/', '');
            console.log(addressId);

            Swal.fire({
                title: 'Você tem certeza?',
                text: 'Esta ação irá inativar o endereço permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#9F9F9F',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Sim, inativar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteAddress(addressId);
                }
            });
        });
    });
});

async function deleteAddress(addressId) {
    try {
        // Mostrar loading
        Swal.fire({
            title: 'Processando...',
            text: 'Inativando endereço, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`/api/addresses/${addressId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Sucesso - recarregar página
            Swal.fire({
                icon: 'success',
                title: 'Endereço inativado!',
                text: 'O endereço foi inativado com sucesso.',
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
        console.error('Erro ao inativar endereço:', error);
        
        let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        Swal.fire({
            icon: 'error',
            title: 'Erro ao inativar endereço',
            text: errorMessage,
            confirmButtonText: 'Tentar Novamente'
        });
    }
}