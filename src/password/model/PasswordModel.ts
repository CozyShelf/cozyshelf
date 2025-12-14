import { Column, Entity, OneToOne } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import ClientModel from "../../client/model/ClientModel";
import Password from "../domain/Password";

@Entity()
export default class PasswordModel extends GenericModel {
	@Column({ type: "varchar" })
	value: string;

	@OneToOne(() => ClientModel, (client) => client.password)
	client!: ClientModel;

	constructor(value: string, isActive: boolean) {
		super();
		this.value = value;
		this.isActive = isActive;
	}

	public toEntity(): Password {
		const password = new Password(this.value);
		password.id = this.id;
		password.isActive = this.isActive;
		return password;
	}

	public static fromEntity(password: Password): PasswordModel {
		return new PasswordModel(password.value, password.isActive);
	}

	public updateFromEntity(updatedPassword: Password) {
		if (updatedPassword.value != this.value) {
			this.value = updatedPassword.value;
		}
		if (updatedPassword.isActive != this.isActive) {
			this.isActive = updatedPassword.isActive;
		}
	}
}
