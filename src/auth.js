import { getPerfil } from "./api.js";

const repoName = window.location.hostname.includes('github.io')
    ? '/' + window.location.pathname.split('/')[1]
    : '';

const token = localStorage.getItem('token');


export async function carregarUsuario() {
    try {
        const user = await getPerfil();

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
    } catch(error) {
        alert(error)
        localStorage.removeItem('token');
        window.location.href = `${repoName}/login`;
        return null;
    }
}