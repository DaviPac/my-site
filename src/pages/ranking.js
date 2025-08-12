import { swr } from "../utils.js";

export async function carregarRanking() {
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