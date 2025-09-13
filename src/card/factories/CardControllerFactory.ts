import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import IFactory from "../../generic/factories/Factory";
import CardController from "../controller/CardController";
import { CardDAO } from "../dao/typeORM/CardDAO";
import CardFlagDAO from "../dao/typeORM/CardFlagDAO";
import { CardService } from "../service/CardService";

export class CardControllerFactory implements IFactory<CardController> {
	private cardDAO: CardDAO;
	private cardFlagDAO: CardFlagDAO;

	public constructor() {
		this.cardDAO = new CardDAO(postgresDataSource);
		this.cardFlagDAO = new CardFlagDAO(postgresDataSource);
	}

	public make(): CardController {
		const clientDAO = new ClientDAO(postgresDataSource);
		const cardService = this.makeCardService(clientDAO);
		return new CardController(cardService);
	}

	public makeCardService(clientDAO: ClientDAO) {
		return new CardService(this.cardDAO, clientDAO, this.cardFlagDAO);
	}
}
