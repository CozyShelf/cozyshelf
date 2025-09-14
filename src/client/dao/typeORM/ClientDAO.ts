import { DataSource, Repository } from "typeorm";
import ClientModel from "../../model/ClientModel";
import IDAO from "../../../generic/dao/IDAO";
import IClientFilters from "../../types/IClientFilters";

export default class ClientDAO implements IDAO<ClientModel> {
	private repository: Repository<ClientModel>;

	constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(ClientModel);
	}

	public async save(client: ClientModel): Promise<ClientModel> {
		return await this.repository.save(client);
	}

	public async findByCPF(cpf: string) {
		return await this.repository.findOneBy({ cpf });
	}

	public async findByEmail(email: string) {
		return await this.repository.findOneBy({ email });
	}

	public async findAll(filters?: IClientFilters): Promise<ClientModel[] | null> {
        const queryBuilder = this.repository
            .createQueryBuilder("client")
            .leftJoinAndSelect("client.telephone", "telephone")
			.leftJoinAndSelect("client.addresses", "address")
			.leftJoinAndSelect("client.cards", "card")
			.leftJoinAndSelect("address.country", "country")
			.leftJoinAndSelect("card.cardFlag", "cardFlag")
			.leftJoinAndSelect("client.password", "password")
            .where("client.isActive = :isActive", { isActive: true });

        if (filters) {
            if (filters.name) {
                queryBuilder.andWhere("LOWER(client.name) LIKE LOWER(:name)", {
                    name: `%${filters.name}%`
                });
            }

            if (filters.cpf) {
                queryBuilder.andWhere("client.cpf LIKE :cpf", {
                    cpf: `%${filters.cpf}%`
                });
            }

            if (filters.email) {
                queryBuilder.andWhere("LOWER(client.email) LIKE LOWER(:email)", {
                    email: `%${filters.email}%`
                });
            }

            if (filters.phone) {
                queryBuilder.andWhere(
                    "(telephone.ddd LIKE :phone OR telephone.number LIKE :phone)", {
                    phone: `%${filters.phone}%`
                });
            }
        }

        return await queryBuilder.getMany();
    }

	public async findById(id: string): Promise<ClientModel | null> {
		return await this.repository
			.createQueryBuilder("client")
			.leftJoinAndSelect(
				"client.addresses",
				"address",
				"address.isActive = :addressActive",
				{ addressActive: true }
			)
			.leftJoinAndSelect(
				"client.cards",
				"card",
				"card.isActive = :cardActive",
				{ cardActive: true }
			)
			.leftJoinAndSelect("client.password", "password")
			.leftJoinAndSelect("client.telephone", "telephone")
			.leftJoinAndSelect("address.country", "country")
			.leftJoinAndSelect("card.cardFlag", "cardFlag")
			.where("client.id = :id", { id })
			.andWhere("client.isActive = :clientActive", { clientActive: true })
			.getOne();
	}

	public async delete(id: string): Promise<void> {
		await this.repository.update(id, { isActive: false });
	}
}
