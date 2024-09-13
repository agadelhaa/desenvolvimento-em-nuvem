const express = require('express');
const cors = require('cors');
const db = require('./config/db.js');

const app = express();
const port = 5080;

app.use(cors());
app.use(express.json());

app.get('/restaurantes', async (req, res) => {
  try {
    db.all('SELECT * FROM restaurants', [], (err, rows) => {
      if (err) {
        throw new Error(err.message);
      }
      res.json(rows);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter restaurantes', error: error.message });
  }
});

app.get('/restaurantes/:id', async (req, res) => {
  try {
    const restaurantID = parseInt(req.params.id);
    db.get('SELECT * FROM restaurants WHERE id = ?', [restaurantID], (err, row) => {
      if (err) {
        throw new Error(err.message);
      }

      if (!row) {
        return res.status(404).send({message:'Restaurante não encontrado'});
      }
      res.json(row);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter restaurante', error: error.message });
  }
});

app.post('/restaurantes', async (req, res) => {
  try {
    const { name, address, startTime, endTime, email, password } = req.body;

    if (!name || !address || !startTime || !endTime || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    db.get('SELECT email FROM restaurants WHERE email = ?', [email], (err, row) => {
      if (err) {
        throw new Error(err.message);
      }
      if (row) {
        return res.status(400).json({ message: 'Email já cadastrado. Use outro email.' });
      }

      const sql = 'INSERT INTO restaurants (name, address, startTime, endTime, email, password) VALUES (?, ?, ?, ?, ?, ?)';
      db.run(sql, [name, address, startTime, endTime, email, password], function (err) {
        if (err) {
          throw new Error(err.message);
        }
        res.status(201).json({ message: 'Restaurante criado com sucesso', restaurantId: this.lastID });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar restaurante', error: error.message });
  }
});

app.post('/restaurantes/signin', (req, res) => {
  try {
    const { email, password } = req.body;

    db.get('SELECT * FROM restaurants WHERE email = ? AND password = ?', [email, password], (err, row) => { // Fixed password typo
      if (err) {
        throw new Error(err.message);
      }
      if (!row) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }
      res.json({ message: 'Login bem-sucedido', restaurant: row });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
});

app.put('/restaurantes/:id', (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id);
    const { name, address, startTime, endTime, email, password } = req.body;

    if (!name || !address || !startTime || !endTime || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const sql = 'UPDATE restaurants SET name = ?, address = ?, startTime = ?, endTime = ?, email = ?, password = ? WHERE id = ?';
    db.run(sql, [name, address, startTime, endTime, email, password, restaurantId], function (err) {
      if (err) {
        throw new Error(err.message);
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Restaurante não encontrado' });
      }
      res.json({ message: 'Restaurante atualizado com sucesso' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar restaurante', error: error.message });
  }
});

app.delete('/restaurantes/:id', (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id);
    db.run('DELETE FROM restaurants WHERE id = ?', [restaurantId], function (err) {
      if (err) {
        throw new Error(err.message);
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Restaurante não encontrado' });
      }
      res.status(200).json({ message: 'Restaurante deletado com sucesso' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar restaurante', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
