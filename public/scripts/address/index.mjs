import { setupViaCepIntegration } from "./viaCep/fillWithViaCep.mjs";
import { setupCepMask } from "./validations/inputMasks.mjs";
import { setupAddressFormDispatcher } from "./dispatcher/formCreateUpdateDispatcher.mjs";

document.addEventListener('DOMContentLoaded', () => {
    setupCepMask();
    setupViaCepIntegration();
    setupAddressFormDispatcher();
});
