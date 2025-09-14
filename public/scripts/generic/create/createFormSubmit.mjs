/**
 * Handles the submission of a create form.
 * @param {string} createPath - API endpoint for creation (e.g., '/api/addresses/')
 * @param {Object} requestBody - Data to be sent in the request body
 * @param {string} redirectPath - Path to redirect after successful creation
 * @returns {Promise<void>} - Promise that resolves when the creation is complete
 */
export async function submitCreationForm(createPath, requestBody, redirectPath) {
    try {
   
        const response = await fetch(createPath, {
            method: 'POST',
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
                text: 'Cadastrado com sucesso!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) window.location.href = redirectPath;
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
            title: 'Erro no Cadastro',
            text: errorMessage,
            confirmButtonText: 'Tentar Novamente'
        });
    }
}