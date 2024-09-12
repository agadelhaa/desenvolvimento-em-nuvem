const express = require('express');
const cors = require('cors');
const app = express();
const port = 5080;

app.use(cors());
app.use(express.json());

let restaurants = [
  {id: 1, name: 'Restaurante A', address: 'Antonio Sales 1077', startTime: '11:00', endTime: '23:00', email:'a@email.com', password:'111111'},
  {id: 2, name: 'Restaurante B', address: 'Rua da Paz 942', startTime: '17:00', endTime: '23:00', email:'b@email.com', password:'111111'},
  {id: 3, name: 'Restaurante C', address: 'Avenida Beira Mar 79', startTime: '07:00', endTime: '18:00', email:'c@email.com', password:'111111'}, // Fixed typo
  {id: 4, name: 'Restaurante D', address: 'Avenida Monsenhor Tabosa 211', startTime: '18:00', endTime: '23:00', email:'d@email.com', password:'111111'}
];

app.get('/restaurantes', (req, res) => {
  try {
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter restaurantes', error: error.message });
  }
});

app.get('/restaurantes/:id', (req, res) => {
  try {
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if (!restaurant) return res.status(404).send('Restaurante não encontrado');
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter restaurante', error: error.message });
  }
});

app.post('/restaurantes', (req, res) => {
  try {
    const { name, address, startTime, endTime, email, password } = req.body;

    if (!name || !address || !startTime || !endTime || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const newRestaurant = {
      id: new Date().getTime(),
      name,
      address,
      startTime,
      endTime,
      email,
      password
    };

    restaurants.push(newRestaurant);
    res.status(201).json({ message: 'Restaurante criado com sucesso', restaurant: newRestaurant });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar restaurante', error: error.message });
  }
});

app.post('/restaurantes/signin', (req, res) => {
  const { email, password } = req.body;
  const restaurant = restaurants.find(r => r.email === email && r.password === password);

  if (!restaurant) {
    return res.status(401).json({ message: 'Email ou senha incorretos' });
  }

  res.json({ message: 'Login bem-sucedido', restaurant });
});


app.put('/restaurantes/:id', (req, res) => {
  try {
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if (!restaurant) return res.status(404).send('Restaurante não encontrado');

    const { name, address, startTime, endTime, email, password } = req.body;

    if (!name || !address || !startTime || !endTime || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    restaurant.name = name;
    restaurant.address = address;
    restaurant.startTime = startTime;
    restaurant.endTime = endTime;
    restaurant.email = email;
    restaurant.password = password;

    res.json({ message: 'Restaurante atualizado com sucesso', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar restaurante', error: error.message });
  }
});

app.delete('/restaurantes/:id', (req, res) => {
  const restaurantIndex = restaurants.findIndex(r => r.id === parseInt(req.params.id));
  if (restaurantIndex === -1) return res.status(404).send('Restaurante não encontrado');

  const deletedRestaurant = restaurants.splice(restaurantIndex, 1);
  res.json({ message: 'Restaurante deletado com sucesso', deletedRestaurant });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
