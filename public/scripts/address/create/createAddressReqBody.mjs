/**
 * Constrói o corpo da requisição para criar um novo endereço.
 * @param {HTMLFormElement} form - O formulário contendo os dados do endereço.
 * @returns {Object} O corpo da requisição formatado conforme INewAddressData.
 */
export function buildNewAddressReqBody(form) {
    const formData = new FormData(form);

    const newAddressReqBody = {
        zipCode: formData.get("address-zip-code"),
        number: formData.get("address-number"),
        residenceType: formData.get("address-residence-type"),
        streetName: formData.get("address-street-name"),
        streetType: formData.get("address-street-type"),
        neighborhood: formData.get("address-neighborhood"),
        shortPhrase: formData.get("address-short-phrase"),
        observation: formData.get("address-observation") || "", // Opcional
        city: formData.get("address-city"),
        state: formData.get("address-state"),
        country: {
            name: "Brasil",
            acronym: "BR"
        },
        type: formData.get("address-type")
    };

    return newAddressReqBody;
}