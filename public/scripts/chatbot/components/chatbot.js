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

	function createBookRecommendation(book) {
		if (!book) return null;

		const bookDiv = document.createElement("div");
		bookDiv.className =
			"mt-3 p-3 bg-white rounded-lg shadow-sm border border-light-brown";

		bookDiv.innerHTML = `
			<div class="flex gap-3">
				<img src="${book.coverPath}" alt="${
			book.name
		}" class="w-16 h-24 object-cover rounded">
				<div class="flex-1">
					<h4 class="font-semibold text-dark-brown text-sm">${book.name}</h4>
					<p class="text-xs text-gray-600 mt-1">${book.author}</p>
					<p class="text-sm font-bold text-dark-brown mt-2">R$ ${book.price.toFixed(
						2
					)}</p>
					<a href="/books/${
						book.id
					}" class="text-xs text-light-brown hover:underline mt-1 inline-block">Ver detalhes</a>
				</div>
			</div>
		`;

		return bookDiv;
	}

	function getConversationHistory() {
		try {
			const history = localStorage.getItem("chatbotHistory");
			return history ? JSON.parse(history) : [];
		} catch (error) {
			console.error("Erro ao carregar histórico:", error);
			return [];
		}
	}

	function saveConversationHistory(history) {
		try {
			const limitedHistory = history.slice(-10);
			localStorage.setItem("chatbotHistory", JSON.stringify(limitedHistory));
		} catch (error) {
			console.error("Erro ao salvar histórico:", error);
		}
	}

	async function sendMessageToBot(message) {
		try {
			const conversationHistory = getConversationHistory();

			const response = await fetch("/api/chatbot", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message,
					conversationHistory,
				}),
			});

			if (!response.ok) {
				throw new Error("Erro ao se comunicar com o chatbot");
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Erro no chatbot:", error);
			return {
				message:
					"Desculpe, tive um problema ao processar sua mensagem. Tente novamente em instantes.",
				recommendedBook: null,
			};
		}
	}

	button.addEventListener("click", async (e) => {
		e.preventDefault();

		if (input.value.trim() != "") {
			toggleBtn();

			const messageToSend = input.value.trim();

			if (!chatbotInitialMessage.hasAttribute("hidden")) {
				chatbotInitialMessage.setAttribute("hidden", true);
			}

			if (messageToSend) {
				try {
					const userMessage = createMessage(false, messageToSend);
					messagesContainer.appendChild(userMessage);
					messagesContainer.scrollTop = messagesContainer.scrollHeight;

					input.value = "";

					const typingIndicator = createMessage(true, "Digitando...");
					typingIndicator.id = "typingIndicator";
					messagesContainer.appendChild(typingIndicator);
					messagesContainer.scrollTop = messagesContainer.scrollHeight;

					const botResponse = await sendMessageToBot(messageToSend);

					console.log("Resposta do bot:", botResponse);

					const indicator = document.getElementById("typingIndicator");
					if (indicator) {
						indicator.remove();
					}

					const botMessage = createMessage(true, botResponse.message);
					messagesContainer.appendChild(botMessage);

					if (botResponse.recommendedBook) {
						console.log("Livro recomendado:", botResponse.recommendedBook);
						const bookRecommendation = createBookRecommendation(
							botResponse.recommendedBook
						);
						if (bookRecommendation) {
							botMessage.querySelector("div").appendChild(bookRecommendation);
						}
					} else {
						console.warn("Nenhum livro recomendado na resposta");
					}

					const history = getConversationHistory();
					history.push({
						userMessage: messageToSend,
						botResponse: botResponse.message,
						recommendedBook: botResponse.recommendedBook
							? botResponse.recommendedBook.name
							: "",
					});
					saveConversationHistory(history);

					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				} catch (error) {
					console.error("Erro ao processar mensagem:", error);
					const indicator = document.getElementById("typingIndicator");
					if (indicator) {
						indicator.remove();
					}

					const errorMessage = createMessage(
						true,
						"Desculpe, ocorreu um erro. Tente novamente."
					);
					messagesContainer.appendChild(errorMessage);
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				} finally {
					toggleBtn();
				}
			}
		}
	});

	input.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			button.click();
		}
	});
}
