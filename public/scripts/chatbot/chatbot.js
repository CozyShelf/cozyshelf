function renderChatbot() {
	const containerToRender = document.getElementById("chatbotContainer");
	const chatbot = document.getElementById("chatbot");
	const messagesContainer = document.getElementById("chatbotMessages");
	const input = document.getElementById("chatbotInput");
	const button = document.getElementById("sendMessage");
	const closeButton = document.getElementById("closeChatbotModal");
	const chatbotInitialMessage = document.getElementById("chatbotWelcome");

	containerToRender.removeAttribute("hidden");
	if (button.hasAttribute("disabled")) {
		button.removeAttribute("disabled");
	}

	chatbot.removeAttribute("hidden");

	closeButton.addEventListener("click", () => {
		containerToRender.setAttribute("hidden", true);
	});

	messagesContainer.scrollIntoView({
		behavior: "smooth",
		block: "start",
	});

	function createMessage(botMessage, text) {
		const messageDiv = document.createElement("div");
		messageDiv.className = `flex ${
			botMessage ? "justify-start" : "justify-end"
		} mb-4`;

		const messageContent = document.createElement("div");
		messageContent.className = `${
			botMessage ? "bg-lighter-brown" : "bg-light-brown"
		} text-dark-brown px-4 py-2 rounded-2xl ${
			botMessage ? "rounded-bl-sm" : "rounded-br-sm"
		} max-w-xs shadow-sm`;
		messageContent.innerText = text;

		messageDiv.appendChild(messageContent);
		return messageDiv;
	}

	function toggleBtn() {
		button.hasAttribute("disabled")
			? button.removeAttribute("disabled")
			: button.setAttribute("disabled", true);
	}

	button.addEventListener("click", (e) => {
		e.preventDefault();

		if (input.value.trim() != "") {
			toggleBtn();

			const messageToSend = input.value.trim();

			if (!chatbotInitialMessage.hasAttribute("hidden")) {
				chatbotInitialMessage.setAttribute("hidden", true);
			}

			if (messageToSend) {
				const userMessage = createMessage(false, messageToSend);

				messagesContainer.appendChild(userMessage);
				messagesContainer.scrollTop = messagesContainer.scrollHeight;

				input.value = "";

				setTimeout(() => {
					const botMessage = createMessage(
						true,
						"Olá! Esta é uma resposta automática da IA."
					);
					messagesContainer.appendChild(botMessage);
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
					toggleBtn();
				}, 1000);
		}
		}
	});

	input.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			button.click();
		}
	});
}
