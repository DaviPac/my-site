import { swr } from "../utils.js";

export async function carregarGerenciarTorneios() {
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
                            "Authorization": "Bearer " + token
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