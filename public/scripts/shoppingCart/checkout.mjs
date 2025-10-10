import { handleCheckoutSubmission } from "./create/processCheckout.mjs";

/**
 * Inicializa o sistema de checkout
 * Configura todos os listeners e funcionalidades necessárias
 */
function initializeCheckout() {
	// Aguarda o DOM estar carregado
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setupCheckout);
	} else {
		setupCheckout();
	}
}

/**
 * Configura o sistema de checkout
 */
function setupCheckout() {
	console.log("🛒 Sistema de checkout inicializado");

	// Configura o manipulador de envio do formulário
	handleCheckoutSubmission();

	console.log("✅ Pronto para finalizar pedidos");
}

// Inicializa automaticamente
initializeCheckout();

// Exporta para uso manual se necessário
export { initializeCheckout };
