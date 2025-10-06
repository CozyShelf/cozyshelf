export default class NoBooksFound extends Error {
	public constructor(bookID?: string) {
		const message = bookID
			? `Livro não encontrado! Nenhum livro foi encontrado com o ID: ${bookID}`
			: `Nenhum livro cadastrado! Não há livros cadastrados na base de dados.`;

		super(message);
	}
}
