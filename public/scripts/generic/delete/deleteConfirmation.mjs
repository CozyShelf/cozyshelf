import { deleteFormSubmit } from "./deleteFormSubmit.mjs";

/**
 * Shows a confirmation popup for deleting an item using SweetAlert2
 * @param {string} itemType - Type of item to be deleted (e.g., 'address', 'product')
 * @param {string} deletePath - API endpoint for deletion (e.g., '/api/addresses/')
 * @param {string|number} itemId - ID of the item to be deleted
 * @returns {Promise<void>} Promise that resolves when the popup is displayed
 */
export async function deleteConfirmation( itemType, deletePath, itemId ) {
    Swal.fire({
        title: 'Você tem certeza?',
        text: `Esta ação irá deletar o ${itemType} permanentemente.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#9F9F9F',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sim, deletar!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteFormSubmit(deletePath, itemId);
        }
    });
}