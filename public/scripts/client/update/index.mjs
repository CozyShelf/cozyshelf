import { setupInputMasks } from '../validations/inputMasks.mjs';
import { handleClientUpdate } from './updateClient.mjs';

document.addEventListener('DOMContentLoaded', () => {
    handleClientUpdate();
    setupInputMasks();
});