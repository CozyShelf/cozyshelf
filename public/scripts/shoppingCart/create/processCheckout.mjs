import { submitCreationForm } from "../../generic/create/createFormSubmit.mjs";
import { validateCheckoutForm } from "../validations/checkoutValidations.mjs";
import { buildCheckoutReqBody } from "./checkoutReqBody.mjs";

// Rota do backend para processar o checkout - facilmente alterável
const CHECKOUT_API_PATH = "/api/orders";
const SUCCESS_REDIRECT_PATH = "/orders";

/**
 * Configura o manipulador de envio do checkout
 */
export function handleCheckoutSubmission() {
	const form = document.querySelector("form"); // Formulário principal do carrinho

	if (!form) {
		console.error("Formulário do carrinho não encontrado");
		return;
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		// Valida os dados antes de enviar
		if (!validateCheckoutForm(form)) {
			return;
		}

		// Constrói o corpo da requisição
		const requestBody = buildCheckoutReqBody(form);

		// Log da estrutura final JSON
		console.log("🛒 === DADOS DO CHECKOUT PARA BACKEND ===");
		console.log(JSON.stringify(requestBody, null, 2));
		console.log("🛒 === FIM DOS DADOS ===");

		// SIMULAÇÃO TEMPORÁRIA - Remova quando implementar a rota real
		
		await submitCreationForm(CHECKOUT_API_PATH, requestBody, SUCCESS_REDIRECT_PATH, true);
		
	});
}
