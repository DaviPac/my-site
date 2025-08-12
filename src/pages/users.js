import { swr } from "../utils";

export async function carregarUsuarios() {
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