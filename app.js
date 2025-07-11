const token = localStorage.getItem('token');
if (!token) window.location.href = '/my-site/login';

const repoName = window.location.hostname.includes('github.io')
    ? '/' + window.location.pathname.split('/')[1]
    : '';

async function carregarUsuarios() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("https://testesitebackend.fly.dev/users", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Não autorizado");
        }

        const users = await response.json();

        const usersContainer = document.querySelector(".users");
        usersContainer.innerHTML = ""; // limpa conteúdo anterior

        users.forEach(user => {
            const div = document.createElement("div");
            div.className = "user";
            div.textContent = `👤 ${user.username} (${user.role})`;
            const manageButton = document.createElement("button");
            manageButton.textContent = "Gerenciar";
            manageButton.style.marginLeft = "10px";
            manageButton.addEventListener("click", () => openUserPopup(user.username));
            div.appendChild(manageButton);
            usersContainer.appendChild(div);
        });
    } catch (error) {
        alert("❌ Você não tem permissão ou ocorreu um erro.");
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
        async function openUserPopup(username) {
        try {
            const res = await fetch(`https://testesitebackend.fly.dev/user?username=${encodeURIComponent(username)}`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!res.ok) throw new Error("Erro ao buscar usuário");

            const user = await res.json();

            const modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.top = "50%";
            modal.style.left = "50%";
            modal.style.transform = "translate(-50%, -50%)";
            modal.style.background = "#fff";
            modal.style.padding = "20px";
            modal.style.border = "2px solid #000";
            modal.style.zIndex = 9999;
            modal.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

            modal.innerHTML = `
                <h2>👤 ${user.username}</h2>
                <p>📛 Nome: ${user.username}</p>
                <p>🔐 Cargo: ${user.role}</p>
                <button id="promote">Promover a Admin</button>
                <button id="demote">Remover Admin</button>
                <button id="delete">Excluir Usuário</button>
                <input id="newName" placeholder="Novo nome">
                <button id="changeName">Mudar nome</button>
                <input id="newPassword" placeholder="Nova senha">
                <button id="changePassword">Mudar senha</button>
                <input id="newPoints" placeholder="Novo número de pontos">
                <button id="changePoints">Mudar pontos</button>
                <button id="close">Fechar</button>
            `;

            document.body.appendChild(modal);

            modal.querySelector("#close").onclick = () => modal.remove();

            modal.querySelector("#promote").onclick = async () => {
                const res = await fetch(`https://testesitebackend.fly.dev/promote?username=${user.username}`, {
                    method: "POST",
                    headers: { "Authorization": "Bearer " + token }
                });
                if (res.ok) {
                    alert("✅ Usuário promovido a Admin");
                    modal.remove();
                    location.reload();
                } else {
                    alert("❌ Erro ao promover");
                }
            };

            modal.querySelector("#demote").onclick = async () => {
                const res = await fetch(`https://testesitebackend.fly.dev/demote?username=${user.username}`, {
                    method: "POST",
                    headers: { "Authorization": "Bearer " + token }
                });
                if (res.ok) {
                    alert("🔄 Usuário rebaixado");
                    modal.remove();
                    location.reload();
                } else {
                    alert("❌ Erro ao rebaixar");
                }
            };

            modal.querySelector("#delete").onclick = async () => {
                if (confirm("Tem certeza que deseja excluir esse usuário?")) {
                    const res = await fetch(`https://testesitebackend.fly.dev/user?username=${user.username}`, {
                        method: "DELETE",
                        headers: { "Authorization": "Bearer " + token }
                    });
                    if (res.ok) {
                        alert("🗑️ Usuário excluído");
                        modal.remove();
                        location.reload();
                    } else {
                        alert("❌ Erro ao excluir");
                    }
                }
            };

            modal.querySelector("#changeName").onclick = async () => {
                const newName = modal.querySelector("#newName").value;
                if (!newName) {
                    alert("❌ Nome vazio");
                    return;
                }
                if (confirm("Tem certeza que deseja mudar o nome desse usuário?")) {
                    const res = await fetch(`https://testesitebackend.fly.dev/change-username?username=${user.username}&newUsername=${newName}`, {
                        method: "POST",
                        headers: { "Authorization": "Bearer " + token }
                    });
                    if (res.ok) {
                        alert("🔄 Nome mudado");
                        modal.remove();
                        location.reload();
                    } else {
                        alert("❌ Erro ao mudar nome");
                    }
                }
            };

            modal.querySelector("#changePassword").onclick = async () => {
                const newPassword = modal.querySelector("#newPassword").value;
                if (!newPassword) {
                    alert("❌ Senha vazia");
                    return;
                }
                if (confirm("Tem certeza que deseja mudar a senha desse usuário?")) {
                    const res = await fetch(`https://testesitebackend.fly.dev/change-password?username=${user.username}&newPassword=${newPassword}`, {
                        method: "POST",
                        headers: { "Authorization": "Bearer " + token }
                    });
                    if (res.ok) {
                        alert("🔄 Senha mudada");
                        modal.remove();
                        location.reload();
                    } else {
                        alert("❌ Erro ao mudar senha");
                    }
                }
            };

            modal.querySelector("#changePoints").onclick = async () => {
                const newPoints = modal.querySelector("#newPoints").value;
                if (!newPoints) {
                    alert("❌ Pontos vazios");
                    return;
                }
                if (confirm("Tem certeza que deseja mudar a pontuação desse usuário?")) {
                    const res = await fetch(`https://testesitebackend.fly.dev/set-points?username=${user.username}&points=${newPoints}`, {
                        method: "POST",
                        headers: { "Authorization": "Bearer " + token }
                    });
                    if (res.ok) {
                        alert("🔄 Pontuação mudada");
                        modal.remove();
                        location.reload();
                    } else {
                        alert("❌ Erro ao mudar pontuação");
                    }
                }
            };

        } catch (err) {
            alert("❌ Falha ao carregar usuário.");
            console.error(err);
        }
    }
}

async function carregarRanking() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    try {
        const response = await fetch("https://testesitebackend.fly.dev/ranking", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) throw new Error("Não autorizado");

        const ranking = await response.json();
        const rankingContainer = document.querySelector(".ranking");
        rankingContainer.innerHTML = ""; // limpa conteúdo anterior
        ranking.forEach(rank => {
            const div = document.createElement("div");
            div.className = "rank";
            div.textContent = `${rank.position} ${rank.username} (${rank.pontuacao})`;
            rankingContainer.appendChild(div);
        });

    } catch (err) {
        alert("❌ Falha ao carregar ranking.");
        console.error(err);
    }
}

async function carregarUsuario() {
    try {
        const resp = await fetch('https://testesitebackend.fly.dev/perfil', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!resp.ok) throw new Error("Não autorizado");

        const user = await resp.json();

        if (user.role === "Admin") {
            const nav = document.querySelector("nav");

            const link = document.createElement("a");
            link.href = "/my-site/users";
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
    "/users": "/pages/users.html",
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

    if (localPath === "/ranking") {
        carregarRanking();
    }

    else if (localPath === "/users") {
        carregarUsuarios();    
    }
};

// Lida com os botões de voltar e avançar do navegador
window.onpopstate = handleLocation;
window.route = route; // Torna a função route acessível globalmente (para o onclick)

// Carrega a rota inicial quando a página é aberta pela primeira vez
handleLocation();