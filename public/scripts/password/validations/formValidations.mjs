
export function validateForm(form) {
    const currentPassword = form.querySelector("input[name='current-password']").value;
    const newPassword = form.querySelector("input[name='new-password']").value;
    const confirmNewPassword = form.querySelector("input[name='confirm-new-password']").value;

    // Verificar se as novas senhas coincidem
    if (newPassword !== confirmNewPassword) {
        Swal.fire({
					icon: "warning",
					title: "Senhas não coincidem",
					text: "A nova senha e a confirmação devem ser iguais.",
					customClass: {
						container: "invalid-password-confirmation",
					},
					didOpen: () => {
						const modal = document.querySelector(".swal2-container");
						if (modal) {
							modal.setAttribute("id", "invalid-password-confirmation");
						}
					},
				});
        return false;
    }

    // Verificar se a nova senha não é igual à atual
    if (currentPassword === newPassword) {
        Swal.fire({
					icon: "warning",
					title: "Nova senha inválida",
					text: "A nova senha deve ser diferente da senha atual.",
					customClass: {
						container: "invalid-new-password",
					},
					didOpen: () => {
						const modal = document.querySelector(".swal2-container");
						if (modal) {
							modal.setAttribute("id", "invalid-new-password");
						}
					},
				});
        return false;
    }

    return true;
}
