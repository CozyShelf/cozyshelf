import { DataSource } from "typeorm";
import coupons from "./coupons";
import { CouponType } from "../../../../../coupons/domain/enums/CouponType";

export default class CouponsSeeder {
    static async execute(dataSource: DataSource): Promise<void> {
        try {
            const couponRepository = dataSource.getRepository('CouponModel');

            const existingCoupons = await couponRepository.find();
            if (existingCoupons.length > 0) {
                console.log('Coupons already exist, skipping seeding.');
                return;
            }

            for (const coupon of coupons) {
                if (coupon.type == CouponType.EXCHANGE) {
                    const couponModel = couponRepository.create({
                        value: coupon.value,
                        client: coupon.clientId,
                        type: coupon.type,
                        description: coupon.description,
                        id: coupon.id
                    });
                    couponModel.createdAt = coupon.createdAt;

                    await couponRepository.save(couponModel);
                }
                else if (coupon.type == CouponType.PROMOTIONAL) {
                    const couponModel = couponRepository.create({
                        value: coupon.value,
                        client: coupon.clientId,
                        type: coupon.type,
                        description: coupon.description,
                        id: coupon.id,
                        expirationDate: coupon.expirationDate
                    });
                    couponModel.createdAt = coupon.createdAt;
                    await couponRepository.save(couponModel);
                }
            }
        } catch (error) {
            console.error('Error seeding coupons:', error);
        }
    }
}
