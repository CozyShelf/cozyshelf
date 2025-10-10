import { setupCardFormDispatcher } from "./dispatcher/formCreateUpdateDispatcher.mjs";
import { setupCardInputMasks } from "./validations/inputMasks.mjs";

document.addEventListener("DOMContentLoaded", () => {
	setupCardInputMasks();
	setupCardFormDispatcher();
});
