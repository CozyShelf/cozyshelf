export function buildUpdateCardReqBody(form) {
    const formData = new FormData(form);
    const requestBody = {};
    
    const number = formData.get("card-number");
    if (number) requestBody.number = number;
    
    const nameOnCard = formData.get("card-impress-name");
    if (nameOnCard) requestBody.nameOnCard = nameOnCard;
    
    const cvv = formData.get("card-cvv");
    if (cvv) requestBody.cvv = cvv;
    
    const isPreferred = form.querySelector("input[name='card-is-preferred']:checked") !== null;
    requestBody.isPreferred = isPreferred;
    
    const cardFlagDescription = formData.get("card-flag");
    if (cardFlagDescription) {
        requestBody.cardFlag = { description: cardFlagDescription };
    }
    
    // clientId fixo
    requestBody.clientId = "f4a4ecf2-e31e-41b2-8c9f-a36898e23d81";
    
    return requestBody;
}