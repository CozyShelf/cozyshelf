import { updateAddressTitles, updateCardTitles } from './addNewFormFields.mjs';

export function removeAddressField(addressDiv) {
    const addresses = document.querySelector("#addresses");
    if (addresses.children.length > 1) {
        addressDiv.remove();
        updateAddressTitles();
        updateRemoveButtonsVisibility();
    }
}

export function removeCardField(cardDiv) {
    const cards = document.querySelector("#cards");
    if (cards.children.length > 1) {
        cardDiv.remove();
        updateCardTitles();
        updateRemoveButtonsVisibility();
    }
}

export function updateRemoveButtonsVisibility() {
    const addresses = document.querySelector("#addresses");
    const cards = document.querySelector("#cards");
    
    const addressRemoveButtons = addresses.querySelectorAll("#remove-address");
    const shouldShowAddressRemove = addresses.children.length > 1;
    
    addressRemoveButtons.forEach(button => {
        if (shouldShowAddressRemove) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    });
    
    const cardRemoveButtons = cards.querySelectorAll("#remove-card");
    const shouldShowCardRemove = cards.children.length > 1;
    
    cardRemoveButtons.forEach(button => {
        if (shouldShowCardRemove) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    });
}