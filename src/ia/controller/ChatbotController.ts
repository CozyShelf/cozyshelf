import { Request, Response } from "express";
import BookService from "../../books/service/BookService";
import GeminiContextService from "../service/GeminiContextService";
import GeminiService from "../service/GeminiService";

export default class ChatbotController {
	public constructor(
		private contextService: GeminiContextService,
		private aiService: GeminiService,
		private bookService: BookService
	) {}

	public async handleChatRequest(req: Request, res: Response): Promise<void> {
		try {
			const userMessage = req.body.message as string;
			const conversationHistory = req.body.conversationHistory || [];

			if (!userMessage) {
				res.status(400).json({ error: "Mensagem do usuário é obrigatória." });
				return;
			}

			const booksJsonPath = require("path").join(
				__dirname,
				"../../books/dao/books.json"
			);
			const context = await this.contextService.prepareChatbotContext(
				booksJsonPath,
				userMessage,
				conversationHistory
			);

			const aiResponse = await this.aiService.talkToAi(context);

			const userResponseMatch = aiResponse.match(
				/\[RESPOSTA_USUARIO\]([\s\S]*?)\[\/RESPOSTA_USUARIO\]/
			);
			const bookRecommendationMatch = aiResponse.match(
				/\[LIVRO_RECOMENDADO\]([\s\S]*?)\[\/LIVRO_RECOMENDADO\]/
			);

			if (!userResponseMatch) {
				throw new Error("Formato de resposta da IA inválido.");
			}

			const userResponse = userResponseMatch[1].trim();
			const recommendedBookName = bookRecommendationMatch
				? bookRecommendationMatch[1].trim()
				: null;

			let recommendedBook = null;

			if (
				recommendedBookName &&
				recommendedBookName.toLowerCase() !== "nenhum"
			) {
				try {
					recommendedBook = await this.bookService.getBookByName(
						recommendedBookName
					);
				} catch (error) {
					console.warn(
						`[WARN] Livro recomendado "${recommendedBookName}" não encontrado no catálogo.`
					);
				}
			}

			res.status(200).json({
				message: userResponse,
				recommendedBook: recommendedBook
					? {
							id: recommendedBook.id,
							name: recommendedBook.name,
							author: recommendedBook.author,
							coverPath: recommendedBook.coverPath,
							price: Number(recommendedBook.price),
							categories: recommendedBook.categories,
					  }
					: null,
			});
		} catch (error) {
			console.error("[ERROR] Erro ao processar requisição do chatbot:", error);
			res.status(500).json({
				error: "Erro ao processar sua mensagem. Tente novamente.",
				details: error instanceof Error ? error.message : "Erro desconhecido",
			});
		}
	}
}
