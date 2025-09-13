import { setupCardForm } from "./create/formCreatAndUpdateCard.mjs";
import { setupCardInputMasks } from "./validations/inputMasks.mjs";

document.addEventListener('DOMContentLoaded', () => {
    setupCardInputMasks();
    setupCardForm();
});
