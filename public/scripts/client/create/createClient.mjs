import { submitCreationForm } from '../../generic/create/createFormSubmit.mjs';
import { validateForm } from '../validations/createFormValidations.mjs';
import { buildCreateClientReqBody } from './createClientReqBody.mjs';

const CREATE_REDIRECT_PATH = '/';
const CREATE_CLIENT_PATH = '/api/clients/';

export function handleClientCreation() {
    const form = document.getElementById("client-register-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        if (!validateForm(form)) {
            return;
        }
    
        const requestBody = buildCreateClientReqBody(form);
        await submitCreationForm(CREATE_CLIENT_PATH, requestBody, CREATE_REDIRECT_PATH);
    });
}