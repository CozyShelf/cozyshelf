import { extractPhoneData } from "../validations/inputMasks.mjs";

export function buildUpdateClientReqBody(form) {
    const formData = new FormData(form);
    
    const phoneInput = form.querySelector("input[name='client-phone']");
    const phoneData = extractPhoneData(phoneInput.value);
    
    const clientData = {
        name: formData.get("client-name"),
        birthDate: formData.get("client-birth-date"),
        cpf: formData.get("client-cpf"),
        email: formData.get("client-email"),
        gender: formData.get("client-gender"),
        telephone: {
            ddd: phoneData.ddd,
            number: phoneData.number,
            type: formData.get("client-phone-type")
        }
    };

    return clientData;
}