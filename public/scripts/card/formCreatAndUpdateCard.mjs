export function setupCardForm() {
    const form = document.getElementById("card-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!validateForm(form)) {
            return;
        }

        try {
            const submitButton = form.querySelector('button[type="submit"]');
            const isUpdate = submitButton.id === 'updateCard';

            if (isUpdate) {
                const cardId = getCardId();
                const requestBody = buildRequestBody(form, true);
                await submitCardUpdate(cardId, requestBody);
            } else {
                const requestBody = buildRequestBody(form, false);
                await submitCardCreation(requestBody);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao processar os dados do cartão.'
            });
        }
    });
}

function buildRequestBody(form, isUpdate) {
    const formData = new FormData(form);

    // Monta o objeto conforme IUpdateCardData
    const cardData = {
        clientId: "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81", // ID fixo conforme solicitado
        number: formData.get("card-number"),
        nameOnCard: formData.get("card-impress-name"),
        cvv: formData.get("card-cvv"),
        isPreferred: form.querySelector("input[name='card-is-preferred']:checked") !== null ? true : false,
        cardFlag: {
            description: formData.get("card-flag")
        }
    };

    // Para update, pode remover campos vazios
    if (isUpdate) {
        Object.keys(cardData).forEach(key => {
            if (
                cardData[key] === undefined ||
                cardData[key] === null ||
                cardData[key] === "" ||
                (typeof cardData[key] === "object" && Object.keys(cardData[key]).length === 0)
            ) {
                delete cardData[key];
            }
        });
    }

    return cardData;
}



async function submitCardCreation(requestBody) {
    try {
        Swal.fire({
            title: 'Processando...',
            text: 'Cadastrando cartão, aguarde...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const response = await fetch('/api/cards/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Cartão cadastrado com sucesso!',
                confirmButtonText: 'OK'
            }).then(() => window.location.href = '/cards/client/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81');
        } else {
            throw new Error(result.message || 'Erro no servidor');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message || 'Ocorreu um erro inesperado.'
        });
    }
}

async function submitCardUpdate(cardId, requestBody) {
    try {
        Swal.fire({
            title: 'Processando...',
            text: 'Atualizando cartão, aguarde...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const response = await fetch(`/api/cards/${cardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Cartão atualizado com sucesso!',
                confirmButtonText: 'OK'
            }).then(() => window.location.href = '/cards/client/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81');
        } else {
            throw new Error(result.message || 'Erro no servidor');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message || 'Ocorreu um erro inesperado.'
        });
    }
}

function getCardId() {
    // Tenta pegar da URL: /cards/:id
    const pathParts = window.location.pathname.split('/');
    const cardsIndex = pathParts.indexOf('cards');
    if (cardsIndex !== -1 && pathParts[cardsIndex + 1]) {
        return pathParts[cardsIndex + 1];
    }
    throw new Error('ID do cartão não encontrado');
}

function validateForm(form) {
    // Validações simples, pode expandir conforme necessário
    const number = form.querySelector("input[name='card-number']").value;
    const cvv = form.querySelector("input[name='card-cvv']").value;
    const name = form.querySelector("input[name='card-impress-name']").value;
    const flag = form.querySelector("select[name='card-flag']").value;

    if (!number || number.length !== 19) {
        Swal.fire({ icon: 'warning', title: 'Número inválido', text: 'Preencha o número do cartão corretamente.' });
        return false;
    }
    if (!cvv || cvv.length !== 3) {
        Swal.fire({ icon: 'warning', title: 'CVV inválido', text: 'Preencha o CVV corretamente.' });
        return false;
    }
   
    if (!name) {
        Swal.fire({ icon: 'warning', title: 'Nome obrigatório', text: 'Preencha o nome impresso no cartão.' });
        return false;
    }
    if (!flag) {
        Swal.fire({ icon: 'warning', title: 'Bandeira obrigatória', text: 'Selecione a bandeira do cartão.' });
        return false;
    }
    return true;
}