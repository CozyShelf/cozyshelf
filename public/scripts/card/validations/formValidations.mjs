export function validateForm(form) {
	const number = form.querySelector("input[name='card-number']").value;
	const cvv = form.querySelector("input[name='card-cvv']").value;
	const name = form.querySelector("input[name='card-impress-name']").value;
	const flag = form.querySelector("select[name='card-flag']").value;

	if (!number || number.length !== 19) {
		Swal.fire({
			icon: "warning",
			title: "Número inválido",
			text: "Preencha o número do cartão corretamente.",
			didOpen: () => {
				const modal = document.querySelector(".swal2-container");
				if (modal) {
					modal.setAttribute("id", "invalid-number-modal");
				}
			},
		});
		return false;
	}
	if (!cvv || cvv.length !== 3) {
		Swal.fire({
			icon: "warning",
			title: "CVV inválido",
			text: "Preencha o CVV corretamente.",
			didOpen: () => {
				const modal = document.querySelector(".swal2-container");
				if (modal) {
					modal.setAttribute("id", "invalid-cvv-modal");
				}
			},
		});
		return false;
	}

	if (!name || name.length < 3 || name.length > 30 || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
		Swal.fire({
			icon: "warning",
			title: "Nome obrigatório",
			text: "Preencha o nome impresso no cartão corretamente.",
			didOpen: () => {
				const modal = document.querySelector(".swal2-container");
				if (modal) {
					modal.setAttribute("id", "invalid-name-modal");
				}
			},
		});
		return false;
	}

	if (!flag) {
		Swal.fire({
			icon: "warning",
			title: "Bandeira obrigatória",
			text: "Selecione a bandeira do cartão.",
			didOpen: () => {
				const modal = document.querySelector(".swal2-container");
				if (modal) {
					modal.setAttribute("id", "invalid-flag-modal");
				}
			},
		});
		return false;
	}
	return true;
}
