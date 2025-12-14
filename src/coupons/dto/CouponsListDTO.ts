
export default class CouponsListDTO {
    public readonly id: string;
    public readonly value: string;
    public readonly type: string;
    public readonly expirationDate: string;

    public constructor(
        id: string,
        value: string,
        type: string,
        expirationDate: string
    ) {
        this.id = id.substring(0, 8);
        this.type = type;
        this.value = value;
        this.expirationDate = expirationDate;
    }

    public static fromEntity(coupon: any): CouponsListDTO {
        const formattedValue = this.prototype.formatValue(coupon.value, coupon.type);

        const dto = new CouponsListDTO(
            coupon.id,
            formattedValue,
            coupon.type,
            coupon.expirationDate ? coupon.expirationDate.toLocaleDateString('pt-BR') : 'Sem data de expiração'
        );
        return dto;
    }

    private formatValue(value: number, type: string): string {
        if (type === 'Troca') {
            return `R$ ${value}`;
        }
        
        if (type === 'Promocional') {
            return `${Number(value).toFixed(0)}%`;
        }

        return value.toString();
    }
}