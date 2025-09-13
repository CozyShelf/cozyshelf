/**
 * Handles the submission of a delete form.
 * @param {string} deletePath - API endpoint for deletion (e.g., '/api/addresses/')
 * @param {string|number} itemId - ID of the item to be deleted
 * @returns {Promise<void>} Promise that resolves when the deletion is complete
 */
export async function deleteFormSubmit(deletePath, itemId) {
    try {
        const response = await fetch(`${deletePath}${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Deletado com sucesso.',
                confirmButtonText: 'OK'
            }).then(() => {
                location.reload();
            });
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao deletar.');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao deletar.',
            text: error.message,
            confirmButtonText: 'OK'
        });
    }
}