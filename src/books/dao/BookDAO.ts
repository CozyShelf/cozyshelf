import IDAO from "../../generic/dao/IDAO";
import Book from "../domain/Book";
import path from "path";
import fs from "fs";

export default class BookDAO implements IDAO<Book> {
	save(entity: Book): Promise<Book> {
		throw new Error("Method not implemented.");
	}

	async findAll(): Promise<Book[] | null> {
    try {
			const jsonFilePath = path.join(__dirname, "/books.json");

      if (!fs.existsSync(jsonFilePath)) {
        console.error(`Arquivo não encontrado: ${jsonFilePath}`);
        return null;
      }

      const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

      if (!Array.isArray(jsonData)) {
        console.error("JSON não contém um array de livros");
        return null;
      }

      if (jsonData.length === 0) {
        return [];
      }

      const books: Book[] = [];

      for (const data of jsonData) {
        try {
          const book = Book.fromJSON(data);
          books.push(book);
        } catch (error) {
          console.warn(`Erro ao processar livro com ID ${data.id || 'desconhecido'}:`, error);
        }
      }

      return books;

    } catch (error) {
      console.error("Erro ao ler arquivo de livros:", error);
      return null;
    }
  }

	async findAllWithPagination(limit: number, offset: number) {
		const books = await this.findAll();

		if (!books || offset >= books?.length) {
			return [];
		}

		return books.slice(offset, offset + limit);
	}

	findById(id: number): Promise<Book | null> {
		return this.findAll().then((books) => {
			return books?.find((book) => book.id === id) || null;
		});
	}

	delete(id: number): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
