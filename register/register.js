document.getElementById('registerForm').addEventListener('submit', async function(e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const response = await fetch('https://testesitebackend.fly.dev/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
      });

      if (response.status === 401) {
        document.getElementById('resultado').textContent = '❌ Usuário já existe.';
      } else if (response.ok) {
        document.getElementById('resultado').textContent = '✅ Registro bem-sucedido!';
        window.location.href = '/login/';
      } else {
        document.getElementById('resultado').textContent = '⚠️ Erro ao conectar com o servidor.';
        }
    });