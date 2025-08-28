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
        const clientDao = dataSource.getRepository(ClientModel);
        const addressDao = dataSource.getRepository(AddressModel);
        const countryDao = dataSource.getRepository(CountryModel);
        const passwordDao = dataSource.getRepository(PasswordModel);
        const telephoneDao = dataSource.getRepository(TelephoneModel);
        const cardDao = dataSource.getRepository(CreditCardModel);
        const cardFlagDao = dataSource.getRepository(CardFlagModel);

        for (const user of users) {
            // Password
            let password = passwordDao.create({ _value: user.password, _force: 8 });
            await passwordDao.save(password);

            // Telephone
            let telephone = telephoneDao.create({ _ddd: user.telephone._ddd, _number: user.telephone._number, _type: user.telephone._type });
            await telephoneDao.save(telephone);

            // Client
            let client = clientDao.create({
                _name: user.name,
                _birthDate: user.birthDate,
                _cpf: user.cpf,
                _email: user.email,
                _password: password,
                _ranking: user.ranking,
                _telephone: telephone,
                _gender: user.gender
            });
            await clientDao.save(client);

            // Addresses
            for (const addr of user.addresses) {
                let country = await countryDao.findOneBy({ _name: addr.country.name });
                if (!country) {
                    country = countryDao.create({ _name: addr.country.name, _acronym: addr.country.acronym });
                    country = await countryDao.save(country); // Save and get the managed entity with id
                }

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
                    _client: client
                });
                await addressDao.save(address);
                console.log("[INFO] 🏠 Address seeded successfully");
            }

            // Cards
            for (const cardInfo of user.cards) {
                let cardFlag = await cardFlagDao.findOneBy({ description: cardInfo.cardFlag });
                if (!cardFlag) {
                    cardFlag = cardFlagDao.create({ description: cardInfo.cardFlag });
                    await cardFlagDao.save(cardFlag);
                }

                let card = cardDao.create({
                    _number: cardInfo.number,
                    _nameOnCard: cardInfo.nameOnCard,
                    _cvv: cardInfo.cvv,
                    _isPreferred: cardInfo.isPreferred,
                    _cardFlag: cardFlag,
                    _client: client
                });
                await cardDao.save(card);
            }
        }
    }
}
    