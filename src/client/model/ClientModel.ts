import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import Gender from "../domain/enums/Gender";
import AddressModel from "../../address/model/AddressModel";
import CreditCardModel from "../../card/model/CreditCardModel";
import GenericModel from "../../generic/model/GenericModel";
import PasswordModel from "../../password/model/PasswordModel";
import TelephoneModel from "../../telephone/model/TelephoneModel";
import Client from "../domain/Client";

@Entity()
export default class ClientModel extends GenericModel {
	@Column({ type: "varchar" })
	name: string;

	@Column({ type: "date" })
	birthDate: Date;

	@Column({ type: "varchar" })
	cpf: string;

	@Column({ type: "varchar" })
	email: string;

	@OneToOne(() => PasswordModel, { cascade: true, eager: true })
	@JoinColumn()
	password: PasswordModel;

	@Column({ type: "int", default: 0 })
	ranking: number;

	@OneToOne(() => TelephoneModel, { cascade: true, eager: true })
	@JoinColumn()
	telephone: TelephoneModel;

	@Column({ type: "enum", enum: Gender })
	gender!: Gender;

	@OneToMany(() => CreditCardModel, (card: CreditCardModel) => card.client, {
		cascade: true,
		eager: true,
	})
	cards!: CreditCardModel[];

	@OneToMany(() => AddressModel, (address: AddressModel) => address.client, {
		cascade: true,
		eager: true,
	})
	addresses!: AddressModel[];

	constructor(
		name: string,
		birthDate: Date,
		cpf: string,
		telephone: TelephoneModel,
		email: string,
		password: PasswordModel,
		ranking: number,
		gender: Gender,
		addresses: AddressModel[],
		cards: CreditCardModel[]
	) {
		super();
		this.name = name;
		this.birthDate = birthDate;
		this.cpf = cpf;
		this.telephone = telephone;
		this.email = email;
		this.password = password;
		this.ranking = ranking;
		this.gender = gender;
		this.addresses = addresses;
		this.cards = cards;
	}

	public toEntity(): Client {
		const telephone = this.telephone.toEntity();
		const password = this.password.toEntity();

		const adresses = this.addresses.map((addressModel) =>
			addressModel.toEntity()
		);

		const cards = this.cards.map((cardModel) => cardModel.toEntity());

		const client = new Client(
			this.name,
			this.birthDate,
			this.cpf,
			telephone,
			this.email,
			password,
			this.gender,
			adresses,
			cards
		);
		client.id = this.id;

		return client;
	}

	public static fromEntity(client: Client): ClientModel {
		const clientModel = new ClientModel(
			client.name,
			client.birthDate,
			client.cpf,
			TelephoneModel.fromEntity(client.telephone),
			client.email,
			PasswordModel.fromEntity(client.password),
			client.ranking,
			client.gender,
			client.addresses.map((address) => AddressModel.fromEntity(address)),
			client.cards.map((card) => CreditCardModel.fromEntity(card))
		);

		return clientModel;
	}

	public updateFromEntity(updatedClient: Client) {
		if (this.name != updatedClient.name) {
			this.name = updatedClient.name;
		}
		if (this.birthDate != updatedClient.birthDate) {
			this.birthDate = updatedClient.birthDate;
		}
		if (this.cpf != updatedClient.cpf) {
			this.cpf = updatedClient.cpf;
		}
		if (this.email != updatedClient.email) {
			this.email = updatedClient.email;
		}
		if (this.gender != updatedClient.gender) {
			this.gender = updatedClient.gender;
		}
		this.telephone.updateFromEntity(updatedClient.telephone);
	}
}
