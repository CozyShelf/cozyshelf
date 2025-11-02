document.addEventListener('DOMContentLoaded', function() {
    const confirmExchangeButtons = document.querySelectorAll('.confirmExchange');

    confirmExchangeButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const orderId = this.dataset.orderId;
            
            this.disabled = true;
            this.textContent = 'Processando...';
            
            try {
                const response = await fetch(`/exchange/${orderId}/confirm`, {
                    method: 'POST',
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
                        window.location.reload();
                    });
                } else {
                    throw new Error(data.message || 'Erro ao confirmar troca');
                }
            } catch (error) {
                console.error('Error confirming exchange:', error);
                Swal.fire({
                    title: 'Erro!',
                    text: error.message || 'Erro ao confirmar a troca',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#8B4513'
                });
                
                this.disabled = false;
                this.textContent = this.dataset.originalText || 'Tentar Novamente';
            }
        });
        
        button.dataset.originalText = button.textContent;
    });
});