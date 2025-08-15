import { getToken } from "./auth.js";

const BASE_URL = 'https://testesitebackend.fly.dev';

async function fetchWithAuth(endpoint, options = {}) {
    const token = getToken();

    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Erro na requisição');
    }

    return response.json();
}

export const registrarEmTorneio = (torneioId, apelido, usernames) => fetchWithAuth('/registrar-torneio', {
    method: 'POST',
    body: JSON.stringify({
        TorneioId: torneioId,
        Nome: apelido,
        Usernames: usernames
    })
});

export const getPerfil = () => fetchWithAuth('/perfil');
export const getUsers = () => fetchWithAuth('/users');
export const getRanking = () => fetchWithAuth('/ranking');
export const getTournaments = () => fetchWithAuth('/torneios');
export const promoteUser = (username) => fetchWithAuth(`/promote?username=${username}`, { method: 'POST' });