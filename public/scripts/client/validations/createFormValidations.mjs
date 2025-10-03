export function validateForm(form) {
    const passwords = {
        password: form.querySelector("input[name='client-password']").value,
        confirmation: form.querySelector("input[name='client-password-repeat']").value
    };

    if (passwords.password !== passwords.confirmation) {
        Swal.fire({
					icon: "warning",
					title: "Senhas não coincidem",
					text: "Por favor, verifique se as senhas são iguais.",
					customClass: {
						container: "invalid-password-repeat-modal-container",
					},
					didOpen: () => {
						const modal = document.querySelector(".swal2-container");
						if (modal) {
							modal.setAttribute("id", "invalid-password-repeat-modal");
						}
					},
				});
        return false;
    }

    const addresses = form.querySelectorAll("#address");
    if (addresses.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Endereço obrigatório',
            text: 'É necessário cadastrar pelo menos um endereço.'
        });
        return false;
    }

    // Verificar se há pelo menos um cartão
    const cards = form.querySelectorAll("#card");
    if (cards.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cartão obrigatório',
            text: 'É necessário cadastrar pelo menos um cartão.'
        });
        return false;
    }

    return true;
}
