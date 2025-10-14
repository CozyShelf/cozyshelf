import IFactory from "../../generic/factories/Factory";
import CouponController from "../controller/CouponController";
import { CouponDAO } from "../dao/typeORM/CouponDAO";
import { CouponService } from "../service/CouponsService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";

export class CouponControllerFactory implements IFactory<CouponController> {
    
    public make(): CouponController {
        return new CouponController(this.makeCouponService());
    }

    private makeCouponService(): CouponService {
        return new CouponService(this.makeCouponRepository());
    }

    private makeCouponRepository(): CouponDAO {
        return new CouponDAO(postgresDataSource);
    }
}