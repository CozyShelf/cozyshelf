import { setupCardFormDispatcher } from "./dispatcher/formCreateUpdateDispatcher.mjs";
import { setupCardInputMasks } from "./validations/inputMasks.mjs";

document.addEventListener("DOMContentLoaded", () => {
	setupCardInputMasks();

	// Verificar se estamos na página do carrinho (não redirecionar após criar cartão)
	const isInShoppingCart =
		window.location.pathname.includes("/cart") ||
		window.location.pathname.includes("/checkout") ||
		document.getElementById("selected-cards") !== null; // Elemento específico do carrinho

	setupCardFormDispatcher(!isInShoppingCart); // withRedirect = !isInShoppingCart
});
