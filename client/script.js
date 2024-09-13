document.addEventListener("DOMContentLoaded", function () {

  const signupRestaurantModal = document.getElementById("signupRestaurantModal");
  const signupRestaurantForm = document.getElementById("signupRestaurantForm")
  const restaurantName = document.querySelector("input[name='restaurantName']")
  const restaurantAddress = document.querySelector("input[name='restaurantAddress']")
  const startTime = document.querySelector("input[name='startTime']")
  const endTime = document.querySelector("input[name='endTime']")
  const restaurantEmail = document.querySelector("input[name='restaurantEmail']")
  const restaurantPassword = document.querySelector("input[name='restaurantPassword']")
  

  const signinRestaurantModal = document.getElementById("signinRestaurantModal");
  const signinRestaurantForm = document.getElementById("signinRestaurantForm")
  const signinRestaurantEmail = document.querySelector("input[name=email]")
  const signinRestaurantPassword = document.querySelector("input[name='password']");

  const signupRestaurantBtn = document.getElementById("signupRestaurantBtn");
  const signinRestaurantBtn = document.getElementById("signinRestaurantBtn");

  // Get the <span> elements that close the modals
  var closeButtons = document.getElementsByClassName("close");

  signupRestaurantBtn.onclick = function () {
    signupRestaurantModal.style.display = "block";
  };

  signupRestaurantForm.onsubmit = async (event) => {
    event.preventDefault();

    const newRestaurant = {
        name: restaurantName.value,
        address: restaurantAddress.value,
        startTime: startTime.value,
        endTime: endTime.value,
        email: restaurantEmail.value,
        password: restaurantPassword.value
    };

    try {
      const response = await fetch('http://localhost:5080/restaurantes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newRestaurant)
      });

      if (!response.ok) {
          throw new Error('Falha ao criar restaurante');
      }

      const data = await response.json();

      window.location.href = `/client/restaurant/restaurant-show.html?id=${data.restaurantId}`;
    } catch (error) {
      alert(error.message);
      console.error('Erro ao criar o restaurante:', error);
    }
  }

  signinRestaurantBtn.onclick = function () {
    signinRestaurantModal.style.display = "block";
  };

  signinRestaurantForm.onsubmit = async (event) => {
    event.preventDefault();
  
    const signinData = {
      email: signinRestaurantEmail.value,
      password: signinRestaurantPassword.value,
    };
  
    if (!signinData.email || !signinData.password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signinData.email)) {
      alert("Por favor, insira um endereço de email válido.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5080/restaurantes/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signinData),
      });
  
      if (!response.ok) {
        throw new Error("Falha no login. Verifique suas credenciais.");
      }
  
      const data = await response.json();
      alert("Login bem-sucedido!");

      window.location.href = `/client/restaurant/restaurant-show.html?id=${data.restaurant.id}`;
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
      console.error("Erro ao fazer login:", error);
    }
  
    signinRestaurantModal.style.display = "none";
  };

  for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function () {
      signupRestaurantModal.style.display = "none";
      signinRestaurantModal.style.display = "none";
    };
  }

  for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function () {
      signupRestaurantModal.style.display = "none";
      signinRestaurantModal.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (
      event.target == signupRestaurantModal ||
      event.target == signinRestaurantModal
    ) {
      signupRestaurantModal.style.display = "none";
      signinRestaurantModal.style.display = "none";
    }
  };
});
