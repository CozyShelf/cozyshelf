import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import IFactory from "../../generic/factories/Factory";
import CardController from "../controller/CardController";
import { CardDAO } from "../dao/typeORM/CardDAO";
import CardFlagDAO from "../dao/typeORM/CardFlagDAO";
import { CardService } from "../service/CardService";

export class CardControllerFactory implements IFactory<CardController> {
	public make(): CardController {
		const cardDAO = new CardDAO(postgresDataSource);
		const clientDAO = new ClientDAO(postgresDataSource);
		const cardFlagDAO = new CardFlagDAO(postgresDataSource);
		const cardService = new CardService(cardDAO, clientDAO, cardFlagDAO);
		return new CardController(cardService);
	}
}
