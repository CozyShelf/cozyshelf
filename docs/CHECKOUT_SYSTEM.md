# 📋 Documentação do Sistema de Checkout - CozyShelf

## 🎯 Visão Geral

O sistema de checkout foi implementado seguindo o padrão arquitetural já estabelecido no projeto para cadastro de usuários. Ele coleta todas as seleções do usuário no carrinho de compras e envia os dados estruturados para o backend.

## 📁 Estrutura de Arquivos

### 📂 `/public/scripts/shoppingCart/`

```
shoppingCart/
├── checkout.mjs                           # Arquivo principal de inicialização
├── create/
│   ├── processCheckout.mjs                # Gerencia o processo de envio
│   └── checkoutReqBody.mjs                # Constrói o corpo da requisição
├── validations/
│   └── checkoutValidations.mjs            # Validações do formulário
├── components/
│   ├── cartManagement.mjs                 # Gerenciamento do carrinho (existente)
│   ├── couponManagement.js                # Gerenciamento de cupons (existente)
│   ├── couponValidation.js                # Validação de cupons (existente)
│   └── multipleCardPayment.js             # Pagamento múltiplos cartões (existente)
├── modals/
│   ├── addressModal.js                    # Modal de endereços (existente)
│   └── cardModal.js                       # Modal de cartões (existente)
└── utils/
    └── cartUtils.mjs                      # Utilitários do carrinho (existente)
```

## 🔧 Como Funciona

### 1. **Inicialização (`checkout.mjs`)**
- Ponto de entrada do sistema
- Inicializa automaticamente quando o script é carregado
- Configura todos os listeners necessários

### 2. **Processamento (`processCheckout.mjs`)**
- Configura o listener do formulário principal
- Executa validações antes do envio
- Utiliza a função genérica `submitCreationForm` (mesmo padrão do cadastro de usuário)
- **Rota configurável**: `CHECKOUT_API_PATH = '/api/checkout/process'`

### 3. **Construção dos Dados (`checkoutReqBody.mjs`)**
- Coleta todos os dados do formulário
- Estrutura os dados conforme esperado pelo backend
- Seguindo o mesmo padrão de `createClientReqBody.mjs`

### 4. **Validações (`checkoutValidations.mjs`)**
- Valida itens do carrinho
- Verifica endereço selecionado
- Valida métodos de pagamento
- Seguindo o mesmo padrão de `createFormValidations.mjs`

## 📊 Estrutura de Dados Enviados

### Estrutura Completa do Payload:

```json
{
  "cart": {
    "items": [
      {
        "bookId": "string",
        "quantity": "number",
        "unitPrice": "number", 
        "subtotal": "number"
      }
    ],
    "totals": {
      "itemsSubtotal": "number",
      "freight": "number",
      "discount": "number",
      "finalTotal": "number"
    }
  },
  "delivery": {
    "addressId": "string"
  },
  "coupons": {
    "promotional": {
      "code": "string",
      "discount": "number"
    } | null,
    "exchange": [
      {
        "code": "string",
        "value": "number"
      }
    ]
  },
  "payment": {
    "cards": [
      {
        "cardId": "string",
        "amount": "number"
      }
    ],
    "totalAmount": "number"
  },
  "metadata": {
    "timestamp": "ISO string",
    "sessionId": "string"
  }
}
```

### Exemplo Prático:

```json
{
  "cart": {
    "items": [
      {
        "bookId": "book-123",
        "quantity": 2,
        "unitPrice": 45.90,
        "subtotal": 91.80
      },
      {
        "bookId": "book-456", 
        "quantity": 1,
        "unitPrice": 32.50,
        "subtotal": 32.50
      }
    ],
    "totals": {
      "itemsSubtotal": 124.30,
      "freight": 10.00,
      "discount": 15.00,
      "finalTotal": 119.30
    }
  },
  "delivery": {
    "addressId": "addr-789"
  },
  "coupons": {
    "promotional": {
      "code": "PROMO15",
      "discount": 15
    },
    "exchange": [
      {
        "code": "TROCA123",
        "value": 10.00
      }
    ]
  },
  "payment": {
    "cards": [
      {
        "cardId": "card-101",
        "amount": 119.30
      }
    ],
    "totalAmount": 119.30
  },
  "metadata": {
    "timestamp": "2025-10-05T14:30:00.000Z",
    "sessionId": "checkout_1728141000000_abc123def"
  }
}
```

## 🔄 Integração com Backend

### Rota Esperada:
- **Endpoint**: `POST /api/checkout/process`
- **Content-Type**: `application/json`

### Resposta Esperada do Backend:

```json
{
  "success": true,
  "message": "Pedido processado com sucesso!",
  "orderId": "ORDER_1728141000000",
  "redirectUrl": "/order/success"
}
```

### Resposta de Erro:

```json
{
  "error": true,
  "message": "Descrição do erro",
  "timestamp": "2025-10-05T14:30:00.000Z"
}
```

## ⚙️ Configurações

### Alterar Rota do Backend:

```javascript
// Em processCheckout.mjs
import { setCheckoutApiPath } from './processCheckout.mjs';
setCheckoutApiPath('/api/orders/create'); // Nova rota
```

### Alterar Redirecionamento de Sucesso:

```javascript
// Em processCheckout.mjs
import { setSuccessRedirectPath } from './processCheckout.mjs';
setSuccessRedirectPath('/pedido/confirmacao'); // Nova página
```

## 🧪 Validações Implementadas

### 1. **Itens do Carrinho**
- ✅ Verifica se o carrinho não está vazio
- ✅ Valida se pelo menos um item tem quantidade > 0
- ✅ Coleta preços unitários e subtotais

### 2. **Endereço de Entrega**
- ✅ Verifica se um endereço foi selecionado
- ✅ Valida se o valor não está vazio

### 3. **Métodos de Pagamento**
- ✅ Dispensa validação se cupons cobrirem 100% do valor
- ✅ Exige pelo menos um cartão se houver valor a pagar
- ✅ Valida se valores dos cartões são > 0
- ✅ Verifica se soma dos cartões = total da compra (com tolerância de R$ 0,01)

### 4. **Cupons**
- ✅ Coleta cupom promocional (se selecionado)
- ✅ Coleta cupons de troca marcados
- ✅ Extrai valores e descontos automaticamente

## 🔧 Dependências

### Scripts Necessários (já incluídos):
- `submitCreationForm` (genérico para envio)
- `SweetAlert2` (para modais de feedback)
- Scripts de gerenciamento de cupons e pagamento existentes

### Elementos DOM Necessários:
- Formulário principal com `<form>`
- Elementos com `[data-item-id]` para itens do carrinho
- `select[name="userAddress"]` para endereço
- `select[name="promotionalCoupon"]` para cupom promocional
- `input[name="exchangeCoupons"]` para cupons de troca
- `#selected-cards` container para cartões selecionados
- Elementos de total com IDs específicos (`#total-display`, `#items-subtotal`)

## 🚀 Como Usar

### Inclusão Automática:
O sistema é inicializado automaticamente quando o script é carregado no HTML:

```html
<script type="module" src="/scripts/shoppingCart/checkout.mjs"></script>
```

### Uso Manual (se necessário):
```javascript
import { initializeCheckout } from '/scripts/shoppingCart/checkout.mjs';
initializeCheckout();
```

## 🔍 Debug e Logs

O sistema inclui logs para facilitar o debug:
- ✅ Log de inicialização
- ✅ Log dos dados coletados antes do envio
- ✅ Logs de erro nas validações

Para visualizar no console do navegador:
```javascript
console.log('Dados do checkout preparados:', requestBody);
```

## 🔒 Segurança

### Validações Client-Side:
- ⚠️ **Importante**: Todas as validações devem ser replicadas no backend
- ✅ Validação de tipos de dados
- ✅ Verificação de valores monetários
- ✅ Sanitização básica de inputs

### Dados Sensíveis:
- ✅ IDs de cartão são enviados (não dados completos)
- ✅ Apenas referências a entidades existentes
- ✅ Timestamp para auditoria
- ✅ SessionId único para rastreamento

---

*Documentação criada em 05/10/2025 para o sistema CozyShelf*