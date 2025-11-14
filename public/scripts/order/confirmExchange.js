document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => initConfirmExchangeModal(), 100);
});

function initConfirmExchangeModal() {
    const confirmExchangeBtn = document.getElementById('confirm-exchange-btn'); // Use ID específico
    const confirmStockModal = document.getElementById('confirm-stock-modal');
    const closeStockModalBtn = document.getElementById('close-confirm-stock-modal');
    const cancelStockBtn = document.getElementById('cancel-stock-confirmation');
    const confirmStockBtn = document.getElementById('confirm-stock-return');
    const returnAllCheckbox = document.getElementById('return-all-to-stock');
    const stockCheckboxes = document.querySelectorAll('.stock-checkbox');
    const stockQuantityInputs = document.querySelectorAll('.stock-quantity');
    const selectedCountSpan = document.getElementById('selected-count');

    console.log('Inicializando modal de confirmação...'); // Debug
    console.log('Botão encontrado:', confirmExchangeBtn); // Debug

    // Abrir modal quando clicar no botão "Confirmar Troca"
    if (confirmExchangeBtn && confirmStockModal) {
        confirmExchangeBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Previne comportamento padrão
            e.stopPropagation(); // Para a propagação do evento
            
            console.log('Abrindo modal...'); // Debug
            confirmStockModal.classList.remove('hidden');
            updateSelectedCount();
        });
    }

    // Fechar modal
    function closeStockModal(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (confirmStockModal) {
            console.log('Fechando modal...'); // Debug
            confirmStockModal.classList.add('hidden');
        }
    }

    // Event listeners para fechar modal
    if (closeStockModalBtn) {
        closeStockModalBtn.addEventListener('click', closeStockModal);
    }
    if (cancelStockBtn) {
        cancelStockBtn.addEventListener('click', closeStockModal);
    }

    // Fechar modal ao clicar fora - mas NÃO no conteúdo do modal
    if (confirmStockModal) {
        confirmStockModal.addEventListener('click', function(e) {
            // Só fecha se clicou no backdrop (fora do conteúdo)
            if (e.target === confirmStockModal) {
                closeStockModal(e);
            }
        });
    }

    // Selecionar/deselecionar todos os itens
    if (returnAllCheckbox) {
        returnAllCheckbox.addEventListener('change', function() {
            stockCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                const quantityInput = document.getElementById(`stock-quantity-${checkbox.dataset.bookId}`);
                if (quantityInput) {
                    quantityInput.disabled = !this.checked;
                    if (!this.checked) {
                        quantityInput.value = 0;
                    } else {
                        quantityInput.value = quantityInput.dataset.max;
                    }
                }
            });
            updateSelectedCount();
        });
    }

    // Gerenciar checkboxes individuais
    stockCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const quantityInput = document.getElementById(`stock-quantity-${this.dataset.bookId}`);
            if (quantityInput) {
                quantityInput.disabled = !this.checked;
                if (!this.checked) {
                    quantityInput.value = 0;
                } else {
                    quantityInput.value = quantityInput.dataset.max;
                }
            }
            updateReturnAllCheckbox();
            updateSelectedCount();
        });
    });

    // Validar quantidades
    stockQuantityInputs.forEach(input => {
        input.addEventListener('input', function() {
            const max = parseInt(this.dataset.max);
            const value = parseInt(this.value);
            
            if (value > max) {
                this.value = max;
            } else if (value < 0) {
                this.value = 0;
            }
        });
    });

    // Atualizar estado do checkbox "selecionar todos"
    function updateReturnAllCheckbox() {
        const checkedBoxes = document.querySelectorAll('.stock-checkbox:checked');
        if (returnAllCheckbox) {
            returnAllCheckbox.checked = checkedBoxes.length === stockCheckboxes.length;
            returnAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < stockCheckboxes.length;
        }
    }

    // Atualizar contador de selecionados
    function updateSelectedCount() {
        const checkedBoxes = document.querySelectorAll('.stock-checkbox:checked');
        if (selectedCountSpan) {
            selectedCountSpan.textContent = checkedBoxes.length;
        }
    }

    // Confirmar retorno ao estoque
    if (confirmStockBtn) {
        confirmStockBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            await handleStockConfirmation();
        });
    }

    // Função principal para confirmar troca
    async function handleStockConfirmation() {
        console.log("handleStockConfirmation chamado!");

        const selectedItems = [];
        
        stockCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const quantityInput = document.getElementById(`stock-quantity-${checkbox.dataset.bookId}`);
                const quantity = parseInt(quantityInput.value) || 0;
                
                if (quantity > 0) {
                    selectedItems.push({
                        bookId: checkbox.dataset.bookId,
                        quantity: quantity
                    });
                }
            }
        });

        if (selectedItems.length === 0) {
            Swal.fire({
                title: 'Atenção!',
                text: 'Selecione pelo menos um item para retornar ao estoque.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#863C13'
            });
            return;
        }

        const requestObj = {
            returnToStock: selectedItems
        };

        const orderId = confirmExchangeBtn.dataset.orderId;

        console.log("Enviando requisição de confirmação de troca:", requestObj);

        try {
            confirmStockBtn.disabled = true;
            confirmStockBtn.textContent = 'Processando...';

            const response = await fetch(`/exchange/${orderId}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestObj)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao confirmar troca');
            }

            const data = await response.json();
            console.log("Resposta do servidor:", data);

            Swal.fire({
                title: 'Sucesso!',
                text: 'Troca confirmada e itens retornados ao estoque com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#2E7D32'
            }).then(() => {
                window.location.reload();
            });

            closeStockModal();

        } catch (error) {
            console.error('Erro na requisição de confirmação:', error);
            
            Swal.fire({
                title: 'Erro!',
                text: error.message || 'Erro ao confirmar a troca',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#863C13'
            });
        } finally {
            if (confirmStockBtn) {
                confirmStockBtn.disabled = false;
                confirmStockBtn.textContent = 'Confirmar Retorno ao Estoque';
            }
        }
    }

    // Inicializar estado
    updateSelectedCount();
}

// Função global para abrir o modal (caso seja chamada externamente)
window.openStockConfirmationModal = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const confirmStockModal = document.getElementById('confirm-stock-modal');
    if (confirmStockModal) {
        console.log('Abrindo modal via função global...'); // Debug
        confirmStockModal.classList.remove('hidden');
        const selectedCountSpan = document.getElementById('selected-count');
        if (selectedCountSpan) {
            const checkedBoxes = document.querySelectorAll('.stock-checkbox:checked');
            selectedCountSpan.textContent = checkedBoxes.length;
        }
    }
};