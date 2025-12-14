export function validateForm(form) {
	// Validar campos obrigatórios
	const requiredFields = [
		{ name: "address-short-phrase", label: "Frase Curta" },
		{ name: "address-zip-code", label: "CEP" },
		{ name: "address-state", label: "Estado" },
		{ name: "address-city", label: "Cidade" },
		{ name: "address-street-type", label: "Tipo Logradouro" },
		{ name: "address-street-name", label: "Logradouro" },
		{ name: "address-number", label: "Número" },
		{ name: "address-neighborhood", label: "Bairro" },
		{ name: "address-residence-type", label: "Complemento" },
		{ name: "address-type", label: "Tipo de Endereço" },
	];

	// Verificar se todos os campos obrigatórios estão preenchidos
	for (const field of requiredFields) {
		const element = form.querySelector(`[name='${field.name}']`);
		const value = element?.value?.trim();

		if (!value || value === "") {
			Swal.fire({
				icon: "warning",
				title: "Campo obrigatório",
				text: `O campo '${field.label}' é obrigatório.`,
				didOpen: () => {
					const modal = document.querySelector(".swal2-container");
					if (modal) {
						modal.setAttribute("id", "required-field-modal");
					}
				},
			});

			// Focar no campo que está vazio
			if (element) {
				element.focus();
			}

			return false;
		}
	}

	const zipCode = form.querySelector("input[name='address-zip-code']").value;

	// Validar CEP (formato XXXXX-XXX) - apenas se preenchido
	if (zipCode) {
		const zipCodeRegex = /^\d{5}-\d{3}$/;
		if (!zipCodeRegex.test(zipCode)) {
			Swal.fire({
				icon: "warning",
				title: "CEP inválido",
				text: "Por favor, insira um CEP válido no formato XXXXX-XXX.",
				didOpen: () => {
					const modal = document.querySelector(".swal2-container");
					if (modal) {
						modal.setAttribute("id", "invalid-zip-code-modal");
					}
				},
			});
			return false;
		}
	}

	return true;
}
