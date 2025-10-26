import Freight from "../domain/Freight";
import { FREIGHT_CONFIG } from "../domain/FreightConfiguration";
import { DEFAULT_FREIGHT_VALUE, FREIGHT_VALUES_BY_STATE } from "../domain/FreightValueByStates";

export class FreightService {
    /**
     * Calcula o frete baseado no estado e quantidade de itens
     */
    public calculateFreight(stateCode: string, itemCount: number): Freight {
        const baseFreightValue = this.getBaseFreightValueByState(stateCode);
        const totalFreightValue = this.calculateProgressiveFreight(baseFreightValue, itemCount);
        
        return new Freight(totalFreightValue);
    }

    /**
     * Calcula frete progressivo baseado na quantidade de itens
     */
    private calculateProgressiveFreight(baseValue: number, itemCount: number): number {
        if (itemCount <= FREIGHT_CONFIG.MAX_ITEMS_BASE_FREIGHT) {
            return baseValue;
        }

        const additionalItems = itemCount - FREIGHT_CONFIG.MAX_ITEMS_BASE_FREIGHT;
        
        // Calcular valor adicional por item extra
        let additionalValuePerItem = baseValue * FREIGHT_CONFIG.ADDITIONAL_ITEM_MULTIPLIER;
        
        // Aplicar limites mínimo e máximo
        additionalValuePerItem = Math.max(
            FREIGHT_CONFIG.MIN_ADDITIONAL_VALUE,
            Math.min(additionalValuePerItem, FREIGHT_CONFIG.MAX_ADDITIONAL_VALUE)
        );

        const totalAdditionalValue = additionalItems * additionalValuePerItem;
        return baseValue + totalAdditionalValue;
    }

    /**
     * Obtém o valor base do frete por estado
     */
    private getBaseFreightValueByState(stateCode: string): number {
        const normalizedState = stateCode.toUpperCase().trim();
        return FREIGHT_VALUES_BY_STATE[normalizedState] || DEFAULT_FREIGHT_VALUE;
    }

    /**
     * Calcula apenas o valor do frete sem criar instância do domínio
     */
    public calculateFreightValue(stateCode: string, itemCount: number): number {
        const baseFreightValue = this.getBaseFreightValueByState(stateCode);
        return this.calculateProgressiveFreight(baseFreightValue, itemCount);
    }

    /**
     * Obtém detalhes do cálculo de frete
     */
    public getFreightCalculationDetails(stateCode: string, itemCount: number): {
        baseValue: number;
        additionalItems: number;
        additionalValuePerItem: number;
        totalAdditionalValue: number;
        totalFreightValue: number;
    } {
        const baseValue = this.getBaseFreightValueByState(stateCode);
        
        if (itemCount <= FREIGHT_CONFIG.MAX_ITEMS_BASE_FREIGHT) {
            return {
                baseValue,
                additionalItems: 0,
                additionalValuePerItem: 0,
                totalAdditionalValue: 0,
                totalFreightValue: baseValue
            };
        }

        const additionalItems = itemCount - FREIGHT_CONFIG.MAX_ITEMS_BASE_FREIGHT;
        let additionalValuePerItem = baseValue * FREIGHT_CONFIG.ADDITIONAL_ITEM_MULTIPLIER;
        
        additionalValuePerItem = Math.max(
            FREIGHT_CONFIG.MIN_ADDITIONAL_VALUE,
            Math.min(additionalValuePerItem, FREIGHT_CONFIG.MAX_ADDITIONAL_VALUE)
        );

        const totalAdditionalValue = additionalItems * additionalValuePerItem;
        const totalFreightValue = baseValue + totalAdditionalValue;

        return {
            baseValue,
            additionalItems,
            additionalValuePerItem,
            totalAdditionalValue,
            totalFreightValue
        };
    }

    /**
     * Obtém todos os valores de frete por estado (valor base)
     */
    public getAllFreightValues(): Record<string, number> {
        return FREIGHT_VALUES_BY_STATE;
    }

    /**
     * Verifica se um estado tem frete configurado
     */
    public hasFreightForState(stateCode: string): boolean {
        const normalizedState = stateCode.toUpperCase().trim();
        return normalizedState in FREIGHT_VALUES_BY_STATE;
    }
}