document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("client-register-form");
	let addressIndex = 1;
	let cardIndex = 1;

	const adresses = form.querySelector("#addresses");
	const cards = form.querySelector("#cards");
	const addressBtn = form.querySelector("#add-address");
	const cardBtn = form.querySelector("#add-card");

	addressBtn.addEventListener("click", () => {
		addressIndex++;

		const addressField = adresses.firstElementChild;
		const addressFieldClone = addressField.cloneNode(true);
		addressFieldClone.querySelector(
			"#address-field-number"
		).innerHTML = `Endereço ${addressIndex}`;
		adresses.appendChild(addressFieldClone);
	});

	cardBtn.addEventListener("click", () => {
		cardIndex++;

		const cardField = cards.firstElementChild;
		const cardFieldClone = cardField.cloneNode(true);
		cardFieldClone.querySelector(
			"#card-field-number"
		).innerHTML = `Cartão ${cardIndex}`;
		cards.appendChild(cardFieldClone);
	});
});
