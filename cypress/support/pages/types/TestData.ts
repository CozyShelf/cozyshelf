export interface IClientTestData {
	name: string;
	birthDate: string;
	cpf: string;
	email: string;
	password: string;
	repeatPassword?: string;
	gender: string;
	phone: string;
	phoneType: string;
	address: IAddressTestData;
	card: ICardTestData;
}

export interface IAddressTestData {
	shortPhrase: string;
	cep: string;
	state: string;
	city: string;
	streetType: string;
	streetName: string;
	number: string;
	neighborhood: string;
	residenceType: string;
	type: string;
}

export interface ICardTestData {
	number: string,
	cvv: string,
	impressName: string,
	flag: string,
	isPreferred: boolean
}
