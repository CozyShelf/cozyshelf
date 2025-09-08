import { Request, Response } from "express";
import { AddressService } from "../service/AddressService";
import Address from "../domain/Address";
import INewAddressData from "../types/INewAddressData";
import AddressListDTO from "../dto/AddressListDTO";
import AddressDetailsDTO from "../dto/AddressDetailsDTO";
import IUpdateAddressData from "../types/IUpdateAddressData";

export default class AddressController {
	private readonly service: AddressService;

	constructor(service: AddressService) {
		this.service = service;
	}

	public async create(req: Request, res: Response): Promise<void> {
		try {
			this.verifyRequestBody(req, res);

			const body = req.body as INewAddressData;
			const clientId = body.clientId;

			const address = Address.fromRequestData(body);
			const createdAddress = await this.service.create(clientId, address);

			res.status(201).json({
				message: `Endereço ${createdAddress.shortPhrase} criado com sucesso para o cliente de id: ${clientId}!`,
				addressId: createdAddress.id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async getAll(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const addresses = await this.service.getByClientId(id);
			const addressListDTOs = addresses.map((address) =>
				AddressListDTO.fromEntity(address)
			);

			res.status(200).json({
				message: `${addresses.length} endereço(s) encontrado(s) para o cliente!`,
				count: addresses.length,
				data: addressListDTOs,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async getById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const address = await this.service.getById(id);
			const addressDetailsDTO = AddressDetailsDTO.fromEntity(address);

			res.status(200).json({
				message: `Dados do endereço carregados com sucesso!`,
				data: addressDetailsDTO,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			this.verifyRequestBody(req, res);

			const updatedAddress = await this.service.update(
				id,
				req.body as IUpdateAddressData
			);

			res.status(200).json({
				message: `Endereço ${updatedAddress.shortPhrase} atualizado com sucesso!`,
				addressId: updatedAddress.id,
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
					message: "ID do endereço é obrigatório para exclusão!",
				});
				return;
			}

			await this.service.delete(id);
			res.status(200).json({
				message: `Endereço removido com sucesso!`,
				addressId: id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public renderAddressesTable(_: Request, res: Response) {
		res.render("addressTable", {
			title: "Meus Endereços",
			currentHeaderTab: "profile",
			layout: "detailsLayout",
			currentUrl: "address",
			isAdmin: false,
		});
	}

	public renderAddressDetails(_: Request, res: Response) {
		res.render("addressTable", {
			title: "Meus Endereços",
			currentHeaderTab: "profile",
			layout: "detailsLayout",
			currentUrl: "address",
			isAdmin: false,
		});
	}

	public renderCreateAddressTable(_: Request, res: Response) {
		res.render("addressDetails", {
			title: "Novo Endereço",
			currentHeaderTab: "profile",
			isAdmin: false,
		});
	}

	private verifyRequestBody(req: Request, res: Response) {
		if (!req.body || Object.keys(req.body).length === 0) {
			res.status(400).json({
				error: true,
				message: "Dados do endereço são obrigatórios!",
			});
			return;
		}
	}

	private createErrorResponse(res: Response, e: Error) {
		console.error("[ERROR] ❌ Erro na operação:", e.message);

		let statusCode = 400;

		if (
			e.message.includes("não encontrado") ||
			e.message.includes("não foi encontrado")
		) {
			statusCode = 404;
		} else if (
			e.message.includes("já cadastrado") ||
			e.message.includes("já existe")
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
