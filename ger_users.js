document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("https://testesitebackend.fly.dev/users", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Não autorizado");
        }

        const users = await response.json();

        const usersContainer = document.querySelector("main.users");
        usersContainer.innerHTML = ""; // limpa conteúdo anterior

        users.forEach(user => {
            const div = document.createElement("div");
            div.className = "user";
            div.textContent = `👤 ${user.username} (${user.role})`;
            usersContainer.appendChild(div);
        });
    } catch (error) {
        alert("❌ Você não tem permissão ou ocorreu um erro.");
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
});