import { parseJwt, swr } from "../utils";

const token = localStorage.getItem('token');
const nomeDeUsuario = parseJwt(token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

export async function carregarTorneios() {
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