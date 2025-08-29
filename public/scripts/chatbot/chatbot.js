const input = document.getElementById("chatbotInput");
const button = document.getElementById("sendMessage");
const messagesContainer = document.getElementById("chatbotMessages");

function renderChatbot() {
	const containerToRender = document.getElementById("chatbotContainer");
	containerToRender.removeAttribute("hidden");
	const iaChatbot = document.getElementById("chatbot");
	iaChatbot.removeAttribute("hidden");
	const closeButton = document.getElementById("closeChatbotModal");

	closeButton.addEventListener("click", () => {
		containerToRender.setAttribute("hidden", true);
	});

	containerToRender.appendChild(iaChatbot);

	messagesContainer.scrollIntoView({
		behavior: "smooth",
		block: "start",
	});

	function createUserMessage(text) {
		const messageDiv = document.createElement("div");
		messageDiv.className = "flex justify-end mb-4";

		const messageContent = document.createElement("div");
		messageContent.className =
			"bg-light-brown text-dark-brown px-4 py-2 rounded-2xl rounded-br-sm max-w-xs shadow-sm";
		messageContent.innerText = text;

		messageDiv.appendChild(messageContent);
		return messageDiv;
	}

	function createBotMessage(text) {
		const messageDiv = document.createElement("div");
		messageDiv.className = "flex justify-start mb-4";

		const messageContent = document.createElement("div");
		messageContent.className =
			"bg-lighter-brown text-dark-brown px-4 py-2 rounded-2xl rounded-bl-sm max-w-xs shadow-sm";
		messageContent.innerText = text;

		messageDiv.appendChild(messageContent);
		return messageDiv;
	}

	button.addEventListener("click", (e) => {
		e.preventDefault();
		const messageToSend = input.value.trim();

		if (messageToSend) {
			const userMessage = createUserMessage(messageToSend);
			messagesContainer.appendChild(userMessage);

			input.value = "";

			setTimeout(() => {
				const botMessage = createBotMessage(
					"Olá! Esta é uma resposta automática da IA."
				);
				messagesContainer.appendChild(botMessage);
				scrollToBottom();
			}, 1000);
		}
	});

	input.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			button.click();
		}
	});
}
