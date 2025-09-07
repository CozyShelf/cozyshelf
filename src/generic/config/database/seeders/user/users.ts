import AddressType from "../../../../../address/domain/enums/AddressType";
import Gender from "../../../../../client/domain/enums/Gender";
import TelephoneType from "../../../../../telephone/domain/enums/TelephoneType";
import TelephoneModel from "../../../../../telephone/model/TelephoneModel";

const users = [
	{
		name: "João Silva",
		birthDate: new Date("1990-05-15"),
		cpf: "123.456.378-21",
		email: "joao.silva@email.com",
		password: "Senha123@@",
		ranking: 5,
		gender: Gender.MALE,
		telephone: {
			ddd: "55",
			number: "11999999999",
			type: TelephoneType.MOBILE,
		} as unknown as TelephoneModel,
		addresses: [
			{
				zipCode: "08900-000",
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
				cardFlag: { description: "Visa" },
			},
		],
	},
];

export default users;
