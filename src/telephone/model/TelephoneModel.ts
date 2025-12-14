import { Column, Entity, OneToOne } from "typeorm";
import TelephoneType from "../domain/enums/TelephoneType";
import GenericModel from "../../generic/model/GenericModel";
import ClientModel from "../../client/model/ClientModel";
import Telephone from "../domain/Telephone";

@Entity()
export default class TelephoneModel extends GenericModel {
	@Column({ type: "varchar" }) ddd: string;

	@Column({ type: "varchar" }) number: string;

	@Column({ type: "enum", enum: TelephoneType }) type: TelephoneType;

	@OneToOne(() => ClientModel, (client) => client.telephone)
	client!: ClientModel;

	constructor(
		ddd: string,
		number: string,
		type: TelephoneType,
		isActive: boolean
	) {
		super();
		this.ddd = ddd;
		this.number = number;
		this.type = type;
		this.isActive = isActive;
	}

	public toEntity(): Telephone {
		const telephone = new Telephone(this.ddd, this.number, this.type);
		telephone.id = this.id;
		telephone.isActive = this.isActive;
		return telephone;
	}

	public static fromEntity(telephone: Telephone): TelephoneModel {
		return new TelephoneModel(
			telephone.ddd,
			telephone.number,
			telephone.type,
			telephone.isActive
		);
	}

	public updateFromEntity(updatedTelephone: Telephone) {
		if (this.number != updatedTelephone.number) {
			this.number = updatedTelephone.number;
		}
		if (this.ddd != updatedTelephone.ddd) {
			this.ddd = updatedTelephone.ddd;
		}
		if (this.type != updatedTelephone.type) {
			this.type = updatedTelephone.type;
		}
		if (this.isActive != updatedTelephone.isActive) {
			this.isActive = updatedTelephone.isActive;
		}
	}
}
