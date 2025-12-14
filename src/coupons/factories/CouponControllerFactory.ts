import IFactory from "../../generic/factories/Factory";
import CouponController from "../controller/CouponController";
import { CouponDAO } from "../dao/typeORM/CouponDAO";
import { CouponService } from "../service/CouponsService";
import postgresDataSource from "../../generic/config/database/datasources/postgresDataSource";
import { DataSource } from "typeorm";

export class CouponControllerFactory implements IFactory<CouponController> {
    private couponDAO = this.makeCouponDAO(postgresDataSource);
    private couponService = this.makeCouponService(this.couponDAO);

    public make(): CouponController {
        return new CouponController(this.couponService);
    }

    public makeCouponService(couponDAO: CouponDAO): CouponService {
        return new CouponService(couponDAO);
    }

    public makeCouponDAO(postgresDataSource: DataSource): CouponDAO {
        return new CouponDAO(postgresDataSource);
    }
}