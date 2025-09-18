export function setupClientFilters() {
    const form = document.getElementById('filterForm');
    
    if (form) {
        const inputs = form.querySelectorAll('input[type="text"]');
        
        inputs.forEach(input => {
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    form.submit();
                }, 800); // 800ms de delay
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', setupClientFilters);