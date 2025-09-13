import { deleteConfirmationPopup } from "../../generic/delete/deleteConfirmationPopup.mjs";

const INACTIVE_CLIENT_URL = '/api/clients/';

document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            
            const clientId = btn.getAttribute('href').replace('/', '');
            deleteConfirmationPopup('cliente', INACTIVE_CLIENT_URL, clientId);
        });
    });
});