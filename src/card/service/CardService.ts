import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import ClientModel from "../../client/model/ClientModel";
import NoClientsFound from "../../client/service/exceptions/NoClientsFound";
import { CardDAO } from "../dao/typeORM/CardDAO";
import CreditCard from "../domain/CreditCard";
import CreditCardModel from "../model/CreditCardModel";
import CardFlagModel from "../model/CardFlagModel";
import CardNotFound from "./exceptions/CardNotFound";
import NoCardsFound from "./exceptions/NoCardsFound";
import IUpdateCardData from "../types/IUpdateCardData";
import CardFlagDAO from "../dao/typeORM/CardFlagDAO";
import InexistentCardFlag from "./exceptions/InexistentCardFlag";
import CardFlag from "../domain/CardFlag";
import NoCardFlagsFound from "./exceptions/NoCardFlagsFound";
import CardAlreadyExists from "./exceptions/CardAlreadyExists";

export class CardService {
	constructor(
		private readonly cardDAO: CardDAO,
		private readonly clientDAO: ClientDAO,
		private readonly cardFlagDAO: CardFlagDAO
	) {}

	async create(clientId: string, card: CreditCard): Promise<CreditCard> {
		const existingClient = await this.validateClientExists(clientId);
		await this.validateCardNumberIsUnique(card.number);
		const cardFlag = await this.validateCardFlag(card.cardFlag.description);

		const clientEntity = existingClient.toEntity();
		clientEntity.verifyPreferredCards(card);

		const newCardModel = this.createCardModel(card, existingClient, cardFlag);
		const savedCardModel = await this.cardDAO.save(newCardModel);

		return savedCardModel.toEntity();
	}

	private async validateClientExists(clientId: string): Promise<ClientModel> {
		const existingClient = await this.clientDAO.findById(clientId);
		if (!existingClient) {
			throw new NoClientsFound(clientId);
		}
		return existingClient;
	}

	private async validateCardNumberIsUnique(cardNumber: string): Promise<void> {
		const existingCard = await this.cardDAO.findByCardNumber(cardNumber);
		if (existingCard) {
			throw new CardAlreadyExists();
		}
	}

	private async validateCardFlag(
		flagDescription: string
	): Promise<CardFlagModel> {
		const flagModel = await this.cardFlagDAO.getFlagByDescription(
			flagDescription
		);
		if (!flagModel) {
			throw new InexistentCardFlag(flagDescription);
		}
		return flagModel;
	}

	private createCardModel(
		card: CreditCard,
		client: ClientModel,
		cardFlag: CardFlagModel
	): CreditCardModel {
		const newCardModel = CreditCardModel.fromEntity(card);
		newCardModel.client = client;
		newCardModel.cardFlag = cardFlag;
		return newCardModel;
	}

	async getById(id: string): Promise<CreditCard> {
		const cardModel = await this.cardDAO.findById(id);
		if (!cardModel) {
			throw new CardNotFound(id);
		}
		return cardModel.toEntity();
	}

	async getAll(): Promise<CreditCard[]> {
		const cardModels = await this.cardDAO.findAll();
		if (!cardModels || cardModels.length === 0) {
			throw new NoCardsFound();
		}
		return cardModels.map((cardModel) => cardModel.toEntity());
	}

	async getAllFlags(): Promise<CardFlag[]> {
		const flagModels = await this.cardFlagDAO.getAll();

		if (!flagModels || flagModels.length === 0) {
			throw new NoCardFlagsFound();
		}

		return flagModels.map((flagModel) => flagModel.toEntity());
	}

	async getByClientId(clientId: string): Promise<CreditCard[]> {
		const existingClient = await this.clientDAO.findById(clientId);
		if (!existingClient) {
			throw new NoClientsFound(clientId);
		}

		const cardModels = await this.cardDAO.findByClientId(clientId);
		if (!cardModels || cardModels.length === 0) {
			return [];
		}
		return cardModels.map((cardModel) => cardModel.toEntity());
	}

	async update(id: string, updateData: IUpdateCardData): Promise<CreditCard> {
		const existingCard = await this.cardDAO.findByIdWithClient(id);
		if (!existingCard) {
			throw new CardNotFound(id);
		}

		const updatedCardEntity = existingCard.toEntity();
		updatedCardEntity.updateData(updateData);

		if (updateData.isPreferred !== undefined) {
			const clientEntity = existingCard.client.toEntity();
			clientEntity.verifyCardUpdate(id, updatedCardEntity);
		}

		if (updateData.number && updateData.number !== existingCard.number) {
			await this.validateCardNumberIsUnique(updatedCardEntity.number);
		}

		existingCard.updateFromEntity(updatedCardEntity);

		if (updateData.cardFlag?.description) {
			existingCard.cardFlag = await this.validateCardFlag(
				updateData.cardFlag.description
			);
		}

		const updatedCardModel = await this.cardDAO.save(existingCard);
		return updatedCardModel.toEntity();
	}

	async delete(id: string): Promise<void> {
		const existingCard = await this.cardDAO.findById(id);
		if (!existingCard) {
			throw new CardNotFound(id);
		}
		await this.cardDAO.delete(id);
	}
}
