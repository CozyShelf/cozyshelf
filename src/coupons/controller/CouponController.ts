import CouponsListDTO from "../dto/CouponsListDTO";
import { CouponService } from "../service/CouponsService";

export default class CouponController{
    private readonly service: CouponService;
    
    constructor(couponService : CouponService){
        this.service = couponService;
    }

    public async getAllCoupons(req: any, res: any): Promise<void> {
        try {
            const coupons = await this.service.getAllCoupons();
            res.status(200).json(coupons);
        } catch (e) {
            res.status(500).json({ message: (e as Error).message });
        }
    }

    public async renderCouponsTable (_: any, res: any): Promise<void> {
        try {
            const couponsList = await this.service.getAllCoupons();
            const coupons = couponsList.map(coupon => {
                return CouponsListDTO.fromEntity(coupon);
            });
            
            res.render("couponsTable", {
             	title: "Meus Cupons",
             	currentHeaderTab: "profile",
             	layout: "detailsLayout",
             	currentUrl: "coupons",
             	isAdmin: false,
             	coupons
            });
        } catch (e) {
            res.status(500).json({ message: (e as Error).message });
        }
    }


}