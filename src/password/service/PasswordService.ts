import ClientDAO from "../../client/dao/typeORM/ClientDAO";
import NoClientsFound from "../../client/service/exceptions/NoClientsFound";
import PasswordDAO from "../dao/PasswordDAO";
import IUpdatePasswordData from "../types/IUpdatePasswordData";

export default class PasswordService {
	constructor(private paswordDAO: PasswordDAO, private clientDAO: ClientDAO) {}

	public async updatePasswordByClientId(
		clientId: string,
		updatedPasswordData: IUpdatePasswordData
	): Promise<void> {
		const existingClient = await this.clientDAO.findById(clientId);
		if (!existingClient) {
			throw new NoClientsFound(clientId);
		}
		const currentPasswordModel = existingClient.password;
		const passwordEntity = currentPasswordModel.toEntity();

		passwordEntity.updateData(updatedPasswordData);

		currentPasswordModel.updateFromEntity(passwordEntity);

		await this.paswordDAO.save(currentPasswordModel);
	}
}
