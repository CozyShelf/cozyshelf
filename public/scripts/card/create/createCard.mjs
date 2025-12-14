import { submitCreationForm } from "../../generic/create/createFormSubmit.mjs";
import {
	CARD_PATH,
	REDIRECT_PATH,
} from "../dispatcher/formCreateUpdateDispatcher.mjs";
import { validateForm } from "../validations/formValidations.mjs";
import { buildNewCardReqBody } from "./createCardReqBody.mjs";

export async function handleCardCreation(form, withRedirect = true) {
	if (!validateForm(form)) {
		return;
	}

	const requestBody = buildNewCardReqBody(form);

	const isPreferred =
		form.querySelector("input[name='card-is-preferred']:checked") !== null;
	requestBody.isPreferred = isPreferred;

	requestBody.clientId = "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";

	if (withRedirect) {
		await submitCreationForm(CARD_PATH, requestBody, REDIRECT_PATH, true);
	} else {
		await submitCreationForm(CARD_PATH, requestBody, null, false);
	}
}
