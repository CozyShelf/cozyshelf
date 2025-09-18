/**
 * Constructs the request body for creating a new card from the provided form.
 * @param {HTMLFormElement} form - The form element containing card details
 * @returns {Object} The request body object for the new card
 */

export function buildNewCardReqBody(form) {
	const formData = new FormData(form);

    const cardData = {
		number: formData.get("card-number"),
		nameOnCard: formData.get("card-impress-name"),
		cvv: formData.get("card-cvv"),
		isPreferred:
			form.querySelector("input[name='card-is-preferred']:checked") !== null
				? true
				: false,
		cardFlag: {
			description: formData.get("card-flag"),
		},
	};

    return cardData;
}
