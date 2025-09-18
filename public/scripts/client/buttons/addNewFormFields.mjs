import { removeAddressField, removeCardField, updateRemoveButtonsVisibility } from './removeNewFormFields.mjs';

export function setupFormFieldAdders() {
    const form = document.getElementById("client-register-form");
    const addresses = form.querySelector("#addresses");
    const cards = form.querySelector("#cards");
    const addressBtn = form.querySelector("#add-address");
    const cardBtn = form.querySelector("#add-card");

    updateRemoveButtonsVisibility();

    addressBtn.addEventListener("click", () => {
        addAddressField();
    });

    cardBtn.addEventListener("click", () => {
        addCardField();
    });

    addresses.addEventListener("click", (e) => {
        if (e.target.id === "remove-address" || e.target.closest("#remove-address")) {
            const addressDiv = e.target.closest("#address");
            removeAddressField(addressDiv);
        }
    });

    cards.addEventListener("click", (e) => {
        if (e.target.id === "remove-card" || e.target.closest("#remove-card")) {
            const cardDiv = e.target.closest("#card");
            removeCardField(cardDiv);
        }
    });
}

/* ========================================================== */

export function addAddressField() {
    const addresses = document.querySelector("#addresses");
    const addressField = addresses.firstElementChild;
    const addressFieldClone = addressField.cloneNode(true);
    
    clearInputValues(addressFieldClone);
    
    addresses.appendChild(addressFieldClone);
    updateAddressTitles();
    updateRemoveButtonsVisibility();
}

export function addCardField() {
    const cards = document.querySelector("#cards");
    const cardField = cards.firstElementChild;
    const cardFieldClone = cardField.cloneNode(true);
    
    // Limpar valores dos inputs
    clearInputValues(cardFieldClone);
    
    cards.appendChild(cardFieldClone);
    updateCardTitles();
    updateRemoveButtonsVisibility();
}

/* ========================================================== */

export function updateAddressTitles() {
    const addresses = document.querySelector("#addresses");
    const addressDivs = addresses.querySelectorAll("#address");
    
    addressDivs.forEach((div, index) => {
        const titleElement = div.querySelector("#address-field-number");
        titleElement.innerHTML = `Endereço ${index + 1}`;
    });
}

export function updateCardTitles() {
    const cards = document.querySelector("#cards");
    const cardDivs = cards.querySelectorAll("#card");
    
    cardDivs.forEach((div, index) => {
        const titleElement = div.querySelector("#card-field-number");
        titleElement.innerHTML = `Cartão ${index + 1}`;
    });
}

/* ========================================================== */

function clearInputValues(element) {
    const inputs = element.querySelectorAll("input, select");
    inputs.forEach(input => {
        if (input.type === "checkbox" || input.type === "radio") {
            input.checked = false;
        } else {
            input.value = "";
        }
    });
}