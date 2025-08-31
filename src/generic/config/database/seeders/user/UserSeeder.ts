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
            const passwordDao = dataSource.getRepository(PasswordModel);
            const telephoneDao = dataSource.getRepository(TelephoneModel);
            const clientDao = dataSource.getRepository(ClientModel);
            const countryDao = dataSource.getRepository(CountryModel);
            const cardFlagDao = dataSource.getRepository(CardFlagModel);
            const cardDao = dataSource.getRepository(CreditCardModel);
            const addressDao = dataSource.getRepository(AddressModel);

            for (const user of users) {
							let password = passwordDao.create(user.password);
							password = await passwordDao.save(password);

							let telephone = telephoneDao.create(user.telephone);
							telephone = await telephoneDao.save(telephone);

							let client = clientDao.create({
								_name: user.name,
								_birthDate: user.birthDate,
								_cpf: user.cpf,
								_email: user.email,
								_password: password,
								_ranking: user.ranking,
								_telephone: telephone,
								_gender: user.gender,
							});
							client = await clientDao.save(client);

							for (const cardInfo of user.cards) {
								let cardFlag = await cardFlagDao.findOneBy(cardInfo.cardFlag);
								if (!cardFlag) {
									cardFlag = cardFlagDao.create(cardInfo.cardFlag);
									cardFlag = await cardFlagDao.save(cardFlag);
								}

								let card = cardDao.create({
									_number: cardInfo.number,
									_nameOnCard: cardInfo.nameOnCard,
									_cvv: cardInfo.cvv,
									_isPreferred: cardInfo.isPreferred,
									_cardFlag: cardFlag,
									_client: client,
								});
								card = await cardDao.save(card);
							}

							let country = await countryDao.findOneBy(user.country);
							if (!country) {
								country = countryDao.create(user.country);
								country = await countryDao.save(country);
							}

							for (const addr of user.addresses) {
								let address = addressDao.create({
									_zipCode: addr.zipCode,
									_number: addr.number,
									_residenceType: addr.residenceType,
									_streetName: addr.streetName,
									_streetType: addr.streetType,
									_neighborhood: addr.neighborhood,
									_shortPhrase: addr.shortPhrase,
									_observation: addr.observation,
									_city: addr.city,
									_state: addr.state,
									_country: country,
									_type: addr.type,
									_client: client,
								});
								address = await addressDao.save(address);
							}
						}

        } catch (error) {
            console.error("[ERROR] 🔴 Error in corrected seeding:", error);
            throw error;
        }
    };
}
