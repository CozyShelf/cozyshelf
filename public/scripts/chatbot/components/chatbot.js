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
	chatbot.classList.add("chatbot-appear");

	closeButton.addEventListener("click", () => {
		chatbot.classList.remove("chatbot-appear");
		chatbot.classList.add("chatbot-disappear");

		setTimeout(() => {
			containerToRender.setAttribute("hidden", true);
			chatbot.classList.remove("chatbot-disappear");
		}, 300);
	});

	messagesContainer.scrollIntoView({
		behavior: "smooth",
		block: "start",
	});

	function createMessage(botMessage, text, withTypingEffect = false) {
		const messageDiv = document.createElement("div");
		messageDiv.className = `flex ${
			botMessage ? "justify-start" : "justify-end"
		} mb-4 message-appear`;

		const messageContent = document.createElement("div");
		messageContent.className = `${
			botMessage ? "bg-lighter-brown" : "bg-light-brown"
		} text-dark-brown px-4 py-2 rounded-2xl ${
			botMessage ? "rounded-bl-sm" : "rounded-br-sm"
		} max-w-xs shadow-sm`;

		if (withTypingEffect) {
			messageContent.className += " typing-effect";
		} else {
			messageContent.innerText = text;
		}

		messageDiv.appendChild(messageContent);
		return messageDiv;
	}

	function toggleBtn() {
		button.hasAttribute("disabled")
			? button.removeAttribute("disabled")
			: button.setAttribute("disabled", true);
	}

	function createTypingIndicator() {
		const messageDiv = document.createElement("div");
		messageDiv.className = "flex justify-start mb-4 message-appear";
		messageDiv.id = "typingIndicator";

		const messageContent = document.createElement("div");
		messageContent.className =
			"bg-lighter-brown text-dark-brown px-4 py-2 rounded-2xl rounded-bl-sm max-w-xs shadow-sm";

		const typingIndicator = document.createElement("div");
		typingIndicator.className = "typing-indicator";

		for (let i = 0; i < 3; i++) {
			const dot = document.createElement("span");
			dot.className = "typing-dot";
			typingIndicator.appendChild(dot);
		}

		messageContent.appendChild(typingIndicator);
		messageDiv.appendChild(messageContent);
		return messageDiv;
	}

	async function typeMessage(element, text, speed = 25) {
		return new Promise((resolve) => {
			let index = 0;
			const cursor = document.createElement("span");
			cursor.className = "typing-cursor";
			element.appendChild(cursor);

			const interval = setInterval(() => {
				if (index < text.length) {
					const char = text.charAt(index);
					const textNode = document.createTextNode(char);
					element.insertBefore(textNode, cursor);
					index++;

					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				} else {
					cursor.remove();
					clearInterval(interval);
					resolve();
				}
			}, speed);
		});
	}

	function createBookRecommendation(book) {
		if (!book) return null;

		const bookContainer = document.createElement("div");
		bookContainer.className =
			"flex justify-start mb-4 book-recommendation-appear";

		const bookDiv = document.createElement("div");
		bookDiv.className =
			"bg-gradient-to-br from-lighter-brown to-white p-4 rounded-2xl rounded-bl-sm max-w-xs shadow-md border-2 border-light-brown";

		const categoryBadge = book.category
			? `<span class="inline-block bg-light-title text-white text-xs font-semibold px-2 py-1 rounded-full">${book.category}</span>`
			: "";

		const description = book.description
			? `<p class="text-xs text-gray-700 leading-relaxed line-clamp-3">${book.description}</p>`
			: "";

		bookDiv.innerHTML = `
			<div class="flex flex-col gap-3">
				<div class="flex gap-3">
					<img src="${book.coverPath}" alt="${
			book.name
		}" class="w-20 h-28 object-cover rounded-lg shadow-md">
					<div class="flex-1 flex flex-col justify-between">
						<div>
							<h4 class="font-bold text-dark-brown text-sm leading-tight">${book.name}</h4>
							<p class="text-xs text-gray-600 mt-1">${book.author}</p>
							${categoryBadge ? `<div class="mt-2">${categoryBadge}</div>` : ""}
						</div>
						<p class="text-base font-bold text-light-title mt-2">R$ ${book.price.toFixed(
							2
						)}</p>
					</div>
				</div>
				${description ? `<div class="mt-1">${description}</div>` : ""}
				<a href="/books/${
					book.id
				}" class="mt-2 w-full bg-light-title hover:bg-brown text-white font-semibold py-2 px-4 rounded-lg text-center text-sm transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
					<span>Ver detalhes do livro</span>
					<span class="material-symbols-outlined text-base">arrow_forward</span>
				</a>
			</div>
		`;

		bookContainer.appendChild(bookDiv);
		return bookContainer;
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

					const typingIndicator = createTypingIndicator();
					messagesContainer.appendChild(typingIndicator);
					messagesContainer.scrollTop = messagesContainer.scrollHeight;

					const botResponse = await sendMessageToBot(messageToSend);

					console.log("Resposta do bot:", botResponse);

					const indicator = document.getElementById("typingIndicator");
					if (indicator) {
						indicator.remove();
					}

					const botMessage = createMessage(true, "", true);
					messagesContainer.appendChild(botMessage);
					messagesContainer.scrollTop = messagesContainer.scrollHeight;

					const messageContent = botMessage.querySelector("div");
					await typeMessage(messageContent, botResponse.message);

					if (botResponse.recommendedBook) {
						console.log("Livro recomendado:", botResponse.recommendedBook);
						const bookRecommendation = createBookRecommendation(
							botResponse.recommendedBook
						);
						if (bookRecommendation) {
							messagesContainer.appendChild(bookRecommendation);
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
