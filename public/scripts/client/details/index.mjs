import { setupClientDetailsForm } from './formUpdateDetailsClient.mjs';
import { setupInputMasks } from '../create/inputMasks.mjs';

document.addEventListener('DOMContentLoaded', () => {
    setupClientDetailsForm();
    setupInputMasks();
});