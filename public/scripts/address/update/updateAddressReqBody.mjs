/**
 * Builds the request body for updating an address.
 * Only includes fields that are not empty (optional fields for update).
 * @param {HTMLFormElement} form - The form containing the address data.
 * @returns {Object} The request body formatted for updating an address.
 */
export function buildUpdateAddressReqBody(form) {
    const formData = new FormData(form);

    const updateData = {};

    // Apenas adicionar campos que não estão vazios (campos opcionais para update)
    const zipCode = formData.get("address-zip-code");
    if (zipCode) updateData.zipCode = zipCode;

    const number = formData.get("address-number");
    if (number) updateData.number = number;

    const residenceType = formData.get("address-residence-type");
    if (residenceType) updateData.residenceType = residenceType;

    const streetName = formData.get("address-street-name");
    if (streetName) updateData.streetName = streetName;

    const streetType = formData.get("address-street-type");
    if (streetType) updateData.streetType = streetType;

    const neighborhood = formData.get("address-neighborhood");
    if (neighborhood) updateData.neighborhood = neighborhood;

    const shortPhrase = formData.get("address-short-phrase");
    if (shortPhrase) updateData.shortPhrase = shortPhrase;

    const observation = formData.get("address-observation");
    if (observation) updateData.observation = observation;

    const city = formData.get("address-city");
    if (city) updateData.city = city;

    const state = formData.get("address-state");
    if (state) updateData.state = state;

    const type = formData.get("address-type");
    if (type) updateData.type = type;

    updateData.country = {
        name: "Brasil",
        acronym: "BR"
    };

    updateData.clientId = "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";

    return updateData;
}