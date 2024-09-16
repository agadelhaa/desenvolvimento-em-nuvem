// public/script.js

// Cadastro
document.querySelector('#registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, sobrenome, email, password })
        });
        
        const result = await response.json();
        if (result.success) {
            alert(result.message);
            window.location.href = 'index.html';
        } else {
            alert('Erro: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao cadastrar.');
    }
});

// Login
document.querySelector('#loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        if (result.success) {
            alert(result.message);
            // Redirecionar para uma página protegida
        } else {
            alert('Erro: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao fazer login.');
    }
});