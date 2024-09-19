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
        window.location.href = '/index.html';
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
            window.location.href = `/restaurant/restaurant-show.html?id=${restaurantId}`;
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
                window.location.href = '/index.html';
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

    // CADASTRO DE PRATOS:

    const addMenuItemBtn = document.getElementById("add-menu-item-btn");
    const addMenuItemModal = document.getElementById("add-menu-item-modal");
    const addMenuItemForm = document.getElementById("add-menu-item-form");
    const itemNameInput = document.querySelector("input[name='itemName']");
    const itemDescriptionInput = document.querySelector("textarea[name='itemDescription']");
    const itemPriceInput = document.querySelector("input[name='itemPrice']");

    addMenuItemBtn.onclick = function () {
        addMenuItemModal.style.display = "block";
    };

    addMenuItemForm.onsubmit = (event) => {
        event.preventDefault();

        const newItem = {
            name: itemNameInput.value,
            description: itemDescriptionInput.value,
            price: parseFloat(itemPriceInput.value),
        };

        fetch(`https://apirestaurantes-dqqepdkz.b4a.run/restaurantes/${restaurantId}/cardapios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newItem),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                addMenuItemModal.style.display = "none";
                addMenuItemForm.reset();
            })
            .catch((error) => {
                alert("Erro ao adicionar prato: " + error.message);
                console.error("Erro ao adicionar prato:", error);
            });
    };

    document.querySelectorAll("#add-menu-item-modal .close").forEach(btn => {
        btn.onclick = function () {
            addMenuItemModal.style.display = "none";
        };
    });

    window.onclick = function (event) {
        if (event.target == addMenuItemModal) {
            addMenuItemModal.style.display = "none";
        }
    };


    // GERENCIAMENTO DE PRATOS:

    const manageMenuBtn = document.getElementById("manage-menu-btn");
    const manageMenuModal = document.getElementById("manage-menu-modal");
    const modalMenuList = document.getElementById("modal-menu-list");
    const closeManageMenuBtn = document.querySelector(".close-manage-menu");

    manageMenuBtn.onclick = function () {
    fetchRestaurantMenu(); 
    manageMenuModal.style.display = "block";
    };

    closeManageMenuBtn.onclick = function () {
    manageMenuModal.style.display = "none";
    };

    function openEditModal(itemId, listItem, restaurantId) {
        console.log("itemId:", itemId);
        console.log("listItem:", listItem);
        console.log("restaurantId:", restaurantId);
    
        fetch(`https://apirestaurantes-dqqepdkz.b4a.run/restaurantes/${restaurantId}/cardapios/${itemId}`)
        .then(response => {
            console.log("Resposta do GET:", response);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados do prato. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(itemData => {
            console.log("itemData:", itemData);
            const editModal = document.createElement('div');
            editModal.id = 'edit-menu-item-modal';
            editModal.classList.add('modal');
            editModal.innerHTML = `
                <div class="modal-content">
                    <span class="close-edit-modal btn btn-danger" style="position: absolute; top: 10px; right: 10px;" aria-label="Close">×</span> <h2 class="mb-3">Editar Prato</h2>
                    <form id="edit-menu-item-form">
                        <input type="hidden" name="itemId" value="${itemId}">
                        <input type="text" name="itemName" placeholder="Nome do Prato" value="${itemData.name}" required />
                        <textarea name="itemDescription" placeholder="Descrição (opcional)">${itemData.description || ''}</textarea>
                        <input type="number" name="itemPrice" placeholder="Preço" step="0.01" value="${itemData.price}" required />
                        <button type="submit" class="btn btn-dark">Salvar</button>
                    </form>
                </div>
            `;
    
            document.body.appendChild(editModal);
            editModal.style.display = "block";
    
            const closeEditModalBtn = editModal.querySelector(".close-edit-modal");
            closeEditModalBtn.onclick = function () {
                editModal.style.display = "none";
                editModal.remove(); 
            };
    
            window.onclick = function (event) {
                if (event.target == editModal) {
                    editModal.style.display = "none";
                    editModal.remove(); 
                }
            };
    
            const editMenuItemForm = editModal.querySelector('#edit-menu-item-form');
            editMenuItemForm.onsubmit = (event) => {
                event.preventDefault();
    
                const editedItem = {
                    name: editMenuItemForm.querySelector("input[name='itemName']").value,
                    description: editMenuItemForm.querySelector("textarea[name='itemDescription']").value,
                    price: parseFloat(editMenuItemForm.querySelector("input[name='itemPrice']").value)
                };
    
                fetch(`https://apirestaurantes-dqqepdkz.b4a.run/restaurantes/${restaurantId}/cardapios/${itemId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedItem),
                })
                .then((response) => {
                    console.log("Resposta do PUT:", response); // Verifica a resposta da API
                    if (!response.ok) {
                      throw new Error(`Erro ao editar o prato. Status: ${response.status}`);
                    }
                    return response.json(); 
                })
                .then((data) => {
                    // Atualiza o listItem ANTES de fechar o modal:
                    listItem.querySelector('h4').textContent = editedItem.name;
                    listItem.querySelector('.description').textContent = editedItem.description || '';
                    listItem.querySelector('.price').textContent = `R$ ${editedItem.price.toFixed(2)}`;
    
                    // Fecha o modal:
                    editModal.style.display = "none"; 
                    editModal.remove();
                })
                .catch((error) => {
                    alert("Erro ao editar o prato: " + error.message);
                    console.error("Erro ao editar o prato:", error);
                });
            }; 
        })
        .catch(error => {
            console.error("Erro ao buscar dados do prato:", error);
            alert(error.message);
        });
    }

    function fetchRestaurantMenu() {
    fetch(`https://apirestaurantes-dqqepdkz.b4a.run/restaurantes/${restaurantId}/cardapios`)
    .then((response) => response.json())
    .then((menuItems) => {
        modalMenuList.innerHTML = "";
        if (menuItems.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "Nenhum prato encontrado no cardápio.";
        modalMenuList.appendChild(emptyMessage);
        return;
        }

        menuItems.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <h4>${item.name}</h4>
            <div class="menu-item-content">
            <p class="description">${item.description || ''}</p>
            <div>
                <p class="price">R$ ${item.price.toFixed(2)}</p>
                <button class="edit-menu-item btn btn-primary btn-sm" data-id="${item.id}">Editar</button>
                <button class="delete-menu-item btn btn-danger btn-sm" data-id="${item.id}">Deletar</button>
            </div>
            </div>
        `;
        modalMenuList.appendChild(listItem);
        });
        addEventListenersToModalMenuButtons(); 
    })
    .catch((error) => {
        console.error("Erro ao buscar cardápio:", error);
        modalMenuList.innerHTML = "<li>Erro ao carregar o cardápio.</li>";
    });
    }

    function addEventListenersToModalMenuButtons() {
    const editButtons = modalMenuList.querySelectorAll('.edit-menu-item');
    const deleteButtons = modalMenuList.querySelectorAll('.delete-menu-item');
    editButtons.forEach(button => {
        button.onclick = function() {
        const itemId = this.getAttribute('data-id');
        const listItem = this.closest('li');
        openEditModal(itemId, listItem, restaurantId);
        }
    });

    deleteButtons.forEach(button => {
        button.onclick = function() {
        const itemId = this.getAttribute('data-id');
        if (confirm("Tem certeza que deseja excluir este prato?")) {
            fetch(`https://apirestaurantes-dqqepdkz.b4a.run/restaurantes/${restaurantId}/cardapios/${itemId}`, {
            method: "DELETE",
            })
            .then(response => {
            if (response.ok) {
                this.parentNode.parentNode.parentNode.remove(); 
                alert("Prato excluído com sucesso!");
            } else {
                throw new Error("Erro ao excluir prato.");
            }
            })
            .catch(error => {
            console.error("Erro ao excluir prato:", error);
            alert(error.message);
            });
        }
        };
    });
    }
});