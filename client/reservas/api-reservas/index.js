const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let reservas = []; // Este será o banco de dados em memória

// Endpoint para criar uma reserva
app.post('/reservas', (req, res) => {
    const { user_id, restaurant_id, table_id, reservation_date, reservation_time } = req.body;

    if (!user_id || !restaurant_id || !table_id || !reservation_date || !reservation_time) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const newReservation = {
        id: reservas.length + 1,
        user_id,
        restaurant_id,
        table_id,
        reservation_date,
        reservation_time
    };

    reservas.push(newReservation);
    res.status(201).json(newReservation);
});

// Endpoint para obter todas as reservas
app.get('/reservas', (req, res) => {
    res.status(200).json(reservas);
});

// Endpoint para obter uma reserva por ID
app.get('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const reserva = reservas.find(r => r.id === id);

    if (!reserva) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    res.status(200).json(reserva);
});

// Endpoint para atualizar uma reserva
app.put('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { user_id, restaurant_id, table_id, reservation_date, reservation_time } = req.body;
    const reservaIndex = reservas.findIndex(r => r.id === id);

    if (reservaIndex === -1) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    if (!user_id || !restaurant_id || !table_id || !reservation_date || !reservation_time) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    reservas[reservaIndex] = {
        id,
        user_id,
        restaurant_id,
        table_id,
        reservation_date,
        reservation_time
    };

    res.status(200).json(reservas[reservaIndex]);
});

// Endpoint para deletar uma reserva
app.delete('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const reservaIndex = reservas.findIndex(r => r.id === id);

    if (reservaIndex === -1) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    reservas.splice(reservaIndex, 1);
    res.status(204).send();
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
