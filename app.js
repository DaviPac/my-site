const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

fetch('https://testesitebackend.fly.dev/perfil', {
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(resp => {
    if (!resp.ok) throw new Error("Não autorizado");
    return resp.json();
})
.catch(() => {
    alert("catch non auth");
    //localStorage.removeItem('token');
    //window.location.href = 'login.html';
});