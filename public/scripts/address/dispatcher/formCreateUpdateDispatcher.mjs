import { handleAddressCreation } from "../create/createAddress.mjs";
import { handleAddressUpdate } from "../update/updateAddress.mjs";

export const REDIRECT_PATH = '/addresses/client/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81';
export const ADDRESS_PATH = '/api/addresses/';

export function setupAddressFormDispatcher() {
    const form = document.getElementById("address-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const isUpdate = submitButton.id === 'updateAddress';
        
        if (isUpdate) {
            await handleAddressUpdate(form);
        } else {
            await handleAddressCreation(form);
        }
    });
}