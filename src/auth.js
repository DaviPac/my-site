import { getPerfil } from "./api.js";
import { parseJwt } from "./utils.js";

const repoName = window.location.hostname.includes('github.io')
    ? '/' + window.location.pathname.split('/')[1]
    : '';

export function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log("Sem token");
        window.location.href = `${repoName}/login`;
        return null;
    }
    return token;
}

export function getUsername() {
    const token = getToken();
    return parseJwt(token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
}

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