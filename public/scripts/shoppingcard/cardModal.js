document.addEventListener('DOMContentLoaded', function () {
    const addPaymentBtn = document.getElementById('add-payment');
    const modalContainer = document.getElementById('modal-container');
    const closeModalBtn = document.getElementById('close-modal');

    if (addPaymentBtn && modalContainer && closeModalBtn) {
        addPaymentBtn.addEventListener('click', () => {
            modalContainer.classList.remove('hidden');

            const inputs = modalContainer.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.removeAttribute('required');
                input.setAttribute('disabled', 'disabled');
            });
        });

        closeModalBtn.addEventListener('click', () => {
            modalContainer.classList.add('hidden');

            const inputs = modalContainer.querySelectorAll('input[disabled]');
            inputs.forEach(input => {
                input.removeAttribute('disabled');
                input.setAttribute('required', 'required');
            });
        });
        
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.add('hidden');
            }
        });
    }
});