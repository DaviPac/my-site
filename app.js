const token = localStorage.getItem('token');
if (!token) window.location.href = '/my-site/login';

const repoName = window.location.hostname.includes('github.io')
    ? '/' + window.location.pathname.split('/')[1]
    : '';

async function carregarUsuario() {
    try {
        const resp = await fetch('https://testesitebackend.fly.dev/perfil', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!resp.ok) throw new Error("Não autorizado");

        const user = await resp.json();
        console.log(user);

        if (user.Role === "Admin") {
            const nav = document.querySelector("nav");

            const link = document.createElement("a");
            link.href = "/users";
            link.textContent = "Usuários";
            link.setAttribute("onclick", "route(event)");

            nav.appendChild(link);
            return user;
        }
    } catch {
        localStorage.removeItem('token');
        window.location.href = `${repoName}/login`;
        return null;
    }
}

carregarUsuario();

// Impede o comportamento padrão de recarregar a página ao clicar nos links
const route = (event) => {
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
};

// Função principal que lida com a mudança de rota
const handleLocation = async () => {
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
};

// Lida com os botões de voltar e avançar do navegador
window.onpopstate = handleLocation;
window.route = route; // Torna a função route acessível globalmente (para o onclick)

// Carrega a rota inicial quando a página é aberta pela primeira vez
handleLocation();