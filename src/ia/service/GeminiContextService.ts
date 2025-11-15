import fs from "fs";

export default class GeminiContextService {
	public prepareBookRecommendationContext(jsonPath: string): string {
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

		const contextText = `Você é um assistente de recomendação de livros da livraria CozyShelf. Escolha SOMENTE livros desta lista: ${booksList}. Retorne APENAS um array JSON válido sem texto adicional, explicações ou formatação markdown. Retorne livros classicos. Use o formato exato mantendo: id, name, author, coverPath, price e categories.`;

		return contextText;
	}
}
