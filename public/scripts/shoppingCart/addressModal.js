document.addEventListener('DOMContentLoaded', function () {
    const addAddressBtn = document.getElementById('add-address');
    const modalContainer = document.getElementById('address-modal-container');
    const closeModalBtn = document.getElementById('close-address-modal');

    if (addAddressBtn && modalContainer && closeModalBtn) {
        addAddressBtn.addEventListener('click', () => {
            modalContainer.classList.remove('hidden');

            const requiredInputs = modalContainer.querySelectorAll('input[disabled], select[disabled], textarea[disabled]');
            requiredInputs.forEach(input => {
                input.removeAttribute('disabled');
                input.setAttribute('required', 'required');
            });
        });

        closeModalBtn.addEventListener('click', () => {
            modalContainer.classList.add('hidden');
            const requiredInputs = modalContainer.querySelectorAll('input[required], select[required], textarea[required]');
            requiredInputs.forEach(input => {
                input.removeAttribute('required');
                input.setAttribute('disabled', 'disabled');
            });
        });
        
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.add('hidden');
            }
        });
    }
});