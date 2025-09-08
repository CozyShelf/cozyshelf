import { setupViaCepIntegration } from "./fillWithViaCep.mjs";
import { setupCepMask } from "./inputMasks.mjs";
import { setupAddressForm } from "./create/formCreateAndUpdateAddress.mjs";

document.addEventListener('DOMContentLoaded', () => {
    setupCepMask();
    setupAddressForm();
    setupViaCepIntegration();
});
