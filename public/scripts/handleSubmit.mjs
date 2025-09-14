const forms = document.querySelectorAll("form");
const modalAddress = document.getElementById("address-modal-container");
const modalCard = document.getElementById("modal-container");

forms.forEach((form) => {
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
				customClass: {
					container: "success-modal-container",
				},
				didOpen: () => {
					const modal = document.querySelector(".swal2-container");
					if (modal) {
						modal.setAttribute("id", "success-modal");
					}
				},
			});
			form.reset();

			if (modalAddress) {
				modalAddress.classList.add("hidden");
				form.classList.add("form-modal-hidden");
			}

			if (modalCard) {
				modalCard.classList.add("hidden");
				form.classList.add("form-modal-hidden");
			}
		} else {
			form.reportValidity();
		}
	});
});
