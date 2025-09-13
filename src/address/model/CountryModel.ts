import { Column, Entity, OneToMany } from "typeorm";
import GenericModel from "../../generic/model/GenericModel";
import AddressModel from "./AddressModel";
import Country from "../domain/Country";

@Entity()
export default class CountryModel extends GenericModel {
	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "varchar" })
	acronym!: string;

	@OneToMany(() => AddressModel, (address) => address.country)
	addresses!: AddressModel[];

	constructor(name: string, acronym: string, isActive: boolean) {
		super();
		this.name = name;
		this.acronym = acronym;
		this.isActive = isActive;
	}

	public toEntity(): Country {
		const country = new Country(this.name, this.acronym);
		country.id = this.id;
		country.isActive = this.isActive;
		return country;
	}

	public static fromEntity(country: Country): CountryModel {
		return new CountryModel(country.name, country.acronym, country.isActive);
	}

	public updateFromEntity(updatedCountry: Country) {
		if (updatedCountry.name != this.name) {
			this.name = updatedCountry.name;
		}
		if (updatedCountry.acronym != this.acronym) {
			this.acronym = updatedCountry.acronym;
		}
	}
}
