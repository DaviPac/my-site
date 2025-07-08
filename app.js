const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

fetch('https://testesitebackend.fly.dev/perfil', {
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(resp => {
    if (!resp.ok) throw new Error("Não autorizado");
    return resp.json();
})
.catch(() => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Impede o comportamento padrão de recarregar a página ao clicar nos links
const route = (event) => {
    event = event || window.event;
    event.preventDefault(); // Impede o recarregamento da página
    // Adiciona a URL ao histórico do navegador
    window.history.pushState({}, "", event.target.href);
    handleLocation(); // Carrega o conteúdo da nova rota
};

// Mapeia nossas rotas aos arquivos HTML correspondentes
const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/ranking": "/pages/ranking.html",
    "/torneios": "/pages/torneios.html",
};

// Função principal que lida com a mudança de rota
const handleLocation = async () => {
    const path = window.location.pathname; // Pega o caminho da URL atual (ex: "/ranking")
    const route = routes[path] || routes[404]; // Encontra o arquivo HTML ou usa o 404
    
    // Busca o conteúdo do arquivo HTML
    const html = await fetch(route).then((data) => data.text());
    
    // Injeta o HTML no nosso contêiner principal
    document.getElementById("app").innerHTML = html;
};

// Lida com os botões de voltar e avançar do navegador
window.onpopstate = handleLocation;
window.route = route; // Torna a função route acessível globalmente (para o onclick)

// Carrega a rota inicial quando a página é aberta pela primeira vez
handleLocation();