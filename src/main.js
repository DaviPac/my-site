import { carregarUsuario } from "./auth.js";
import { handleLocation, route } from "./router.js";

const token = localStorage.getItem('token');
if (!token) {
    alert("SEM TOKEN!");
    window.location.href = '/my-site/login';
}

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const header = document.querySelector('header');

    if (menuToggle && header) {
        menuToggle.addEventListener('click', () => {
            header.classList.toggle('nav-open');
        });
    }
});

carregarUsuario();

// Lida com os botões de voltar e avançar do navegador
window.onpopstate = handleLocation;
window.route = route; // Torna a função route acessível globalmente (para o onclick)

// Carrega a rota inicial quando a página é aberta pela primeira vez
handleLocation();