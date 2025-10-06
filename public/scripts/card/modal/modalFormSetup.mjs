import { setupCardInputMasks } from "../validations/inputMasks.mjs";
import { handleCardCreation } from "../create/createCard.mjs";
import { handleCardUpdate } from "../update/updateCard.mjs";

/**
 * Configura os event listeners e funcionalidades para formulários de cartão em modais
 * Esta função deve ser chamada quando o modal é aberto
 */
export function setupCardModalForm() {
	// Setup das máscaras
	setupCardInputMasks();

	// Setup do dispatcher para o formulário do modal
	const form = document.getElementById("card-form");

	if (!form) {
		console.warn("Card form not found in modal");
		return;
	}

	// Remove listener existente se houver
	const newForm = form.cloneNode(true);
	form.parentNode.replaceChild(newForm, form);

	// Adiciona novo listener
	newForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const submitButton = newForm.querySelector('button[type="submit"]');
		const isUpdate = submitButton.id === "updateCard";

		if (isUpdate) {
			await handleCardUpdate(newForm);
		} else {
			await handleCardCreation(newForm);
		}
	});

	return newForm;
}
