// api/server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

// Rota de cadastro
app.post('/api/register', (req, res) => {
    const { nome, sobrenome, email, password } = req.body;
    
    const stmt = db.prepare('INSERT INTO users (nome, sobrenome, email, password) VALUES (?, ?, ?, ?)');
    stmt.run(nome, sobrenome, email, password, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Erro ao cadastrar usuário.' });
        }
        res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    });
    stmt.finalize();
});

// Rota de login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ success: false, message: 'E-mail ou senha incorretos.' });
        }
        res.json({ success: true, message: 'Login bem-sucedido!' });
    });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;