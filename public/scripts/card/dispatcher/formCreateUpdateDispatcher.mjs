import { handleCardCreation } from "../create/createCard.mjs";
import { handleCardUpdate } from "../update/updateCard.mjs";

export const REDIRECT_PATH =
	"/cards/client/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";
export const CARD_PATH = "/api/cards/";

export function setupCardFormDispatcher(withRedirect = true) {
	const form = document.getElementById("card-form");

	if (!form) {
		console.warn("Card form not found on this page");
		return;
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const submitButton = form.querySelector('button[type="submit"]');
		const isUpdate = submitButton.id === "updateCard";

		if (isUpdate) {
			await handleCardUpdate(form);
		} else {
			await handleCardCreation(form, withRedirect);
		}
	});
}
