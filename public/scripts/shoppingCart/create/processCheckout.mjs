import { validateCheckoutForm } from "../validations/checkoutValidations.mjs";
import { buildCheckoutReqBody } from "./checkoutReqBody.mjs";

// Rota do backend para processar o checkout - facilmente alterável
const CHECKOUT_API_PATH = "/api/checkout/process";
const SUCCESS_REDIRECT_PATH = "/order/success";

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
		console.log("⚠️ MODO SIMULAÇÃO - Rota do backend não implementada ainda");

		if (typeof Swal !== "undefined") {
			Swal.fire({
				icon: "success",
				title: "Checkout Simulado!",
				html: `
					<p>Os dados foram coletados com sucesso!</p>
					<p><strong>Total:</strong> R$ ${requestBody.cart.totals.finalTotal.toFixed(
						2
					)}</p>
					<p><strong>Itens:</strong> ${requestBody.cart.items.length}</p>
					<p><strong>Cartões:</strong> ${requestBody.payment.cards.length}</p>
					<br>
					<small>Verifique o console para ver a estrutura JSON completa</small>
				`,
				confirmButtonText: "OK",
			});
		} else {
			alert(
				`Checkout simulado com sucesso!\nTotal: R$ ${requestBody.cart.totals.finalTotal.toFixed(
					2
				)}\nVerifique o console para detalhes.`
			);
		}

		// Descomente a linha abaixo quando implementar a rota real:
		// await submitCreationForm(CHECKOUT_API_PATH, requestBody, SUCCESS_REDIRECT_PATH, true);
	});
}
