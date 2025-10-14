import { DataSource, Repository } from "typeorm";
import { CouponModel } from "../../model/CouponModel";
import { ExchangeCouponModel } from "../../model/ExchangeCouponModel";
import { PromotionalCouponModel } from "../../model/PromotionalCouponModel";
import { CouponType } from "../../domain/enums/CouponType";

export class CouponDAO {
    private couponRepository: Repository<CouponModel>;
    private exchangeRepository: Repository<ExchangeCouponModel>;
    private promotionalRepository: Repository<PromotionalCouponModel>;

    constructor(dataSource: DataSource) {
        this.couponRepository = dataSource.getRepository(CouponModel);
        this.exchangeRepository = dataSource.getRepository(ExchangeCouponModel);
        this.promotionalRepository = dataSource.getRepository(PromotionalCouponModel);
    }

    // Buscar todos os tipos
    async findAll(): Promise<CouponModel[]> {
        return await this.couponRepository.find({
            relations: ['client']
        });
    }

    // Buscar por tipo específico
    async findByType(type: CouponType): Promise<CouponModel[]> {
        return await this.couponRepository.find({
            where: { type },
            relations: ['client']
        });
    }

    // Buscar por cliente
    async findByClientId(clientId: string): Promise<CouponModel[]> {
        return await this.couponRepository.find({
            where: { client: { id: clientId } },
            relations: ['client']
        });
    }

    // Buscar por cliente e tipo
    async findByClientIdAndType(clientId: string, type: CouponType): Promise<CouponModel[]> {
        return await this.couponRepository.find({
            where: { 
                client: { id: clientId },
                type 
            },
            relations: ['client']
        });
    }

    // Buscar por ID
    async findById(id: string): Promise<CouponModel | null> {
        return await this.couponRepository.findOne({
            where: { id },
            relations: ['client']
        });
    }

    // Salvar (funciona para ambos os tipos)
    async save(coupon: CouponModel): Promise<CouponModel> {
        return await this.couponRepository.save(coupon);
    }

    // Métodos específicos para Exchange Coupons
    async saveExchangeCoupon(coupon: ExchangeCouponModel): Promise<ExchangeCouponModel> {
        return await this.exchangeRepository.save(coupon);
    }

    // Métodos específicos para Promotional Coupons
    async savePromotionalCoupon(coupon: PromotionalCouponModel): Promise<PromotionalCouponModel> {
        return await this.promotionalRepository.save(coupon);
    }
}