import { submitUpdateForm } from "../../generic/update/updateFormSubmit.mjs";
import { CARD_PATH, REDIRECT_PATH } from "../dispatcher/formCreateUpdateDispatcher.mjs";
import { validateForm } from "../validations/formValidations.mjs";
import { buildUpdateCardReqBody } from "./updateCardReqBody.mjs";

export async function handleCardUpdate(form) {
    if (!validateForm(form)) {
        return;
    }

    const cardId = getCardId();
    const requestBody = buildUpdateCardReqBody(form);

    await submitUpdateForm(CARD_PATH, requestBody, cardId, REDIRECT_PATH);
}

function getCardId() {
    const cardId = document.getElementById("cardId");
    if (!cardId) {
        throw new Error("ID do cartão não encontrado");
    }
    return cardId.value;
}