import AddressType from "../../../../../address/domain/enums/AddressType";
import Gender from "../../../../../client/domain/enums/Gender";
import TelephoneType from "../../../../../telephone/domain/enums/TelephoneType";
import TelephoneModel from "../../../../../telephone/model/TelephoneModel";

const users = [
	{
		name: "João Silva",
		birthDate: new Date("1990-05-15"),
		cpf: "12345678901",
		email: "joao.silva@email.com",
		password: { _value: "senha123@@", _force: 8 },
		ranking: 5,
		gender: Gender.MALE,
		country: { _name: "Brasil", _acronym: "BR" },
		telephone: {
			_ddd: "55",
			_number: "11999999999",
			_type: TelephoneType.MOBILE,
		} as unknown as TelephoneModel,
		addresses: [
			{
				zipCode: "01234567",
				number: "100",
				residenceType: "Apartment",
				streetName: "Rua das Flores",
				streetType: "Rua",
				neighborhood: "Centro",
				shortPhrase: "Próximo ao mercado",
				observation: "Sem observações",
				city: "São Paulo",
				state: "SP",
				country: { name: "Brasil", acronym: "BR" },
				type: AddressType.DELIVERY_AND_BILLING,
			},
		],
		cards: [
			{
				number: "4111111111111111",
				nameOnCard: "João Silva",
				cvv: "123",
				isPreferred: true,
				cardFlag: { _description: "Visa" },
			},
		],
	},
];

export default users;
