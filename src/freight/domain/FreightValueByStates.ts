export const FREIGHT_VALUES_BY_STATE: Record<string, number> = {
    // Região Norte
    "AC": 25.00, "AP": 30.00, "AM": 28.00, "PA": 22.00, 
    "RO": 24.00, "RR": 35.00, "TO": 20.00,

    // Região Nordeste
    "AL": 18.00, "BA": 16.00, "CE": 17.00, "MA": 19.00,
    "PB": 18.00, "PE": 17.00, "PI": 19.00, "RN": 18.00, "SE": 18.00,

    // Região Centro-Oeste
    "DF": 12.00, "GO": 14.00, "MT": 20.00, "MS": 18.00,

    // Região Sudeste
    "ES": 10.00, "MG": 12.00, "RJ": 8.00, "SP": 6.00,

    // Região Sul
    "PR": 10.00, "RS": 14.00, "SC": 12.00,
};

export const DEFAULT_FREIGHT_VALUE = 15.00;