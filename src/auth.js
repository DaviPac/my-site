import { getPerfil } from "./api.js";

const repoName = window.location.hostname.includes('github.io')
    ? '/' + window.location.pathname.split('/')[1]
    : '';


export async function carregarUsuario() {
    try {
        const resp = await getPerfil();

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