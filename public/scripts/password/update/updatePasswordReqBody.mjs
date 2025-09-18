export function buildUpdatePasswordReqBody(form) {
    const formData = new FormData(form);
    
    // Dados para atualização de senha conforme IUpdatePasswordData
    const passwordData = {
        currentPassword: formData.get("current-password"),
        newPassword: formData.get("new-password"),
        newPasswordConfirmation: formData.get("confirm-new-password")
    };

    return passwordData;
}