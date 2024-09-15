document.addEventListener("DOMContentLoaded", () => {
    const deleteRestaurantBtn = document.getElementById("delete-btn");
    const editRestaurantBtn = document.getElementById("edit-btn");
    const editRestaurantModal = document.getElementById("edit-restaurant-modal");
    const editRestaurantForm = document.getElementById("edit-restaurant-form");
    const restaurantName = document.querySelector("input[name='restaurantName']");
    const restaurantAddress = document.querySelector("input[name='restaurantAddress']");
    const startTime = document.querySelector("input[name='startTime']");
    const endTime = document.querySelector("input[name='endTime']");
    const restaurantEmail = document.querySelector("input[name='restaurantEmail']");
    const restaurantPassword = document.querySelector("input[name='restaurantPassword']");

    let restaurantDeleted = false;

    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    const restaurantId = getQueryParam('id');

    function fetchRestaurantDetails() {
        fetch(`https://apirestaurantes-dqqepdkz.b4a.run/restaurantes/${restaurantId}`)
        .then(response => {
            if (response.status === 404) {
                throw new Error('Restaurante não encontrado.');
            }
            return response.json();
        })
        .then(restaurant => {
            if (restaurant) {
                document.getElementById('restaurant-name').textContent = restaurant.name;
                document.getElementById('restaurant-address').textContent = restaurant.address;
                document.getElementById('restaurant-start-time').textContent = restaurant.startTime;
                document.getElementById('restaurant-end-time').textContent = restaurant.endTime;
                document.getElementById('restaurant-email').textContent = restaurant.email;

                restaurantName.value = restaurant.name;
                restaurantAddress.value = restaurant.address;
                startTime.value = restaurant.startTime;
                endTime.value = restaurant.endTime;
                restaurantEmail.value = restaurant.email;
                restaurantPassword.value = '';
            } else {
                document.getElementById('restaurant-details').innerHTML = '<p>Restaurante não encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Error ao carregar o restaurante:', error);
        });
    }

    if (!restaurantDeleted) {
        fetchRestaurantDetails();
    }

    document.getElementById('home-btn').onclick = function() {
        window.location.href = '/client/index.html';
    };

    editRestaurantBtn.onclick = function() {
        editRestaurantModal.style.display = "block";
    }

    editRestaurantForm.onsubmit = (event) => {
        event.preventDefault();

        const editedRestaurant = {
            name: restaurantName.value,
            address: restaurantAddress.value,
            startTime: startTime.value,
            endTime: endTime.value,
            email: restaurantEmail.value,
            password: restaurantPassword.value
        };

        fetch(`https://apirestaurantes-dqqepdkz.b4a.run/restaurantes/${restaurantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedRestaurant)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editRestaurantModal.style.display = "none";
            window.location.href = `/client/restaurant/restaurant-show.html?id=${restaurantId}`;
        })
        .catch(error => {
            alert(error.message);
            console.error('Erro ao atualizar o restaurante:', error);
        });
    };

    deleteRestaurantBtn.onclick = function() {
        const confirmation = confirm("Você tem certeza que deseja deletar este restaurante?");
      
        if (confirmation) {
            fetch(`https://apirestaurantes-dqqepdkz.b4a.run/restaurantes/${restaurantId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar o restaurante');
                }
                return response.json();
            })
            .then(data => {
                restaurantDeleted = true;
                window.location.href = '/client/index.html';
                alert(data.message);
            })
            .catch(error => {
                alert(error.message);
                console.error('Erro ao deletar o restaurante:', error);
            });
        }
    };

    document.querySelectorAll(".close").forEach(btn => {
        btn.onclick = function () {
            editRestaurantModal.style.display = "none";
        };
    });

    window.onclick = function (event) {
        if (event.target == editRestaurantModal) {
            editRestaurantModal.style.display = "none";
        }
    };
});
