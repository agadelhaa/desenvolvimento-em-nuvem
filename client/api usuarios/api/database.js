// api/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Cria a tabela de usuários
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            sobrenome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);
});

module.exports = db;