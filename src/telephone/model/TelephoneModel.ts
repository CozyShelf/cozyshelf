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

	constructor(ddd: string, number: string, type: TelephoneType) {
		super();
		this.ddd = ddd;
		this.number = number;
		this.type = type;
	}

	public toEntity(): Telephone {
		const telephone = new Telephone(this.ddd, this.number, this.type);
		telephone.id = this.id;
		return telephone;
	}

	public static fromEntity(telephone: Telephone): TelephoneModel {
		return new TelephoneModel(
			telephone.ddd,
			telephone.number,
			telephone.type
		);
	}
}
