import { buildNewAddressReqBody } from "../../address/create/createAddressReqBody.mjs";
import { buildNewCardReqBody } from "../../card/create/createCardReqBody.mjs";
import { extractPhoneData } from '../validations/inputMasks.mjs';

export function buildCreateClientReqBody(form) {
    const formData = new FormData(form);

    const phoneInput = form.querySelector("input[name='client-phone']");
    const phoneData = extractPhoneData(phoneInput.value);
    
    const clientData = {
        name: formData.get("client-name"),
        birthDate: formData.get("client-birth-date"),
        cpf: formData.get("client-cpf"),
        email: formData.get("client-email"),
        password: {
            value: formData.get("client-password"),
            confirmation: formData.get("client-password-repeat")
        },
        gender: formData.get("client-gender"),
        telephone: {
            ddd: phoneData.ddd,
            number: phoneData.number,
            type: formData.get("client-phone-type")
        }
    };

    const addresses = [];
    const addressDivs = form.querySelectorAll("#address");
    
    addressDivs.forEach((addressDiv) => {
        const addressData = new FormData();
        const inputs = addressDiv.querySelectorAll("input, select");
        
        inputs.forEach(input => {
            if (input.name && input.value) {
                addressData.set(input.name, input.value);
            }
        });

        const address = buildNewAddressReqBody(addressData);
        addresses.push(address);
    });
    
    const cards = [];
    const cardDivs = form.querySelectorAll("#card");
    
    cardDivs.forEach((cardDiv) => {
        const cardData = new FormData();
        const inputs = cardDiv.querySelectorAll("input, select");
        
        inputs.forEach(input => {
            if (input.name && input.value && input.type !== 'checkbox') {
                cardData.set(input.name, input.value);
            }
        });

        const card = buildNewCardReqBody(cardData);
        cards.push(card);
    });

    return {
        clientData,
        addresses,
        cards
    };
}