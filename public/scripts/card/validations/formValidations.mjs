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
		});
		return false;
	}
	if (!cvv || cvv.length !== 3) {
		Swal.fire({
			icon: "warning",
			title: "CVV inválido",
			text: "Preencha o CVV corretamente.",
		});
		return false;
	}

	if (!name) {
		Swal.fire({
			icon: "warning",
			title: "Nome obrigatório",
			text: "Preencha o nome impresso no cartão.",
		});
		return false;
	}
	if (!flag) {
		Swal.fire({
			icon: "warning",
			title: "Bandeira obrigatória",
			text: "Selecione a bandeira do cartão.",
		});
		return false;
	}
	return true;
}
