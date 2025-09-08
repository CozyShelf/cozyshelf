document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Pega o id do cartão e se é preferencial do atributo data
            const cardId = extractCardIdFromUrl(btn.href);
            const isPreferred = btn.dataset.preferred === "true";

            if (isPreferred) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Não permitido',
                    text: 'Você não pode excluir o cartão preferencial. Defina outro cartão como preferencial antes de excluir este.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            Swal.fire({
                title: 'Você tem certeza?',
                text: 'Esta ação irá excluir o cartão permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#9F9F9F',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Sim, excluir!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteCard(cardId);
                }
            });
        });
    });
});

async function deleteCard(cardId) {
    try {
        Swal.fire({
            title: 'Processando...',
            text: 'Excluindo cartão, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`/api/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Cartão excluído!',
                text: 'O cartão foi excluído com sucesso.',
                confirmButtonText: 'OK'
            }).then(() => {
                location.reload();
            });
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no servidor');
        }

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao excluir cartão',
            text: error.message || 'Ocorreu um erro inesperado.'
        });
    }
}

function extractCardIdFromUrl(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}