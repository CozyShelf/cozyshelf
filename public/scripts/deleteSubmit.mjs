document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            Swal.fire({
                title: 'Você tem certeza?',
                text: 'Esta ação irá excluir o item permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#9F9F9F',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Sim, excluir!'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (btn.closest('form')) {
                        btn.closest('form').submit();
                    }
                }
            });
        });
    });
});

const buttons = document.querySelectorAll("#confirmExchange");
buttons.forEach((button) => {
	button.addEventListener("click", (e) => {
		Swal.fire({
			title: "Retorno para estoque",
			text: "Os items dessa troca deverão retornar ao estoque ?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#9F9F9F",
			cancelButtonText: "Não",
			confirmButtonText: "Sim",
		});
	})
})
