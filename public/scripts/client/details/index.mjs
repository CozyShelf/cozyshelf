import { setupClientDetailsForm } from './formDetailsClient.mjs';
import { setupInputMasks } from '../create/inputMasks.mjs';

document.addEventListener('DOMContentLoaded', () => {
    setupClientDetailsForm();
    setupInputMasks();
});