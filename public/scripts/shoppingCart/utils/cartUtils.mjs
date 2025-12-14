/**
 * Utilitários compartilhados para carrinho de compras
 */

const CartUtils = {
	CLIENT_ID: "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81",

	/**
	 * Adiciona um item ao carrinho
	 */
	async addToCart(bookId, quantity = 1) {
		try {
			const response = await fetch("/api/carts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clientID: this.CLIENT_ID,
					bookID: bookId,
					quantity: quantity,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Erro ao adicionar item ao carrinho");
			}

			return result;
		} catch (error) {
			console.error("Erro ao adicionar ao carrinho:", error);
			throw error;
		}
	},

	/**
	 * Atualiza o estado visual do botão
	 */
	updateButtonState(button, state, btnText, btnIcon) {
		switch (state) {
			case "loading":
				button.disabled = true;
				if (btnText) btnText.textContent = "Adicionando...";
				if (btnIcon) btnIcon.textContent = "hourglass_empty";
				break;

			case "success":
				if (btnText) btnText.textContent = "Adicionado!";
				if (btnIcon) btnIcon.textContent = "check_circle";
				button.style.setProperty("background-color", "#10b981", "important");
				button.style.setProperty("border-color", "#10b981", "important");
				button.style.setProperty("color", "white", "important");
				break;

			case "reset":
				if (btnText)
					btnText.textContent =
						button.getAttribute("data-original-text") ||
						"Adicionar ao carrinho";
				if (btnIcon) btnIcon.textContent = "shopping_cart";
				button.style.removeProperty("background-color");
				button.style.removeProperty("border-color");
				button.style.removeProperty("color");
				button.disabled = false;
				break;
		}
	},

	/**
	 * Inicializa estilos de animação
	 */
	initializeAnimationStyles() {
		if (!document.querySelector("#cart-notification-animations")) {
			const style = document.createElement("style");
			style.id = "cart-notification-animations";
			style.textContent = `
                @keyframes notificationSlideIn {
                    0% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes notificationSlideOut {
                    0% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                .cart-notification {
                    animation: notificationSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                }
                .cart-notification.removing {
                    animation: notificationSlideOut 0.3s ease-in-out forwards;
                }
            `;
			document.head.appendChild(style);
		}
	},

	/**
	 * Mostra notificação melhorada
	 */
	showNotification(message, type = "info", bookData = null) {
		this.initializeAnimationStyles();

		const notification = document.createElement("div");
		notification.className = `cart-notification notification-${type}`;

		const baseStyles = `
            position: fixed;
            top: 20px;
            right: 20px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 380px;
            min-width: 320px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0;
            transform: translateX(100%);
        `;

		const bgColor =
			type === "success"
				? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
				: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";

		notification.style.cssText = baseStyles + `background: ${bgColor};`;

		if (bookData && type === "success") {
			notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; padding: 16px; cursor: pointer;"
                     onmouseover="this.style.transform='scale(1.02)'; this.style.transition='transform 0.2s ease';"
                     onmouseout="this.style.transform='scale(1)'; this.style.transition='transform 0.2s ease';" id="cart-success-notification">
                    <div style="flex-shrink: 0; position: relative;">
                        <img src="${bookData.bookImage}"
                             alt="Capa do livro"
                             style="width: 50px; height: 62px; object-fit: cover; border-radius: 6px; box-shadow: 0 3px 12px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2);"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div style="width: 50px; height: 62px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 6px; display: none; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; color: #6b7280;">
                            <span class="material-symbols-outlined" style="font-size: 16px;">auto_stories</span>
                            <span>Sem capa</span>
                        </div>
                        <div style="position: absolute; top: -4px; right: -4px; background: #ffffff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                            <span style="color: #10b981; font-size: 12px; font-weight: bold;">${
															bookData.quantity
														}</span>
                        </div>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span class="material-symbols-outlined" style="font-size: 18px; color: #ffffff; animation: pulse 1.5s infinite;">
                                check_circle
                            </span>
                            <span style="font-size: 14px; font-weight: 600; color: #ffffff;">
                                Adicionado ao carrinho!
                            </span>
                        </div>
                        <div style="font-size: 13px; color: rgba(255,255,255,0.95); margin-bottom: 3px; font-weight: 500; line-height: 1.3;">
                            ${
															bookData.bookTitle.length > 32
																? bookData.bookTitle.substring(0, 32) + "..."
																: bookData.bookTitle
														}
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 2px;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 4px;">
                                <span class="material-symbols-outlined" style="font-size: 14px;">inventory_2</span>
                                ${bookData.quantity} ${
				bookData.quantity === 1 ? "exemplar" : "exemplares"
			}
                            </div>
                            <a href="/shopping-cart/${
															this.CLIENT_ID
														}" style="font-size: 10px; color: rgba(255,255,255,0.9); text-decoration: none; padding: 2px 6px; background: rgba(255,255,255,0.15); border-radius: 10px; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.2);"
                               onmouseover="this.style.background='rgba(255,255,255,0.25)'; this.style.color='#ffffff';"
                               onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.color='rgba(255,255,255,0.9)';">
                                Ver carrinho
                            </a>
                        </div>
                    </div>
                    <button onclick="CartUtils.removeNotification(this.parentNode.parentNode)"
                            style="background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.7); font-size: 16px; cursor: pointer; padding: 6px; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;"
                            onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.color='rgba(255,255,255,1)'; this.style.transform='scale(1.1)';"
                            onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.color='rgba(255,255,255,0.7)'; this.style.transform='scale(1)';">
                        ×
                    </button>
                </div>
            `;
		} else {
			notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; padding: 16px 20px;" id="cart-error-notification">
                    <span class="material-symbols-outlined" style="font-size: 20px;">
                        ${type === "success" ? "check_circle" : "error"}
                    </span>
                    <span style="flex: 1; font-size: 14px;">${message}</span>
                    <button onclick="CartUtils.removeNotification(this.parentNode.parentNode)"
                            style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 18px; cursor: pointer; padding: 4px;"
                            onmouseover="this.style.color='rgba(255,255,255,1)'"
                            onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                        ×
                    </button>
                </div>
            `;
		}

		document.body.appendChild(notification);

		// Forçar reflow antes de iniciar a animação
		notification.offsetHeight;

		// Iniciar animação de entrada
		requestAnimationFrame(() => {
			notification.style.animation =
				"notificationSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards";
		});

		// Auto remoção
		const autoRemove = setTimeout(() => {
			this.removeNotification(notification);
		}, 6000);

		// Pausar/retomar auto remoção no hover
		notification.addEventListener("mouseenter", () => {
			clearTimeout(autoRemove);
		});

		notification.addEventListener("mouseleave", () => {
			setTimeout(() => {
				this.removeNotification(notification);
			}, 2000);
		});

		return notification;
	},

	/**
	 * Remove notificação com animação suave
	 */
	removeNotification(notification) {
		if (
			notification &&
			notification.parentNode &&
			!notification.classList.contains("removing")
		) {
			notification.classList.add("removing");
			notification.style.animation =
				"notificationSlideOut 0.3s ease-in-out forwards";

			setTimeout(() => {
				if (notification.parentNode) {
					notification.parentNode.removeChild(notification);
				}
			}, 300);
		}
	},
};

// Tornar CartUtils disponível globalmente
window.CartUtils = CartUtils;
