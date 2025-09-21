import postgresDataSource from "../../src/generic/config/database/datasources/postgresDataSource";
import ClientModel from "../../src/client/model/ClientModel";

const clientDAO = postgresDataSource.getRepository(ClientModel);

async function deleteClient() {
	let client =
		(await clientDAO.findOneBy({ cpf: "12345678913" })) ??
		(await clientDAO.findOneBy({ email: "joao.teste1@email.com" }));

	if (client) {
		clientDAO.delete({ id: client.id });
	}
}
