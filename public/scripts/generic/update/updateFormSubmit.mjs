/**
 * Handles the submission of an update form.
 * @param {string} updatePath - API endpoint for updating (e.g., '/api/addresses')
 * @param {Object} requestBody - Data to be sent in the request body
 * @param {string} itemId - ID of the item to be updated
 * @param {string} redirectPath - Path to redirect after successful update
 * @returns {Promise<void>} - Promise that resolves when the update is complete
 */
export async function submitUpdateForm(
	updatePath,
	requestBody,
	itemId,
	redirectPath
) {
	try {
		const response = await fetch(`${updatePath}${itemId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		});

		const result = await response.json();

		if (response.ok) {
			Swal.fire({
				icon: "success",
				title: "Sucesso!",
				text: "Atualizado com sucesso!",
				confirmButtonText: "OK",
				customClass: {
					container: "updated-successfully",
				},
				didOpen: () => {
					const modal = document.querySelector(".swal2-container");
					if (modal) {
						modal.setAttribute("id", "updated-successfully");
					}
				},
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.href = redirectPath;
				}
			});
		} else {
			throw new Error(result.message || "Erro no servidor");
		}
	} catch (error) {
		console.error("Erro na requisição:", error);
		let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";

		if (error.message.includes("Failed to fetch")) {
			errorMessage =
				"Erro de conexão. Verifique sua internet e tente novamente.";
		} else if (error.message) {
			errorMessage = error.message;
		}

		Swal.fire({
			icon: "error",
			title: "Erro na Atualização",
			text: errorMessage,
			confirmButtonText: "Tentar Novamente",
			customClass: {
				container: "update-error",
			},
			didOpen: () => {
				const modal = document.querySelector(".swal2-container");
				if (modal) {
					modal.setAttribute("id", "update-error");
				}
			},
		});
	}
}
