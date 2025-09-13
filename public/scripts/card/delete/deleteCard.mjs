import { deleteConfirmationPopup } from "../../generic/delete/deleteConfirmationPopup.mjs";

const CARD_DELETE_URL = '/api/cards/';

document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            
            const cardId = btn.href.split('/').pop();
            const isPreferred = btn.dataset.preferred === "true";

            if (isPreferred) {
                warnNotAllowedToDeletePreferredCard();
                return;
            }

            deleteConfirmationPopup('cartão', CARD_DELETE_URL, cardId);
        });
    });
});

function warnNotAllowedToDeletePreferredCard() {
    Swal.fire({
        icon: 'warning',
        title: 'Não permitido',
        text: 'Você não pode excluir o cartão preferencial. Defina outro cartão como preferencial antes de excluir este.',
        confirmButtonText: 'OK'
    });
}