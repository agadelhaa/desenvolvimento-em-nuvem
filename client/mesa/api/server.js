const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); 

let mesas = []; 

app.post('/mesas', (req, res) => {
    const { restaurant_id, table_number, capacity } = req.body;

    if (!restaurant_id || !table_number || !capacity) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const newTable = {
        id: mesas.length + 1,
        restaurant_id,
        table_number,
        capacity
    };

    mesas.push(newTable);
    res.status(201).json(newTable);
});

app.get('/mesas', (req, res) => {
    res.status(200).json(mesas);
});

app.get('/mesas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const mesa = mesas.find(m => m.id === id);

    if (!mesa) {
        return res.status(404).json({ error: 'Mesa não encontrada' });
    }

    res.status(200).json(mesa);
});

app.put('/mesas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { restaurant_id, table_number, capacity } = req.body;
    const mesaIndex = mesas.findIndex(m => m.id === id);

    if (mesaIndex === -1) {
        return res.status(404).json({ error: 'Mesa não encontrada' });
    }

    if (!restaurant_id || !table_number || !capacity) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    mesas[mesaIndex] = {
        id,
        restaurant_id,
        table_number,
        capacity
    };

    res.status(200).json(mesas[mesaIndex]);
});

app.delete('/mesas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const mesaIndex = mesas.findIndex(m => m.id === id);

    if (mesaIndex === -1) {
        return res.status(404).json({ error: 'Mesa não encontrada' });
    }

    mesas.splice(mesaIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
