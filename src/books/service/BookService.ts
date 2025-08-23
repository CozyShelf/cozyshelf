import Book from "../domain/Book";

export default class BookService {
	public async getAll(): Promise<Book[]> {
		return [
			new Book(
				"Crime e Castigo",
				"Dostoiévski",
				"/assets/book-covers/crime-e-castigo.png",
				49.9,
				4.5
			),
			new Book(
				"Hipótese do Amor",
				"Ali Hazelwood",
				"/assets/book-covers/hipotese-do-amor.png",
				39.9,
				4.2
			),
			new Book(
				"Senhor dos Anéis",
				"J.R.R. Tolkien",
				"/assets/book-covers/senhor-dos-aneis.png",
				89.9,
				4.8
			),
			new Book(
				"Crepúsculo",
				"Stephenie Meyer",
				"/assets/book-covers/crepusculo.png",
				34.9,
				3.9
			),
			new Book(
				"É Assim que Acaba",
				"Colleen Hoover",
				"/assets/book-covers/e-assim-que-acaba.png",
				44.9,
				4.6
			),
			new Book(
				"Noites Brancas",
				"Fiódor Dostoiévski",
				"/assets/book-covers/noites-brancas.png",
				79,
				5
			),
		];
	}
}
