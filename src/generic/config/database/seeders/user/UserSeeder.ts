import { DataSource } from "typeorm";
import ClientModel from "../../../../../client/model/ClientModel";
import AddressModel from "../../../../../address/model/AddressModel";
import CountryModel from "../../../../../address/model/CountryModel";
import PasswordModel from "../../../../../password/model/PasswordModel";
import Password from "../../../../../password/domain/Password";
import TelephoneModel from "../../../../../telephone/model/TelephoneModel";
import CreditCardModel from "../../../../../card/model/CreditCardModel";
import CardFlagModel from "../../../../../card/model/CardFlagModel";
import users from "./users";

export default class UserSeeder {
	static async execute(dataSource: DataSource): Promise<void> {
		try {
			const clientDao = dataSource.getRepository(ClientModel);
			const cardFlagDao = dataSource.getRepository(CardFlagModel);

			for (const user of users) {
				const existingClient = await clientDao.findOne({
					where: { email: user.email },
				});

				if (existingClient) {
					console.log(
						`Client with email ${user.email} already exists, skipping...`
					);
					continue;
				}

				const password = new PasswordModel(
					Password.encrytPassword(user.password)
				);

				const telephone = new TelephoneModel(
					user.telephone.ddd,
					user.telephone.number,
					user.telephone.type
				);

				const cards = [];
				for (const cardInfo of user.cards) {
					const card = new CreditCardModel(
						cardInfo.number,
						cardInfo.nameOnCard,
						cardInfo.cvv,
						cardInfo.isPreferred,
						cardInfo.cardFlag.description
					);

					const flagModel = await cardFlagDao.findOneBy({
						description: card.flagDescription,
					});

					if (flagModel) {
						card.cardFlag = flagModel;
					}

					cards.push(card);
				}

				const addresses = [];
				for (const addr of user.addresses) {
					const countryModel = new CountryModel(
						addr.country.name,
						addr.country.acronym
					);

					const address = new AddressModel(
						addr.zipCode,
						addr.number,
						addr.residenceType,
						addr.streetName,
						addr.streetType,
						addr.neighborhood,
						addr.shortPhrase,
						addr.observation,
						addr.city,
						addr.state,
						countryModel,
						addr.type
					);

					addresses.push(address);
				}

				const client = new ClientModel(
					user.name,
					user.birthDate,
					user.cpf,
					telephone,
					user.email,
					password,
					user.ranking,
					user.gender,
					addresses,
					cards
				);
			
				client.id = user.id;
				
				await clientDao.save(client);
			}
		} catch (error) {
			console.error("[ERROR] 🔴 Error in corrected seeding:", error);
			throw error;
		}
	}
}
