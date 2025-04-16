// Função para carregar a página inicial
async function onLoadPage() {
   
    const userToken = window.localStorage.getItem("token");  // Obtendo o token do usuário

    // Verificando se o token existe no localStorage
    if (!userToken) {
        window.location.href = '/login';  // Se o token não existir, redireciona para o login
        return;  // Impede a execução do restante
    }

    try {

        const reply = await fetch("http://localhost:8080/auth/admin", {
            method: "POST",
            headers: { 
                Authorization: "Bearer " + userToken,
            },
        });


        // Verificando a resposta em detalhes
        const responseBody = await reply.json();  // Parse da resposta para JSON

        if (reply.status !== 200) {
            // Caso o status não seja 200, log da resposta de erro
            console.error("Erro ao acessar dados do admin:", responseBody);
            document.querySelector("h1").innerHTML = "Acesso Negado!";
            return;  // Impede a execução do restante
        }

        // Se a resposta for bem-sucedida, processa os dados
        const data = responseBody;  // Dados retornados pela API

        // Armazenando o id do admin no localStorage
        localStorage.setItem('user_id', data.id);

        document.querySelector("h1").innerHTML = `Bem-vindo, ${data.name}`;

    } catch (error) {
        // Em caso de erro, exibimos uma mensagem e o erro no console
        console.error("Erro ao carregar perfil:", error);
        document.querySelector("h1").innerHTML = "Erro ao carregar perfil!";
    }
}



// Função para fazer logout
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');  // Remove também o user_id
    window.location.href = '../../pages/login.html';  // Redireciona para a página de login
});

// Função para carregar os eventos disponíveis

async function loadAllEvents() {
    try {
        const reply = await fetch("http://localhost:8080/event/all", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
        });

        if (reply.status !== 200) {
            console.error("Erro ao carregar eventos");
            return;
        }

        const responseData = await reply.json();
        const events = responseData.Events; // Aqui você usa o array "Events" da resposta

        console.log(events); // Só para conferir no console

        const availableEventsDiv = document.getElementById("availableEvents");
        availableEventsDiv.innerHTML = ""; // Limpa antes de adicionar os novos cards

        // Adiciona cada evento à página
        events.forEach(event => {
            const cardHTML = generateEventCard(event);
            availableEventsDiv.innerHTML += cardHTML;
        });

        // Adiciona evento de click no botão de cancelamento para cada evento
        const cancelButtons = document.querySelectorAll('.btn-danger');
        cancelButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const eventId = button.getAttribute('data-id'); // Pega o ID do evento do atributo 'data-id'
                // Exclui o evento
                await deleteEvent(eventId);
            });
        });

    } catch (error) {
        console.error("Erro inesperado:", error);
    }
}

    // Função para excluir o evento
    async function deleteEvent(eventId) {
        try {
            const reply = await fetch(`http://localhost:8080/event/delete/${eventId}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token"),
                },
            });

            if (reply.status === 200) {
                console.log(`Evento ${eventId} excluído com sucesso!`);
                loadAllEvents(); // Recarrega os eventos após excluir um
            } else {
                console.error("Erro ao excluir evento", reply.status);
            }
        } catch (error) {
            console.error("Erro ao tentar excluir evento:", error);
        }
    }

    // Função para gerar o HTML de um card de evento
    function generateEventCard(event) {
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${event.image_url || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${event.title}">
                    <div class="card-body d-flex flex-column text-white">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">${event.description}</p>
                        <p class="card-text">
                            <small style="color: green;">${new Date(event.date).toLocaleString()}</small>
                        </p>
                        <button class="btn btn-danger" data-id="${event.id}">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
    }

// Função para cadastrar evento
document.getElementById('registerEventButton').addEventListener('click', function() {
    const createEventModal = new bootstrap.Modal(document.getElementById('createEventModal'));
    createEventModal.show();
  });

  // Função para salvar evento
  document.getElementById('saveEventButton').addEventListener('click', async function() {
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const date = document.getElementById('eventDate').value;
    const image = document.getElementById('eventImage').value;

    const eventData = {
      title,
      description,
      date,
      image
    };

    try {
      const response = await fetch("http://localhost:8080/event/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
      });

      const result = await response.json();
      if (response.status === 201) {
        alert('Evento criado com sucesso!');
        window.location.reload(); // Recarrega a página para atualizar os eventos
      } else {
        alert('Erro ao criar evento: ' + result.message);
      }
    } catch (error) {
      alert('Erro ao criar evento: ' + error.message);
    }
  });


    
// Carrega os eventos assim que a página for carregada
window.onload = async function() {
    await onLoadPage();     // <- Carrega dados do admin e salva o user_id
    loadAllEvents();        // <- Só depois carrega os eventos
};



async function loadPendingSubscriptions() {
    try {
        const response = await fetch("http://localhost:8080/subscriptions/pending");
        const data = await response.json();

        const container = document.getElementById("pending-cards-container");
        container.innerHTML = "";  // Limpa o conteúdo do container antes de preencher com os novos cards

        if (data.subscriptions && data.subscriptions.length > 0) {
            data.subscriptions.forEach(subscription => {
                const card = document.createElement("div");
                card.classList.add("col-md-4", "mb-4");

                card.innerHTML = `
                    <div class="card text-white bg-dark shadow-sm h-100">
                        <img src="${subscription.event_image_url}" alt="${subscription.event_title}" class="card-img-top">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title">${subscription.event_title}</h5>
                                <p class="card-text">
                                    <strong>Nome:</strong> <span style="color: red;">${subscription.user_name}</span><br>
                                    <strong>Email:</strong> ${subscription.email}<br>
                                    <strong>Data:</strong> ${new Date(subscription.event_date).toLocaleString("pt-BR")}<br>
                                    <!--<strong>Descrição:</strong> ${subscription.event_description}<br> -->
                                    <strong>Status do Check-in:</strong> <span style="color: red;">${subscription.check_in}</span><br>
                                    <strong>ID da Inscrição:</strong> ${subscription.subscription_id}
                                </p>
                            </div>
                            <button class="btn btn-primary mt-3" onclick="checkIn('${subscription.subscription_id}')">Confirmar Check-in</button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = "<p class='text-muted'>Nenhuma inscrição pendente.</p>";
        }
    } catch (error) {
        console.error("Erro ao buscar inscrições pendentes:", error);
    }
}

async function checkIn(subscriptionId) {
    if (!subscriptionId) {
        alert('ID da inscrição não encontrado.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/subscription/${subscriptionId}/checkin`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao confirmar o check-in.');
        }

        const result = await response.json();

        if (result.check_in === "done" || result.message) {
            alert("Check-in confirmado!");
            loadPendingSubscriptions(); // Atualiza a lista
        } else {
            alert("Erro ao confirmar check-in.");
        }
    } catch (error) {
        alert('Erro ao tentar confirmar check-in.');
        console.error(error);
    }
}

async function loadDoneSubscriptions() {
    try {
        const response = await fetch("http://localhost:8080/subscriptions/done");
        const data = await response.json();

        const container = document.getElementById("confirmed-cards-container");
        container.innerHTML = "";  // Limpa o conteúdo do container antes de preencher com os novos cards

        if (data.subscriptions && data.subscriptions.length > 0) {
            data.subscriptions.forEach(subscription => {
                const card = document.createElement("div");
                card.classList.add("col-md-4", "mb-4");

                card.innerHTML = `
                    <div class="card text-white bg-dark shadow-sm h-100">
                        <img src="${subscription.event_image_url}" alt="${subscription.event_title}" class="card-img-top">
                        <div class="card-body d-flex flex-column justify-content-between">

                                <h5 class="card-title">${subscription.event_title}</h5>
                                <p class="card-text">
                                    <strong>Nome:</strong> <span style="color: green;">${subscription.user_name}</span><br>
                                    <strong>Email:</strong> ${subscription.email}<br>
                                    <strong>Data:</strong> ${new Date(subscription.event_date).toLocaleString("pt-BR")}<br>
                                    <!-- <strong>Descrição:</strong> ${subscription.event_description}<br> -->
                                    <strong>Status do Check-in:</strong> <span style="color: green;">${subscription.check_in}</span><br>
                                    <strong>ID da Inscrição:</strong> ${subscription.subscription_id}
                                </p>
                            
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = "<p class='text-muted'>Nenhuma inscrição confirmada.</p>";
        }
    } catch (error) {
        console.error("Erro ao buscar inscrições confirmadas:", error);
    }
}

// Carrega as inscrições pendentes e confirmadas quando qualquer aba é clicada
document.querySelectorAll('.nav-link').forEach(tab => {
    tab.addEventListener("click", () => {
        loadPendingSubscriptions();  // Carrega as inscrições pendentes
        loadDoneSubscriptions();     // Carrega as inscrições confirmadas
    });
});