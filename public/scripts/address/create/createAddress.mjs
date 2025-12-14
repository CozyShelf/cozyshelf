import { submitCreationForm } from "../../generic/create/createFormSubmit.mjs";
import {
	ADDRESS_PATH,
	REDIRECT_PATH,
} from "../dispatcher/formCreateUpdateDispatcher.mjs";
import { validateForm } from "../validations/formValidations.mjs";
import { buildNewAddressReqBody } from "./createAddressReqBody.mjs";

export async function handleAddressCreation(form, withRedirect = true) {
	if (!validateForm(form)) {
		return;
	}

	const requestBody = buildNewAddressReqBody(form);
	requestBody.clientId = "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";

	if (withRedirect) {
		await submitCreationForm(ADDRESS_PATH, requestBody, REDIRECT_PATH, true);
	} else {
		await submitCreationForm(ADDRESS_PATH, requestBody, null, false);
	}
}
