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
            rankingContainer.innerHTML = "";
            const template = document.getElementById("ranking-template");
            ranking.forEach(rank => {
                const clone = template.content.cloneNode(true);
                clone.querySelector(".rank").textContent = `${rank.position} ${rank.username} (${rank.pontuacao})`;
                rankingContainer.appendChild(clone);
            });
        }
    );
}