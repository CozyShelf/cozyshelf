import ClientModel from "../../../../../client/model/ClientModel";
import { CouponType } from "../../../../../coupons/domain/enums/CouponType";

const coupons = [
    {
        id: '42caca40-cbb1-4dd0-b3bf-07e7ed651ad1',
        type: CouponType.EXCHANGE,
        description: 'Cupom de troca #1',
        value: 10,
        clientId: 'f4a4ecf2-e31e-41b2-8c9f-a36898e23d81' as unknown as ClientModel,
        createdAt: new Date('2023-01-01')
    },
    {
        id: '58d6f8e1-3c4b-4f5a-9e6b-2e7f8c9d0a1b',
        type: CouponType.EXCHANGE,
        description: 'Cupom de troca #2',
        value: 25,
        clientId: 'f4a4ecf2-e31e-41b2-8c9f-a36898e23d81' as unknown as ClientModel,
        createdAt: new Date('2023-06-01')
    },
    {
        id: '67e8f9a2-5d4c-4e6b-8f7a-3b8c9d0e1f2a',
        type: CouponType.EXCHANGE,
        description: 'Cupom de troca #3',
        value: 30,
        clientId: 'f4a4ecf2-e31e-41b2-8c9f-a36898e23d81' as unknown as ClientModel,
        createdAt: new Date('2024-01-01')
    },
    {
        id: '78f9a1b2-6e5d-4f7a-9b8c-4c9d0e1f2a3b',
        type: CouponType.EXCHANGE,
        description: 'Cupom de troca #4',
        value: 15,
        clientId: 'f4a4ecf2-e31e-41b2-8c9f-a36898e23d81' as unknown as ClientModel,
        createdAt: new Date('2024-05-01')
    },
    {
        id: '709bf8da-4ca5-464a-8fc9-5dfbbe0ea412',
        type: CouponType.PROMOTIONAL,
        description: 'Desconto Primavera 10%',
        value: 10,
        clientId: 'f4a4ecf2-e31e-41b2-8c9f-a36898e23d81' as unknown as ClientModel,
        createdAt: new Date('2023-02-01'),
        expirationDate: new Date('2023-11-30')
    },
    {
        id: 'd1f7c8e3-3c4b-4f5a-9e6b-2e7f8c9d0a1b',
        type: CouponType.PROMOTIONAL,
        description: 'Desconto Verão 20%',
        value: 20,
        clientId: 'f4a4ecf2-e31e-41b2-8c9f-a36898e23d81' as unknown as ClientModel,
        createdAt: new Date('2023-03-01'),
        expirationDate: new Date('2023-12-31')
    },
    {
        id: 'a9ad6f2d-7f5b-4684-9c98-b9bc0e1397da',
        type: CouponType.PROMOTIONAL,
        description: 'Desconto Outono 30%',
        value: 30,
        clientId: 'f4a4ecf2-e31e-41b2-8c9f-a36898e23d81' as unknown as ClientModel,
        createdAt: new Date('2023-04-01'),
        expirationDate: new Date('2023-12-31')
    }
];

export default coupons;