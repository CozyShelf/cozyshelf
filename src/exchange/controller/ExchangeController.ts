import { Request, Response } from "express";
import { ExchangeService } from "../service/ExchangeService";
import Exchange from "../domain/Exchange";
import INewExchangeData from "../dto/INewExchangeData";
import IExchangeBooksStock from "../dto/IExchangeBooksStock";

export default class ExchangeController {
    private readonly service: ExchangeService;

    constructor(service: ExchangeService) {
        this.service = service;
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as INewExchangeData;
            const orderId = body.orderId;

            const exchange = Exchange.fromRequestData(body);
            const createdExchange = await this.service.create(exchange);
            console.log("[INFO] ✅ Exchange created successfully!");

            res.status(201).json({
                message: `Troca ${createdExchange.id} criada com sucesso para o pedido de id: ${orderId}!`,
                exchangeId: createdExchange.id,
                orderId: orderId,
            });
        } catch (e) {
            this.createErrorResponse(res, e as Error);
        }
    }

    public async confirmExchange(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const returnItemsStock = req.body.returnToStock as IExchangeBooksStock[];
            const confirmedExchange = await this.service.confirmExchange(orderId, returnItemsStock);
            console.log("[INFO] ✅ Exchange confirmed successfully!");

            res.status(200).json({
                message: `Troca confirmada com sucesso!`,
                exchangeId: confirmedExchange.id,
            });
        } catch (e) {
            this.createErrorResponse(res, e as Error);
        }
    }

    private createErrorResponse(res: Response, e: Error) {
        console.error("[ERROR] ❌ Erro na operação:", e.message);

        let statusCode = 400;

        if (
            e.message.includes("não encontrado") ||
            e.message.includes("not found")
        ) {
            statusCode = 404;
        } else if (
            e.message.includes("já existe") ||
            e.message.includes("already exists")
        ) {
            statusCode = 409;
        } else if (
            e.message.includes("obrigatório") ||
            e.message.includes("inválido") ||
            e.message.includes("invalid")
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