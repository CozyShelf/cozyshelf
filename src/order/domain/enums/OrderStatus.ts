enum OrderStatus {
    PROCESSING = 'Em processamento',
    APPROVED = 'Aprovado',
    REJECTED = 'Rejeitado',
    IN_TRANSIT = 'Em trânsito',
    DELIVERED = 'Entregue',
    IN_EXCHANGE = 'Em troca',
    EXCHANGE_AUTHORIZED = 'Troca autorizada',
    EXCHANGED = 'Trocado',
    EXCHANGED_REJECT = 'Troca rejeitada',
}

export default OrderStatus;