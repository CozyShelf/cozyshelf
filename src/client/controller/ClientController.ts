import { Request, Response } from "express";
import { ClientService } from "../service/ClientService";
import Client from "../domain/Client";
import INewClientInputData from "../types/INewClientRequestData";
import ClientListDTO from "../dto/ClientListDTO";
import ClientDetailsDTO from "../dto/ClientDetailsDTO";
import IUpdateClientData from "../types/IUpdateClientData";
import IUpdatePasswordData from "../../password/types/IUpdatePasswordData";
import PasswordService from "../../password/service/PasswordService";
import { brazilStates } from "../../generic/config/database/seeders/address/states";

export default class ClientController {
	public constructor(
		private readonly service: ClientService,
		private readonly passwordService: PasswordService
	) {}

	public async create(req: Request, res: Response): Promise<void> {
		try {
			this.verifyRequestBody(req, res);

			const client = Client.fromRequestData(req.body as INewClientInputData);
			const createdClient = await this.service.create(client);

			res.status(201).json({
				message: `Cliente ${createdClient.name} criado com sucesso! Bem-vindo à CozyShelf!`,
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

			res.status(200).json({
				message: `${clients.length} cliente(s) encontrado(s)!`,
				count: clients.length,
				data: clientListDTOs,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async getById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const client = await this.service.getById(id);
			const clientDetailsDTO = ClientDetailsDTO.fromEntity(client);

			res.status(200).json({
				message: `Dados do cliente carregados com sucesso!`,
				data: clientDetailsDTO,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			this.verifyRequestBody(req, res);

			const updatedClient = await this.service.update(
				id,
				req.body as IUpdateClientData
			);

			res.status(200).json({
				message: `Dados do cliente ${updatedClient.name} atualizados com sucesso!`,
				clientId: updatedClient.id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async updatePassword(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			this.verifyRequestBody(req, res);

			await this.passwordService.updatePasswordByClientId(
				id,
				req.body as IUpdatePasswordData
			);

			res.status(200).json({
				message: `Senha do cliente de id: ${id} atualizada com sucesso!`,
				clientId: id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async delete(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			if (!id || id.trim() === "") {
				res.status(400).json({
					error: true,
					message: "ID do cliente é obrigatório para exclusão!",
				});
				return;
			}

			await this.service.delete(id);
			res.status(200).json({
				message: `Cliente removido com sucesso!`,
				clientId: id,
			});
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
			states: brazilStates,
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

	private verifyRequestBody(req: Request, res: Response) {
		if (!req.body || Object.keys(req.body).length === 0) {
			res.status(400).json({
				error: true,
				message: "Dados do cliente são obrigatórios para o cadastro!",
			});
			return;
		}
	}

	private createErrorResponse(res: Response, e: Error) {
		console.error("[ERROR] ❌ Erro na operação:", e.message);

		let statusCode = 400;

		if (
			e.message.includes("não encontrado") ||
			e.message.includes("Cliente não encontrado")
		) {
			statusCode = 404;
		} else if (
			e.message.includes("já cadastrado") ||
			e.message.includes("Cliente já cadastrado")
		) {
			statusCode = 409;
		} else if (
			e.message.includes("obrigatório") ||
			e.message.includes("inválido")
		) {
			statusCode = 422;
		}

		res.status(statusCode).json({
			error: true,
			message: e.message,
			timestamp: new Date().toISOString(),
		});
	}
}
