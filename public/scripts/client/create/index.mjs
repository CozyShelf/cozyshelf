import { setupFormFieldAdders } from '../buttons/addNewFormFields.mjs';
import { setupViaCepIntegration } from '../../address/viaCep/fillWithViaCep.mjs';
import { setupInputMasks } from '../validations/inputMasks.mjs';
import { handleClientCreation } from './createClient.mjs';

document.addEventListener("DOMContentLoaded", () => {
    setupFormFieldAdders();
    setupViaCepIntegration();
    setupInputMasks();
    handleClientCreation();
});