document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://testesitebackend.fly.dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.status === 401) {
        document.getElementById('resultado').textContent = '❌ Usuário ou senha incorretos.';
    } else if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/my-site/';
    } else {
        document.getElementById('resultado').textContent = '⚠️ Erro ao conectar com o servidor.';
    }
});