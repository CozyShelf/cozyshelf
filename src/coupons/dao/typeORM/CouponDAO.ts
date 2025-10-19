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

    async findAll(): Promise<CouponModel[]> {
        return await this.couponRepository.find({
            where: { isActive: true },
            relations: ['client']
        });
    }

    async findByType(type: CouponType): Promise<CouponModel[]> {
        return await this.couponRepository.find({
            where: { type },
            relations: ['client']
        });
    }

    async findByClientId(clientId: string): Promise<CouponModel[]> {
        return await this.couponRepository.find({
            where: { client: { id: clientId }, isActive: true },
            relations: ['client']
        });
    }

    async findValidByClientIdAndType(clientId: string, type: CouponType): Promise<CouponModel[]> {
        return await this.couponRepository.find({
            where: { 
                client: { id: clientId },
                type,
                isActive: true
            },
            relations: ['client']
        });
    }

    async findById(id: string): Promise<CouponModel | null> {
        return await this.couponRepository.findOne({
            where: { id },
            relations: ['client']
        });
    }

    async save(coupon: CouponModel): Promise<CouponModel> {
        return await this.couponRepository.save(coupon);
    }

    async saveExchangeCoupon(coupon: ExchangeCouponModel): Promise<ExchangeCouponModel> {
        return await this.exchangeRepository.save(coupon);
    }

    async savePromotionalCoupon(coupon: PromotionalCouponModel): Promise<PromotionalCouponModel> {
        return await this.promotionalRepository.save(coupon);
    }
}