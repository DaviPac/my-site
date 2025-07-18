const token = localStorage.getItem('token');
if (!token) window.location.href = '/my-site/login';

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload); // decodifica de base64
    return JSON.parse(payload); // converte string JSON para objeto
  } catch (e) {
    console.error("Token inválido", e);
    return null;
  }
}

const nomeDeUsuario = parseJwt(token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

const repoName = window.location.hostname.includes('github.io')
    ? '/' + window.location.pathname.split('/')[1]
    : '';

// cache.js
const CACHE = new Map();

/**
 * Obtém um valor de cache ou executa o fetchFn e guarda o resultado.
 * @param {string} key – Identificador único do recurso.
 * @param {number} ttl  – Tempo‑de‑vida em milissegundos.
 * @param {() => Promise<any>} fetchFn – Função que devolve a Promise original.
 */

async function swr(key, fetchFn, onUpdate) { // stale while revalidate
  const cache = sessionStorage.getItem(key);
  let parsed = null;
  if (cache) {
    try {
      parsed = JSON.parse(cache);
      onUpdate(parsed.data); // 1. mostra dado antigo imediatamente
    } catch (e) {
      parsed = null;
    }
  }

  // 2. revalida em segundo plano
  try {
    const fresh = await fetchFn();
    sessionStorage.setItem(key, JSON.stringify({ data: fresh, timestamp: Date.now() }));
    onUpdate(fresh); // 3. atualiza com dado novo
  } catch (e) {
    console.warn("SWR fallback: usando dados antigos", e);
  }
}

async function carregarUsuarios() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    swr(
        "usuarios",
        async () => {
            const response = await fetch("https://testesitebackend.fly.dev/users", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar usuários");
            }
            return await response.json();
        },
        (users) => {
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
        }
    );

    async function openUserPopup(username) {

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
            const res = await fetch(`https://testesitebackend.fly.dev/promote?username=${encodeURIComponent(user.username)}`, {
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
            const res = await fetch(`https://testesitebackend.fly.dev/demote?username=${encodeURIComponent(user.username)}`, {
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
                const res = await fetch(`https://testesitebackend.fly.dev/user?username=${encodeURIComponent(user.username)}`, {

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
                const res = await fetch(`https://testesitebackend.fly.dev/change-username?username=${encodeURIComponent(user.username)}&newUsername=${encodeURIComponent(newName)}`, {
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
                const res = await fetch(`https://testesitebackend.fly.dev/change-password?username=${encodeURIComponent(user.username)}&newPassword=${encodeURIComponent(newPassword)}`, {
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
                const res = await fetch(`https://testesitebackend.fly.dev/set-points?username=${encodeURIComponent(user.username)}&points=${newPoints}`, {

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
    }
}

async function carregarRanking() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    swr(
        "ranking",
        async () => {
            const response = await fetch("https://testesitebackend.fly.dev/ranking", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (!response.ok) throw new Error("Não autorizado");
            return response.json();
        },
        (ranking) => {
            const rankingContainer = document.querySelector(".ranking");
            rankingContainer.innerHTML = ""; // limpa conteúdo anterior
            ranking.forEach(rank => {
                const div = document.createElement("div");
                div.className = "rank";
                div.textContent = `${rank.position} ${rank.username} (${rank.pontuacao})`;
                rankingContainer.appendChild(div);
            });
        }
    );
}

async function carregarTorneios() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    swr(
        "torneios",
        async () => {
            const response = await fetch("https://testesitebackend.fly.dev/torneios", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (!response.ok) throw new Error("Não autorizado");
            return response.json();
        },
        (torneios) => {
            const torneiosContainer = document.querySelector(".torneios");
            torneiosContainer.innerHTML = ""; // limpa conteúdo anterior
            torneios.forEach(torneio => {
                const div = document.createElement("div");
                div.className = "torneio";
                const torneioData = new Date(torneio.data);
                div.innerHTML = `
                <h2>${torneio.nome}</h2>
                <p>Data: ${torneioData.toLocaleDateString()}</p>
                <p>Horário: ${torneioData.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>ID: ${torneio.id}</p>
                `;
                const registrarButton = document.createElement("button");
                registrarButton.textContent = "Registrar";
                div.appendChild(registrarButton);
                if (torneio.type === "single") {
                    console.log(JSON.stringify({
                                TorneioId: torneio.id,
                                Nome: nomeDeUsuario,
                                Usernames: [nomeDeUsuario]
                            }));
                    registrarButton.onclick = async () => {
                        const resp = await fetch("https://testesitebackend.fly.dev/registrar-torneio", {
                            method: "POST",
                            headers: {
                                "Authorization": "Bearer " + token,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                TorneioId: torneio.id,
                                Nome: nomeDeUsuario,
                                Usernames: [nomeDeUsuario]
                            })
                        });
                        if (resp.ok) {
                            alert("✅ Registro realizado");
                        } else {
                            alert("❌ Erro ao registrar");
                        }
                    }
                }
                torneiosContainer.appendChild(div);
            });
        }
    );
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

            const linkAddTorneio = document.createElement("a");
            linkAddTorneio.href = "/gerTorneios";
            linkAddTorneio.textContent = "Gerenciar Torneios";
            linkAddTorneio.setAttribute("onclick", "route(event)");
            nav.appendChild(linkAddTorneio);

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

async function carregarGerenciarTorneios() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    swr(
        "gerTorneios",
        async () => {
            const response = await fetch("https://testesitebackend.fly.dev/torneios", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (!response.ok) throw new Error("Não autorizado");
            return response.json();
        },
        (torneios) => {
            const torneiosContainer = document.querySelector(".gerTorneios");
            torneiosContainer.innerHTML = ""; // limpa conteúdo anterior
            const addTorneioButton = document.createElement("button");
            addTorneioButton.textContent = "Adicionar Torneio";
            addTorneioButton.style.marginBottom = "10px";
            addTorneioButton.addEventListener("click", () => openAddTorneioPopup());
            torneiosContainer.appendChild(addTorneioButton);
            torneios.forEach(torneio => {
                const div = document.createElement("div");
                div.className = "torneio";
                const torneioData = new Date(torneio.data);
                div.innerHTML = `
                    <h2>${torneio.nome}</h2>
                    <p>Data: ${torneioData.toLocaleDateString()}</p>
                    <p>Horário: ${torneioData.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    `;
                const manageButton = document.createElement("button");
                manageButton.textContent = "Gerenciar";
                manageButton.style.marginLeft = "10px";
                manageButton.addEventListener("click", () => openGerTorneioPopup(torneio));
                div.appendChild(manageButton);
                torneiosContainer.appendChild(div);
            });
        }
    );

    async function openAddTorneioPopup() {
        try {
            const oldModal = document.getElementById("AddTorneioModal");
            if (oldModal) {
                oldModal.remove();
            }
            const torneioModal = document.getElementById("torneioModal");
            if (torneioModal) {
                torneioModal.remove();
            }
            const modal = document.createElement("div");
            modal.id = "AddTorneioModal";
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
                <input id="nome" placeholder="Nome">
                <input id="data" placeholder="Data dd/mm/yyyy hh:MM">
                <input id="hora" placeholder = "Hora hh:mm">
                <select id="type">
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                </select>
                <button id="add">Adicionar</button>
                <button id="close">Fechar</button>
            `;

            document.body.appendChild(modal);

            modal.querySelector("#close").onclick = () => modal.remove();

            modal.querySelector("#add").onclick = async () => {
                const nome = modal.querySelector("#nome").value;
                const data = modal.querySelector("#data").value + " " + modal.querySelector("#hora").value;
                const type = modal.querySelector("#type").value;
                if (!nome || !data || !type) {
                    alert("❌ Dados vazios");
                    return;
                }
                if (confirm("Adicionar torneio?")) {
                    const res = await fetch(`https://testesitebackend.fly.dev/criar-torneio`, {
                        method: "POST",
                        headers: { 
                            "Authorization": "Bearer " + token,
                            "Content-Type": "application/json"
                         },
                        body: JSON.stringify({ nome, data, type })
                    });
                    if (res.ok) {
                        alert("✅ Torneio criado");
                        modal.remove();
                        location.reload();
                    } else {
                        alert("❌ Erro ao criar torneio");
                    }
                }
            };

        } catch (err) {
            alert("❌ Falha ao carregar página de adição de torneio.");
            console.error(err);
        }
    }

    async function openGerTorneioPopup(torneio) {

        try {
            const oldModal = document.getElementById("torneioModal");
            if (oldModal) {
                oldModal.remove();
            }
            const addTorneioModal = document.getElementById("AddTorneioModal");
            if (addTorneioModal) {
                addTorneioModal.remove();
            }
            const torneioData = new Date(torneio.data);
            const modal = document.createElement("div");
            modal.id = "torneioModal";
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
                <input id="nome" value="${torneio.nome}">
                <input id="data" value="${torneioData.toLocaleDateString()}">
                <input id="hora" value="${torneioData.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}">
                <button id="save">Salvar</button>
                <button id="iniciar">Iniciar</button>
                <button id="close">Fechar</button>
                <button id="delete">Excluir</button>
            `;

            document.body.appendChild(modal);

            modal.querySelector("#close").onclick = () => modal.remove();

            modal.querySelector("#delete").onclick = async () => {
                const torneioId = torneio.id;
                if (confirm("Excluir torneio?")) {
                    const res = await fetch(`https://testesitebackend.fly.dev/torneio?torneioId=${torneioId}`, {
                        method: "DELETE",
                        headers: { 
                            "Authorization": "Bearer " + token,
                            "Content-Type": "application/json"
                         }
                    });
                    if (res.ok) {
                        alert("✅ Torneio excluído");
                        modal.remove();
                        location.reload();
                    } else {
                        alert("❌ Erro ao excluir torneio");
                    }
                }
            };

            modal.querySelector("#save").onclick = async () => {
                const nome = modal.querySelector("#nome").value;
                const data = modal.querySelector("#data").value + " " + modal.querySelector("#hora").value;
                const torneioId = torneio.id;
                if (!nome || !data) {
                    alert("❌ Dados vazios");
                    return;
                }
                if (confirm("Salvar alterações?")) {
                    const res = await fetch(`https://testesitebackend.fly.dev/mudar-torneio`, {
                        method: "POST",
                        headers: { 
                            "Authorization": "Bearer " + token,
                            "Content-Type": "application/json"
                         },
                        body: JSON.stringify({ torneioId, nome, data })
                    });
                    if (res.ok) {
                        alert("✅ Torneio atualizado");
                        modal.remove();
                        location.reload();
                    } else {
                        alert("❌ Erro ao atualizar torneio");
                    }
                }
            };

            modal.querySelector("#iniciar").onclick = async () => {
                const torneioId = torneio.id;
                if (confirm("Iniciar torneio?")) {
                    const res = await fetch(`https://testesitebackend.fly.dev/iniciar-torneio?torneioId=${torneioId}`, {
                        method: "POST",
                        headers: { 
                            "Authorization": "Bearer " + token,
                            "Content-Type": "application/json"
                         }
                    });
                    if (res.ok) {
                        alert("✅ Torneio iniciado");
                        modal.remove();
                        location.reload();
                    } else {
                        alert("❌ Erro ao iniciar torneio");
                    }
                }
            };

        } catch (err) {
            alert("❌ Falha ao carregar página de adição de torneio.");
            console.error(err);
        }
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
    "/gerTorneios": "/pages/gerTorneios.html"
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
    else if (localPath === "/torneios") {
        carregarTorneios();
    }
    else if (localPath === "/gerTorneios") {
        carregarGerenciarTorneios();
    }
};

// Lida com os botões de voltar e avançar do navegador
window.onpopstate = handleLocation;
window.route = route; // Torna a função route acessível globalmente (para o onclick)

// Carrega a rota inicial quando a página é aberta pela primeira vez
handleLocation();