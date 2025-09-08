import { setupCardForm } from "./formCreatAndUpdateCard.mjs";
import { setupCardInputMasks } from "./inputMask.mjs";

document.addEventListener('DOMContentLoaded', () => {
    setupCardInputMasks();
    setupCardForm();
});
