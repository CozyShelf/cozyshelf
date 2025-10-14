import { CouponDAO } from "../dao/typeORM/CouponDAO";
import { CouponEntity } from "../domain/CouponEntity";
import { CouponType } from "../domain/enums/CouponType";
import { ExchangeCoupon } from "../domain/ExchangeCoupon";
import { PromotionalCoupon } from "../domain/PromotionalCoupon";
import { ExchangeCouponModel } from "../model/ExchangeCouponModel";
import { PromotionalCouponModel } from "../model/PromotionalCouponModel";

export class CouponService {
    constructor(private readonly couponDAO: CouponDAO) {}

    async getAllCoupons(): Promise<CouponEntity[]> {
        const models = await this.couponDAO.findAll();
        const entities = models.map(model => model.toEntity());
        return entities;
    }

    async getCouponsByType(type: CouponType): Promise<CouponEntity[]> {
        const models = await this.couponDAO.findByType(type);
        return models.map(model => model.toEntity());
    }

    async getCouponsByClient(clientId: string): Promise<CouponEntity[]> {
        const models = await this.couponDAO.findByClientId(clientId);
        return models.map(model => model.toEntity());
    }

    async getCouponById(id: string): Promise<CouponEntity | null> {
        const model = await this.couponDAO.findById(id);
        return model ? model.toEntity() : null;
    }

    async createExchangeCoupon(coupon: ExchangeCoupon): Promise<ExchangeCoupon> {
        const model = ExchangeCouponModel.fromEntity(coupon);
        const saved = await this.couponDAO.saveExchangeCoupon(model);
        return saved.toEntity() as ExchangeCoupon;
    }

    async createPromotionalCoupon(coupon: PromotionalCoupon): Promise<PromotionalCoupon> {
        const model = PromotionalCouponModel.fromEntity(coupon);
        const saved = await this.couponDAO.savePromotionalCoupon(model);
        return saved.toEntity() as PromotionalCoupon;
    }
}