import { submitUpdateForm } from "../../generic/update/updateFormSubmit.mjs";
import { buildUpdatePasswordReqBody } from "./updatePasswordReqBody.mjs";
import { validateForm } from "../validations/formValidations.mjs";

const UPDATE_PASSWORD_PATH = '/api/clients/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81/password';
// No redirect path needed as we stay on the same page

export function handlePasswordUpdate() {
    const form = document.getElementById("update-password-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        if (!validateForm(form)) {
            return;
        }

        const requestBody = buildUpdatePasswordReqBody(form);            

        await submitUpdateForm(UPDATE_PASSWORD_PATH, requestBody, " ", " "); 
    });
}