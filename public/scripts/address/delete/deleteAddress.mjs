import { deleteConfirmation } from "../../generic/delete/deleteConfirmation.mjs";

const DELETE_ADDRESS_URL = '/api/addresses/';

document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
            e.preventDefault();

            const addressId = btn.getAttribute('href').replace('/', '');
            deleteConfirmation('endereço', DELETE_ADDRESS_URL, addressId);
        });
    });
});