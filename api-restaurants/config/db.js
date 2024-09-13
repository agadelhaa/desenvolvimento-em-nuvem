const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/restaurants.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        seedMockRestaurants();
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS restaurants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            address TEXT NOT NULL,
            startTime TEXT NOT NULL,
            endTime TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `)
})

function seedMockRestaurants() {
    const mockRestaurants = [
        { name: 'Restaurante Sabores do Mar', address: 'Rua das Gaivotas, 134', startTime: '12:00', endTime: '22:00', email: 'saboresdomar@email.com', password: 'sabores123' },
        { name: 'Bistrô Bella Italia', address: 'Avenida do Café, 210', startTime: '11:00', endTime: '23:00', email: 'bellaitalia@email.com', password: 'bella1234' },
        { name: 'Churrascaria Fogo de Chão', address: 'Avenida Brasil, 157', startTime: '11:30', endTime: '22:30', email: 'fogochaobrazil@email.com', password: 'churrasco321' },
        { name: 'Cantina da Mama', address: 'Rua dos Pomares, 56', startTime: '12:00', endTime: '21:00', email: 'cantinamama@email.com', password: 'cantina123' },
        { name: 'Grill e Grelhados', address: 'Rua dos Coqueiros, 89', startTime: '10:00', endTime: '22:00', email: 'grillegrelhados@email.com', password: 'grill4567' }
    ];

    db.serialize(() => {
        mockRestaurants.forEach(restaurant => {
            db.run(`
                INSERT OR IGNORE INTO restaurants (name, address, startTime, endTime, email, password)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [restaurant.name, restaurant.address, restaurant.startTime, restaurant.endTime, restaurant.email, restaurant.password], (err) => {
                if (err) {
                    console.error(`Error inserting ${restaurant.name}:`, err.message);
                } else {
                    console.log(`${restaurant.name} inserted successfully.`);
                }
            });
        });
    });
}

module.exports = db;