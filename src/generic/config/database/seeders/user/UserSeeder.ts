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
                // === PASSWORD ===
                let password = passwordDao.create({ _value: user.password, _force: 8 });
                password = await passwordDao.save(password);

                // === TELEPHONE ===
                let telephone = telephoneDao.create({ 
                    ddd: user.telephone._ddd, 
                    number: user.telephone._number, 
                    type: user.telephone._type 
                });
                telephone = await telephoneDao.save(telephone);

                // === CLIENT ===
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
                client = await clientDao.save(client);

                // === COUNTRY ===
                let brazil = await countryDao.findOneBy({ _name: "Brasil" });
                if (!brazil) {
                    brazil = countryDao.create({ _name: "Brasil", _acronym: "BR" });
                    brazil = await countryDao.save(brazil);
                }

                // === CARDS ===
                for (const cardInfo of user.cards) {                
                    // Card Flag
                    let cardFlag = await cardFlagDao.findOneBy({ _description: cardInfo.cardFlag });
                    if (!cardFlag) {
                        cardFlag = cardFlagDao.create({ _description: cardInfo.cardFlag });
                        cardFlag = await cardFlagDao.save(cardFlag);
                    }

                    // Card
                    let card = cardDao.create({
                        _number: cardInfo.number,
                        _nameOnCard: cardInfo.nameOnCard,
                        _cvv: cardInfo.cvv,
                        _isPreferred: cardInfo.isPreferred,
                        _cardFlag: cardFlag,
                        _client: client
                    });
                    card = await cardDao.save(card);
                }

                // === ADDRESSES ===
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
                        _country: brazil,
                        _type: addr.type,
                        _client: client
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
    