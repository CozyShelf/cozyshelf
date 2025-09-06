import {Column, Entity, OneToOne} from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import ClientModel from "../../client/model/ClientModel";
import Password from "../domain/Password";

@Entity()
export default class PasswordModel extends GenericModel {
	@Column({ type: "varchar" })
	value: string;

	@OneToOne(() => ClientModel, (client) => client.password)
	client!: ClientModel;

	constructor(value: string) {
		super();
		this.value = value;
	}

	public toEntity(): Password {
		const password = new Password(this.value);
		password.id = this.id;
		return password;
	}

	public static fromEntity(password: Password): PasswordModel {
		return new PasswordModel(password.value);
	}
}
