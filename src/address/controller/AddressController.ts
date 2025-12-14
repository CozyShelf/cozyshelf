import { Request, Response } from "express";
import { AddressService } from "../service/AddressService";
import Address from "../domain/Address";
import INewAddressData from "../types/INewAddressData";
import AddressListDTO from "../dto/AddressListDTO";
import AddressDetailsDTO from "../dto/AddressDetailsDTO";
import IUpdateAddressData from "../types/IUpdateAddressData";
import { brazilStates } from "../../generic/config/database/seeders/address/states";

export default class AddressController {
	private readonly service: AddressService;

	constructor(service: AddressService) {
		this.service = service;
	}

	public async create(req: Request, res: Response): Promise<void> {
		try {
			const body = req.body as INewAddressData;
			const clientId = body.clientId;

			const address = Address.fromRequestData(body);
			const createdAddress = await this.service.create(clientId, address);

			res.status(201).json({
				message: `Endereço ${createdAddress.shortPhrase} criado com sucesso para o cliente de id: ${clientId}!`,
				addressId: createdAddress.id
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

			await this.service.delete(id);

			res.status(200).json({
				message: `Endereço removido com sucesso!`,
				addressId: id,
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public async renderAddressesTable(req: Request, res: Response) {
		const clientId = req.params.id;
		const addressList = await this.service.getByClientId(clientId);
		const addresses = addressList.map((address) =>
			AddressListDTO.fromEntity(address)
		);

		res.render("addressTable", {
			title: "Meus Endereços",
			currentHeaderTab: "profile",
			layout: "detailsLayout",
			currentUrl: "address",
			isAdmin: false,
			addresses,
		});

	}

	public async renderAddressDetails(req: Request, res: Response) {
		const addressId =  req.params.id;

		try {
			const addressEntity =  await this.service.getById(addressId);
			const address = AddressDetailsDTO.fromEntity(addressEntity);

			res.render("addressDetails", {
				title: "Editar Endereço",
				currentHeaderTab: "profile",
				layout: "detailsLayout",
				currentUrl: "address",
				isAdmin: false,
				address,
				states: brazilStates,
				withTitle: true
			});
		} catch (e) {
			this.createErrorResponse(res, e as Error);
		}
	}

	public renderCreateAddress(_: Request, res: Response) {
		res.render("addressDetails", {
			title: "Novo Endereço",
			layout : "detailsLayout",
			currentUrl: "address",
			currentHeaderTab: "profile",
			isAdmin: false,
			address: null,
			states: brazilStates,
			withTitle: true
		});
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
