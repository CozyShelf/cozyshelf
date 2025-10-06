/**
 * Handles the submission of a create form.
 * @param {string} createPath - API endpoint for creation (e.g., '/api/addresses/')
 * @param {Object} requestBody - Data to be sent in the request body
 * @param {string} redirectPath - Path to redirect after successful creation
 * @returns {Promise<void>} - Promise that resolves when the creation is complete
 */
export async function submitCreationForm(
	createPath,
	requestBody,
	redirectPath,
	withRedirect = false
) {
	try {
		const response = await fetch(createPath, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		// Verifica se a resposta tem conteúdo JSON válido
		const contentType = response.headers.get("content-type");
		let result;

		if (contentType && contentType.includes("application/json")) {
			result = await response.json();
		} else {
			// Se não é JSON, trata como erro (provavelmente HTML de erro 404/500)
			const errorText = await response.text();
			throw new Error(
				`Rota não implementada ou erro no servidor (${response.status}): ${createPath}`
			);
		}

		if (response.ok) {
			Swal.fire({
				icon: "success",
				title: "Sucesso!",
				text: "Cadastrado com sucesso!",
				confirmButtonText: "OK",
				customClass: {
					container: "success-modal-container",
				},
				didOpen: () => {
					const modal = document.querySelector(".swal2-container");
					if (modal) {
						modal.setAttribute("id", "success-modal");
					}
				},
			}).then((result) => {
				if (withRedirect) {
					if (result.isConfirmed) window.location.href = redirectPath;
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
			title: "Erro no Cadastro",
			text: errorMessage,
			confirmButtonText: "Tentar Novamente",
			customClass: {
				container: "error-modal-container",
			},
			didOpen: () => {
				const modal = document.querySelector(".swal2-container");
				if (modal) {
					modal.setAttribute("id", "error-modal");
				}
			},
		});
	}
}
