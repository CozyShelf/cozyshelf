import { CouponDAO } from "../dao/typeORM/CouponDAO";
import { CouponEntity } from "../domain/CouponEntity";
import { CouponType } from "../domain/enums/CouponType";
import CouponAlreadyUsed from "../domain/exceptions/CouponAlreadyUsed";
import CouponExpired from "../domain/exceptions/CouponExpired";
import CouponNotFound from "../domain/exceptions/CouponNotFound";
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

    async getValidCouponsByClientAndType(clientId: string, type: CouponType): Promise<CouponEntity[]> {
        const models = await this.couponDAO.findValidByClientIdAndType(clientId, type);
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

    async markAsUsed(couponIds: string[], orderId: string): Promise<void> {
        for (const id of couponIds) {
            const model = await this.couponDAO.findById(id);
            if (model) {
                model.isActive = false;
                model.orderId = orderId;
                await this.couponDAO.save(model);                
            }
        }
    }

    async validateCouponsAndVerifyValidity(couponIds: string[]): Promise<void> {
        for (const couponId of couponIds) {
            const model = await this.couponDAO.findById(couponId);
               if (!model) {
                throw new CouponNotFound(couponId);
            }

            if (!model.isActive) {
                throw new CouponAlreadyUsed(couponId);
            }

            if (model instanceof PromotionalCouponModel) {
                const now = new Date();
                if (model.expirationDate && model.expirationDate < now) {
                    throw new CouponExpired(model.expirationDate);
                }
            }
        }
    }
}