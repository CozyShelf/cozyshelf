import { submitUpdateForm } from '../../generic/update/updateFormSubmit.mjs';
import { buildUpdateClientReqBody } from './updateClientReqBody.mjs';

const CLIENT_PATH = '/api/clients/';
const REDIRECT_PATH = '/clients/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81';

export function handleClientUpdate() {
    const form = document.getElementById("client-details-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        const requestBody = buildUpdateClientReqBody(form);
        const clientId = window.location.pathname.split('/').pop();

        await submitUpdateForm(CLIENT_PATH, requestBody, clientId, REDIRECT_PATH);
    });
}