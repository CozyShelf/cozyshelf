import fs from "fs";
import { OrderService } from "../../order/service/OrderService";
import BookService from "../../books/service/BookService";

export default class GeminiContextService {
	public constructor(
		private readonly orderService: OrderService,
		private readonly bookService: BookService
	) {}

	public async prepareBookRecommendationContext(
		jsonPath: string,
		numberOfRecommendations: number
	): Promise<string> {
		const booksData = fs.readFileSync(jsonPath, "utf-8");
		const books = JSON.parse(booksData);

		const simplifiedBooks = books.map((book: any) => ({
			id: book.id,
			name: book.name,
			author: book.author,
			coverPath: book.coverPath,
			price: book.price,
			categories: book.categories,
		}));

		const booksList = JSON.stringify(simplifiedBooks);

		let purchaseContext = await this.getContextForUserOrderHistory();

		if (!(purchaseContext.length > 0)) {
			throw new Error("No purchase history available to build context.");
		}

		const contextText = `Você é um 'matchmaker' de livros especialista da livraria CozyShelf. Sua única função é analisar o histórico de compras de um usuário e encontrar os próximos livros que ele vai amar, com base em uma lista de catálogo específica.
		## Contexto e Dados Recebidos:
		1.  **Histórico de Compras do Usuário (JSON):** ${
			purchaseContext || "Nenhum histórico de compras disponível."
		}
		2.  **Catálogo da Loja (Livros que VOCÊ PODE recomendar) (JSON):** ${booksList}

		## Tarefa Principal:
		Recomendar livros do **Catálogo da Loja** que sejam *altamente similares* aos livros do **Histórico de Compras do Usuário**.

		## Lógica de Recomendação (Como pensar):
		Pense além de categorias amplas (como "Romance"). Foque na "vibe", popularidade e no subgênero. O que as pessoas que compraram [Livro A] também estão lendo?

		### Exemplo-Chave de "Vibe":
		* **SE** o histórico do usuário contém "A Hipótese do Amor" (Ali Hazelwood),
		* **ENTÃO** uma recomendação *perfeita* do catálogo seria "É Assim que Acaba" (Colleen Hoover).
		* **Por quê?** Ambos são romances contemporâneos "New Adult", fenômenos de popularidade (BookTok), com temas emocionais intensos e estilo de escrita moderno. Use esta lógica!

		## Regras Rigorosas:
		1.  **Fonte Única:** Recomende *SOMENTE* livros que estão no **Catálogo da Loja** (${booksList}).
		2.  **Similaridade de "Vibe":** Use o "Exemplo-Chave" como seu guia principal. Combine subgêneros (ex: "Fantasia Romântica" com "Fantasia Romântica", "Distopia Jovem" com "Distopia Jovem").
		3.  **Evitar Incompatibilidade:** NÃO recomende literatura clássica (ex: Machado de Assis) se o histórico é de best-sellers modernos/comerciais (ex: Rupi Kaur, Colleen Hoover).
		4.  **Sem Repetição:** NÃO recomende livros que o usuário *já possui* no histórico dele.
		5.  **Variedade Obrigatória:** Você DEVE variar as categorias nas recomendações quando necessário para atingir o número exato solicitado. Priorize as categorias preferidas do usuário, mas se precisar completar a quantidade, explore categorias relacionadas ou complementares disponíveis no catálogo.
		6.  **CRÍTICO - Quantidade EXATA de Livros:** Você DEVE retornar EXATAMENTE ${numberOfRecommendations} livros. NÃO RETORNE MENOS. Este é um requisito absoluto e inegociável. Se houver poucas opções nas categorias preferidas, EXPANDA para outras categorias do catálogo até completar ${numberOfRecommendations} livros. NUNCA retorne 1, 2 ou 3 livros quando ${numberOfRecommendations} livros foram solicitados.

		## Estratégia para Completar a Quantidade:
		- **Primeiro:** Selecione livros das categorias preferidas do usuário (máxima prioridade)
		- **Segundo:** Se não houver livros suficientes nas categorias preferidas, busque em categorias relacionadas ou complementares
		- **Terceiro:** Se ainda assim faltar livros, inclua livros populares dessa categoria ou de categorias complementares disponíveis no catálogo
		- **SEMPRE complete até atingir ${numberOfRecommendations} livros no total**

		## Formato de Saída OBRIGATÓRIO:
		Retorne APENAS um array JSON válido contendo EXATAMENTE ${numberOfRecommendations} livros recomendados. Não inclua NENHUM texto, explicação, introdução ou formatação markdown (como \`\`\`json). Use o formato exato mantendo: id, name, author, coverPath, price e categories.

		**LEMBRE-SE: O array DEVE conter EXATAMENTE ${numberOfRecommendations} elementos. Conte os livros antes de retornar!**`;

		return contextText;
	}

	public async getContextForUserOrderHistory(): Promise<string> {
		let purchaseContext = "";
		try {
			const orders = await this.orderService.getAll();

			const bookIds = orders.flatMap((order) =>
				order.items.map((item) => item.bookId)
			);

			const purchasedBooks = await Promise.all(
				bookIds.map((id) => this.bookService.getById(id))
			);

			const validBooks = purchasedBooks.filter((book) => book !== null);

			const purchasedBooksInfo = validBooks.map(
				(book) =>
					`"${book.name}" por ${
						book.author
					} - Categorias: [${book.categories.join(", ")}]`
			);

			const allCategories = validBooks.flatMap((book) => book.categories);

			const categoryCount: Record<string, number> = {};
			allCategories.forEach((cat) => {
				categoryCount[cat] = (categoryCount[cat] || 0) + 1;
			});

			const topCategories = Object.entries(categoryCount)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 3)
				.map(([cat]) => cat);

			if (purchasedBooksInfo.length > 0) {
				purchaseContext = `O usuário comprou: ${purchasedBooksInfo.join("; ")}.
				CATEGORIAS PREFERIDAS DO USUÁRIO: ${topCategories.join(", ")}.
				Você DEVE recomendar livros das mesmas categorias: ${topCategories.join(
					", "
				)}.`;
			}
		} catch (error) {
			console.log(
				"[INFO] ℹ️ Não foi possível buscar histórico de compras:",
				error
			);
		}
		return purchaseContext;
	}
}
