import { carregarRanking } from "./pages/ranking.js";
import { carregarUsuarios } from "./pages/users.js";
import { carregarTorneios } from "./pages/torneios.js";
import { carregarGerenciarTorneios } from "./pages/gerTorneios.js";

// Impede o comportamento padrão de recarregar a página ao clicar nos links
export const route = (event) => {
    event = event || window.event;
    event.preventDefault(); // Impede o recarregamento da página
    
    // Pega o caminho local do link (ex: "/ranking")
    const path = event.target.getAttribute('href');
    
    // Constrói a URL completa para o histórico do navegador (ex: "/my-site/ranking")
    const url = `${repoName}${path}`;
    
    window.history.pushState({}, "", url);
    handleLocation();
};

// Mapeia nossas rotas aos arquivos HTML correspondentes
const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/ranking": "/pages/ranking.html",
    "/torneios": "/pages/torneios.html",
    "/users": "/pages/users.html",
    "/gerTorneios": "/pages/gerTorneios.html"
};

// Função principal que lida com a mudança de rota
export const handleLocation = async () => {
    // Pega o caminho completo da URL (ex: "/my-site/ranking")
    const path = window.location.pathname;
    
    // Converte o caminho completo para o caminho local, removendo o nome do repo
    // Se o resultado for uma string vazia (home), usa "/"
    const localPath = path.replace(repoName, "") || "/";

    // Encontra o arquivo HTML correspondente ao caminho LOCAL
    const routeFile = routes[localPath] || routes[404];
    
    // Busca o arquivo HTML usando o caminho completo (com o nome do repo)
    const html = await fetch(`${repoName}${routeFile}`).then((data) => data.text());
    
    document.getElementById("app").innerHTML = html;

    if (localPath === "/ranking") {
        carregarRanking();
    }

    else if (localPath === "/users") {
        carregarUsuarios();    
    }
    else if (localPath === "/torneios") {
        carregarTorneios();
    }
    else if (localPath === "/gerTorneios") {
        carregarGerenciarTorneios();
    }
};