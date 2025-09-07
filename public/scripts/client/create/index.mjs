import { setupFormFieldAdders } from './addNewFormFields.mjs';
import { setupClientForm } from './formCreateClient.mjs';
import { setupViaCepIntegration } from '../../address/fillWithViaCep.mjs';

document.addEventListener("DOMContentLoaded", () => {
    setupFormFieldAdders();
    setupClientForm();
    setupViaCepIntegration();
});