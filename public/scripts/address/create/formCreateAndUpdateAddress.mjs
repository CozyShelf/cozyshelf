export function setupAddressForm() {
    const form = document.getElementById("address-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!validateForm(form)) {
            return;
        }

        try {
            const submitButton = form.querySelector('button[type="submit"]');
            const isUpdate = submitButton.id === 'updateAddress';

            if (isUpdate) {
                const requestBody = buildUpdateRequestBody(form);
                console.log("Update Request Body:", requestBody);

                const addressId = getAddressId();
                await submitAddressUpdate(addressId, requestBody);
            } else {
                const requestBody = buildRequestBody(form);
                console.log("Create Request Body:", requestBody);
                await submitAddressCreation(requestBody);
            }
        } catch (error) {
            console.error("Erro ao processar formulário:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao processar os dados do formulário.'
            });
        }
    });
}

function buildRequestBody(form) {
    const formData = new FormData(form);

    // Dados do endereço para criação
    const addressData = {
        clientId: "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81", // ID fixo conforme solicitado
        zipCode: formData.get("address-zip-code"),
        number: formData.get("address-number"),
        residenceType: formData.get("address-residence-type"),
        streetName: formData.get("address-street-name"),
        streetType: formData.get("address-street-type"),
        neighborhood: formData.get("address-neighborhood"),
        shortPhrase: formData.get("address-short-phrase"),
        observation: formData.get("address-observation") || "", // Opcional
        city: formData.get("address-city"),
        state: formData.get("address-state"),
        country: {
            name: "Brasil",
            acronym: "BR"
        },
        type: formData.get("address-type")
    };

    return addressData;
}

function buildUpdateRequestBody(form) {
    const formData = new FormData(form);

    // Dados do endereço para atualização (conforme IUpdateAddressData)
    const updateData = {};

    // Apenas adicionar campos que não estão vazios (campos opcionais para update)
    const zipCode = formData.get("address-zip-code");
    if (zipCode) updateData.zipCode = zipCode;

    const number = formData.get("address-number");
    if (number) updateData.number = number;

    const residenceType = formData.get("address-residence-type");
    if (residenceType) updateData.residenceType = residenceType;

    const streetName = formData.get("address-street-name");
    if (streetName) updateData.streetName = streetName;

    const streetType = formData.get("address-street-type");
    if (streetType) updateData.streetType = streetType;

    const neighborhood = formData.get("address-neighborhood");
    if (neighborhood) updateData.neighborhood = neighborhood;

    const shortPhrase = formData.get("address-short-phrase");
    if (shortPhrase) updateData.shortPhrase = shortPhrase;

    const observation = formData.get("address-observation");
    if (observation) updateData.observation = observation;

    const city = formData.get("address-city");
    if (city) updateData.city = city;

    const state = formData.get("address-state");
    if (state) updateData.state = state;

    const type = formData.get("address-type");
    if (type) updateData.type = type;

    // País sempre Brasil para updates
    updateData.country = {
        name: "Brasil",
        acronym: "BR"
    };

    return updateData;
}

function getAddressId() {
	const addressId = document.getElementById("addressId");
	if (!addressId) { throw new Error('ID do endereço não encontrado') }
	return addressId.value;
}

async function submitAddressCreation(requestBody) {
    try {
        Swal.fire({
            title: 'Processando...',
            text: 'Cadastrando endereço, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch('/api/addresses/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Endereço cadastrado com sucesso!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirecionar para a lista de endereços do cliente
                    window.location.href = '/addresses/client/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81';
                }
            });
        } else {
            throw new Error(result.message || 'Erro no servidor');
        }

    } catch (error) {
        console.error('Erro na requisição:', error);

        let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';

        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        Swal.fire({
            icon: 'error',
            title: 'Erro no Cadastro',
            text: errorMessage,
            confirmButtonText: 'Tentar Novamente'
        });
    }
}

async function submitAddressUpdate(addressId, requestBody) {
    try {
        Swal.fire({
            title: 'Processando...',
            text: 'Atualizando endereço, aguarde...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`/api/addresses/${addressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Endereço atualizado com sucesso!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirecionar para a lista de endereços do cliente
                    window.location.href = '/addresses/client/f4a4ecf2-e31e-41b2-8c9f-a36898e23d81';
                }
            });
        } else {
            throw new Error(result.message || 'Erro no servidor');
        }

    } catch (error) {
        console.error('Erro na requisição:', error);

        let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';

        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        Swal.fire({
            icon: 'error',
            title: 'Erro na Atualização',
            text: errorMessage,
            confirmButtonText: 'Tentar Novamente'
        });
    }
}

function validateForm(form) {
   const zipCode = form.querySelector("input[name='address-zip-code']").value;

    // Validar CEP (formato XXXXX-XXX) - apenas se preenchido
    if (zipCode) {
        const zipCodeRegex = /^\d{5}-\d{3}$/;
        if (!zipCodeRegex.test(zipCode)) {
            Swal.fire({
                icon: 'warning',
                title: 'CEP inválido',
                text: 'Por favor, insira um CEP válido no formato XXXXX-XXX.'
            });
            return false;
        }
    }

    return true;
}
