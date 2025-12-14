import { setupViaCepIntegration } from "./viaCep/fillWithViaCep.mjs";
import { setupCepMask } from "./validations/inputMasks.mjs";
import { setupAddressFormDispatcher } from "./dispatcher/formCreateUpdateDispatcher.mjs";

document.addEventListener("DOMContentLoaded", () => {
	setupCepMask();
	setupViaCepIntegration();

	// Verificar se estamos na página do carrinho (não redirecionar após criar endereço)
	const isInShoppingCart =
		window.location.pathname.includes("/cart") ||
		window.location.pathname.includes("/checkout") ||
		document.getElementById("selected-cards") !== null; // Elemento específico do carrinho

	setupAddressFormDispatcher(!isInShoppingCart); // withRedirect = !isInShoppingCart
});
