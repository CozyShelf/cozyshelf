export function validateForm(form) {
   const zipCode = form.querySelector("input[name='address-zip-code']").value;

    // Validar CEP (formato XXXXX-XXX) - apenas se preenchido
    if (zipCode) {
        const zipCodeRegex = /^\d{5}-\d{3}$/;
        if (!zipCodeRegex.test(zipCode)) {
            Swal.fire({
                icon: 'warning',
                title: 'CEP inválido',
                text: 'Por favor, insira um CEP válido no formato XXXXX-XXX.'
            });
            return false;
        }
    }

    return true;
}
