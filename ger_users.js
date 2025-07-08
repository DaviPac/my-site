document.addEventListener("DOMContentLoaded", async () => {
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

        const usersContainer = document.querySelector("main.users");
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

        } catch (err) {
            alert("❌ Falha ao carregar usuário.");
            console.error(err);
        }
    }
});