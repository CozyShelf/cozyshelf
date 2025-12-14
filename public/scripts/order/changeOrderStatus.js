document.addEventListener('DOMContentLoaded', function() {
    const changeStatusButtons = document.querySelectorAll('.changeStatus');

    changeStatusButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const orderId = this.dataset.orderId;
            const newStatus = this.dataset.status;
            
            // Disable button while processing
            this.disabled = true;
            this.textContent = 'Processando...';
            
            try {
                const response = await fetch(`/api/orders/${orderId}/status/${newStatus}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    // Show success popup
                    Swal.fire({
                        title: 'Sucesso!',
                        text: data.message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#8B4513'
                    }).then(() => {
                        // Reload the page to show updated status
                        window.location.reload();
                    });
                } else {
                    throw new Error(data.message || 'Erro ao atualizar status');
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                
                // Show error popup
                Swal.fire({
                    title: 'Erro!',
                    text: error.message || 'Erro ao atualizar o status do pedido',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#8B4513'
                });
                
                // Re-enable button and restore original text
                this.disabled = false;
                this.textContent = this.dataset.originalText || 'Tentar Novamente';
            }
        });
        
        // Store original button text
        button.dataset.originalText = button.textContent;
    });
});