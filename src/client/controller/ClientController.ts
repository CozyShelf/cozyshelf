import { Request, Response } from "express";
import { ClientService } from "../service/ClientService";
import Client from "../domain/Client";
import INewClientInputData from "../types/INewClientRequestData";
import ClientListDTO from "../dto/ClientListDTO";
import ClientDetailsDTO from "../dto/ClientDetailsDTO";
import IUpdateClientData from "../types/IUpdateClientData";

export default class ClientController {
	public constructor(private readonly service: ClientService) {}

	public async create(req: Request, res: Response): Promise<void> {
		try {
			const client = Client.fromRequestData(req.body as INewClientInputData);
			const createdClient = await this.service.create(client);

			res.status(200).json({
				message: `Client ${createdClient.name} created successfully`,
				clientId: createdClient.id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async getAll(_: Request, res: Response): Promise<void> {
		try {
			const clients = await this.service.getAll();
			const clientListDTOs = clients.map((client) =>
				ClientListDTO.fromEntity(client)
			);
			res.status(200).json(clientListDTOs);
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async getById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const client = await this.service.getById(id);

			const clientDetailsDTO = ClientDetailsDTO.fromEntity(client);
			res.status(200).json(clientDetailsDTO);
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const updatedClient = await this.service.update(
				id,
				req.body as IUpdateClientData
			);

			res.status(200).json({
				message: `Client ${updatedClient.name} updated successfully`,
				clientId: updatedClient.id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async delete(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			await this.service.delete(id);
			res.status(200).json({ message: "Client deleted successfully" });
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async renderClientTable(_: Request, res: Response): Promise<void> {
		res.render("clientTable", {
			title: "Lista de Clientes",
			currentHeaderTab: "profile",
			layout: "defaultLayoutAdmin",
			currentUrl: "clients",
		});
	}

	public async renderClientDetails(_: Request, res: Response): Promise<void> {
		res.render("clientDetails", {
			title: "Detalhes do Cliente",
			currentHeaderTab: "profile",
			layout: "detailsLayout",
			currentUrl: "client",
			isAdmin: false,
		});
	}

	public async renderClientDetailsAdmin(
		_: Request,
		res: Response
	): Promise<void> {
		res.render("clientDetailsAdmin", {
			title: "Detalhes do Cliente",
			currentHeaderTab: "profile",
			layout: "defaultLayoutAdmin",
			currentUrl: "clients",
		});
	}

	public renderClientRegistration(_: Request, res: Response): void {
		res.render("clientRegistration", {
			title: "Cadastro de Clientes",
			currentHeaderTab: "registration",
		});
	}

	public renderPasswordDetails(_: Request, res: Response) {
		res.render("passwordDetail", {
			title: "Alterar Senha",
			currentHeaderTab: "profile",
			layout: "detailsLayout",
			currentUrl: "password",
			isAdmin: false,
		});
	}

	private createErrorResponse(res: Response, e: Error) {
		res.status(400).json({
			message: (e as Error).message,
		});
	}
}
