import { swr } from "../utils.js";
import { getTournaments } from "../api.js";

export async function carregarGerenciarTorneios() {

    swr(
        "gerTorneios",
        getTournaments,
        (torneios) => {
            const torneiosContainer = document.querySelector(".gerTorneios");
            torneiosContainer.innerHTML = "";
            const addTorneioButton = document.createElement("button");
            addTorneioButton.textContent = "Adicionar Torneio";
            addTorneioButton.addEventListener("click", () => openAddTorneioPopup());
            torneiosContainer.appendChild(addTorneioButton);
            const template = document.getElementById("gerTorneios-template");
            torneios.forEach(torneio => {
                const clone = template.contentEditable.cloneNode(true);
                clone.querySelector('.torneio-nome').textContent = `${torneio.nome}`;
                clone.querySelector('.torneio-data').textContent = `${torneioData.toLocaleDateString()}`
                clone.querySelector('.torneio-horario').textContent = `${torneioData.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                clone.querySelector('.gerenciar-button').addEventListener("click", () => openGerTorneioPopup(torneio));
                torneiosContainer.appendChild(clone);
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