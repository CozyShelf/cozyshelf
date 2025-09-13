import { setupViaCepIntegration } from "./viaCep/fillWithViaCep.mjs";
import { setupCepMask } from "./validations/inputMasks.mjs";
import { setupAddressForm } from "./create/formCreateAndUpdateAddress.mjs";

document.addEventListener('DOMContentLoaded', () => {
    setupCepMask();
    setupAddressForm();
    setupViaCepIntegration();
});
