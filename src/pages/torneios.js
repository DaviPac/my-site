import { swr } from "../utils.js";
import { getUsername } from "../auth.js";
import { getTournaments, registrarEmTorneio } from "../api.js";

export async function carregarTorneios() {
    const nomeDeUsuario = getUsername();
    
    swr(
        "torneios",
        getTournaments,
        (torneios) => {
            const torneiosContainer = document.querySelector(".torneios");
            torneiosContainer.innerHTML = "";
            torneios.forEach(torneio => {
                const template = document.getElementById("torneio-template");
                const clone = template.content.cloneNode(true);
                clone.querySelector('.torneio-nome').textContent = torneio.nome;
                const torneioData = new Date(torneio.data);
                clone.querySelector('.torneio-data').textContent = torneioData.toLocaleDateString();
                clone.querySelector('.torneio-horario').textContent = torneioData.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                clone.querySelector('.torneio-id').textContent = torneio.id;
                const registrarButton = clone.querySelector('.registrar-button');
                if (torneio.type === "single") {
                    registrarButton.onclick = async () => {
                        try {
                            await registrarEmTorneio(torneio.id, nomeDeUsuario, [nomeDeUsuario]);
                            alert("✅ Registro realizado");
                        }
                        catch {
                            alert("❌ Erro ao registrar");
                        }
                    }
                }
                torneiosContainer.appendChild(clone);
            });
        }
    );
}