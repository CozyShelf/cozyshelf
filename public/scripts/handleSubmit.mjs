const forms = document.querySelectorAll("form");

forms.forEach(form => {
	form.addEventListener("submit", (event) => {
		event.preventDefault();

		if (form.checkValidity()) {
			Swal.fire({
				title: "Dados enviados com sucesso",
				icon: "success",
				showCancelButton: false,
				confirmButtonText: "Ok",
				confirmButtonColor: "#863C13",
				iconColor: "#D6AE7C",
			});
			form.reset();
		} else {
			form.reportValidity();
		}
	});
});
