import { Request, Response } from "express";
import { CardService } from "../service/CardService";
import INewCardData from "../types/INewCardData";
import CardListDTO from "../dto/CardListDTO";
import CardDetailsDTO from "../dto/CardDetailsDTO";
import CardFlagListDTO from "../dto/CardFlagListDTO";
import IUpdateCardData from "../types/IUpdateCardData";
import CreditCard from "../domain/CreditCard";

export default class CardController {
	private readonly service: CardService;

	constructor(service: CardService) {
		this.service = service;
	}

	public async create(req: Request, res: Response): Promise<void> {
		try {
			this.verifyRequestBody(req, res);

			const body = req.body as INewCardData;
			const clientId = body.clientId;

			const card = CreditCard.fromRequestData(body);
			const createdCard = await this.service.create(clientId, card);
			
			res.status(201).json({
				message: `Cartão ${createdCard.cardFlag.description} criado com sucesso para o cliente de id: ${clientId}!`,
				cardId: createdCard.id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async getAllFlags(_: Request, res: Response): Promise<void> {
		try {
			const flags = await this.service.getAllFlags();
			const flagListDTOs = flags.map((flag) =>
				CardFlagListDTO.fromEntity(flag)
			);

			res.status(200).json({
				message: `${flags.length} bandeira(s) de cartão encontrada(s)!`,
				count: flags.length,
				data: flagListDTOs,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async getById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const card = await this.service.getById(id);
			const cardDetailsDTO = CardDetailsDTO.fromEntity(card);

			res.status(200).json({
				message: `Dados do cartão carregados com sucesso!`,
				data: cardDetailsDTO,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async getByClientId(req: Request, res: Response): Promise<void> {
		try {
			const { clientId } = req.params;
			const cards = await this.service.getByClientId(clientId);
			const cardListDTOs = cards.map((card) => CardListDTO.fromEntity(card));

			res.status(200).json({
				message: `${cards.length} cartão(ões) encontrado(s) para o cliente!`,
				count: cards.length,
				data: cardListDTOs,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			this.verifyRequestBody(req, res);

			const updatedCard = await this.service.update(
				id,
				req.body as IUpdateCardData
			);

			res.status(200).json({
				message: `Cartão ${updatedCard.cardFlag.description} atualizado com sucesso!`,
				cardId: updatedCard.id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async delete(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			if (!id || id.trim() === "") {
				res.status(400).json({
					error: true,
					message: "ID do cartão é obrigatório para exclusão!",
				});
				return;
			}

			await this.service.delete(id);
			res.status(200).json({
				message: `Cartão removido com sucesso!`,
				cardId: id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async renderCardsTable(req: Request, res: Response) {
		const clientId = req.params.id;
		const cardsEntity = await this.service.getByClientId(clientId);
		const cards = cardsEntity.map((card) => CardListDTO.fromEntity(card));

		res.render("cardTable", {
			title: "Meus Cartões",
			currentHeaderTab: "profile",
			layout: "detailsLayout",
			currentUrl: "card",
			isAdmin: false,
			cards,
		});
	}

	public async renderCardDetails(req: Request, res: Response) {
		const cardId = req.params.id;

		const cardEntity = await this.service.getById(cardId);

		res.render("cardDetails", {
			title: "Detalhes do Cartão",
			currentHeaderTab: "profile",
			layout: "detailsLayout",
			currentUrl: "card",
			isAdmin: false,
			card: CardDetailsDTO.fromEntity(cardEntity),
		});
	}

	public renderCreateCardForm(_: Request, res: Response) {
		res.render("cardDetails", {
			title: "Novo Cartão",
			currentHeaderTab: "profile",
			layout: "detailsLayout",
			currentUrl: "card",
			isAdmin: false,
			card: null,
		});
	}

	private verifyRequestBody(req: Request, res: Response) {
		if (!req.body || Object.keys(req.body).length === 0) {
			res.status(400).json({
				error: true,
				message: "Dados do cartão são obrigatórios!",
			});
			return;
		}
	}

	private createErrorResponse(res: Response, e: Error) {
		console.error("[ERROR] ❌ Erro na operação:", e.message);

		let statusCode = 400;

		if (
			e.message.includes("não encontrado") ||
			e.message.includes("não foi encontrado")
		) {
			statusCode = 404;
		} else if (
			e.message.includes("já cadastrado") ||
			e.message.includes("já existe")
		) {
			statusCode = 409;
		} else if (
			e.message.includes("obrigatório") ||
			e.message.includes("inválido")
		) {
			statusCode = 422;
		}

		res.status(statusCode).json({
			error: true,
			message: e.message,
			timestamp: new Date().toISOString(),
		});
	}
}
