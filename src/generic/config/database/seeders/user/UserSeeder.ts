import { DataSource } from "typeorm";
import ClientModel from "../../../../../client/model/ClientModel";
import AddressModel from "../../../../../address/model/AddressModel";
import CountryModel from "../../../../../address/model/CountryModel";
import PasswordModel from "../../../../../password/model/PasswordModel";
import TelephoneModel from "../../../../../telephone/model/TelephoneModel";
import CreditCardModel from "../../../../../card/model/CreditCardModel";
import CardFlagModel from "../../../../../card/model/CardFlagModel";
import users from "./users";

export default class UserSeeder {
	static async execute(dataSource: DataSource): Promise<void> {
		try {
			const clientDao = dataSource.getRepository(ClientModel);
			const countryDao = dataSource.getRepository(CountryModel);
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

				const password = new PasswordModel(user.password);

				const telephone = new TelephoneModel(
					user.telephone.ddd,
					user.telephone.number,
					user.telephone.type
				);

				const cards = [];
				for (const cardInfo of user.cards) {
					let cardFlag = await cardFlagDao.findOneBy(cardInfo.cardFlag);
					if (cardFlag) {
						const card = new CreditCardModel(
							cardInfo.number,
							cardInfo.nameOnCard,
							cardInfo.cvv,
							cardInfo.isPreferred,
							cardFlag
						);
						cards.push(card);
					}
				}

				const addresses = [];
				for (const addr of user.addresses) {
					let country = await countryDao.findOneBy(addr.country);
					if (!country) {
						country = await countryDao.save(countryDao.create(addr.country));
					}

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
						country,
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

				await clientDao.save(client);
			}
		} catch (error) {
			console.error("[ERROR] 🔴 Error in corrected seeding:", error);
			throw error;
		}
	}
}
