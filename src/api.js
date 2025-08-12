const BASE_URL = 'https://testesitebackend.fly.dev';

async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/my-site/login'; // Redireciona se não houver token
        throw new Error('Não autorizado');
    }

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

export const getPerfil = () => fetchWithAuth('/perfil');
export const getUsers = () => fetchWithAuth('/users');
export const getRanking = () => fetchWithAuth('/ranking');
export const getTournaments = () => fetchWithAuth('/torneios');
export const promoteUser = (username) => fetchWithAuth(`/promote?username=${username}`, { method: 'POST' });