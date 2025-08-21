import {DataSource, Repository} from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import AddressModel from "../../model/AddressModel";


export class AddressDAO implements IDAO<AddressModel> {
    private dataSource: DataSource;
    private repository: Repository<AddressModel>;
    
    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = this.dataSource.getRepository(AddressModel);
    }
    
    public async save(client: AddressModel): Promise<AddressModel> {
        return await this.repository.save(client);
    }
    
    public async findAll(): Promise<AddressModel[] | null> {
        return await this.repository.find();
    }
    
    public async findById(id: string): Promise<AddressModel | null> {
        return await this.repository.findOne({ where: { id } });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
