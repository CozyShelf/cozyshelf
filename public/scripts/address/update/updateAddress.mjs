import { submitUpdateForm } from "../../generic/update/updateFormSubmit.mjs";
import { buildUpdateAddressReqBody } from "./updateAddressReqBody.mjs";
import { validateForm } from "../validations/formValidations.mjs";
import { ADDRESS_PATH, REDIRECT_PATH } from "../dispatcher/formCreateUpdateDispatcher.mjs";

export async function handleAddressUpdate(form) {
    if (!validateForm(form)) {
        return;
    }
    
    const requestBody = buildUpdateAddressReqBody(form);
    const addressId = getAddressId();
    
    await submitUpdateForm(ADDRESS_PATH, requestBody, addressId, REDIRECT_PATH); 
}

function getAddressId() {
    const addressId = document.getElementById("addressId");
    if (!addressId) { throw new Error('ID do endereço não encontrado') }
    return addressId.value;
}