import { setupFormFieldAdders } from './addNewFormFields.mjs';
import { setupClientForm } from './formCreateClient.mjs';
import { setupViaCepIntegration } from '../../address/fillWithViaCep.mjs';
import { setupInputMasks } from './inputMasks.mjs';

document.addEventListener("DOMContentLoaded", () => {
    setupFormFieldAdders();
    setupClientForm();
    setupViaCepIntegration();
    setupInputMasks();
});