// Função para carregar a página inicial
async function onLoadPage() {
    const userToken = window.localStorage.getItem("token");  // Obtendo o token do usuário

    if (!userToken) {
        window.location.href = '/login';  // Se o token não existir, redireciona para o login
        return;  // Adicionado para evitar que o código continue a execução
    }

    try {
        const reply = await fetch("http://localhost:8080/auth/profile", {
            method: "POST",
            headers: { 
                Authorization: "Bearer " + userToken,
            },
        });

        const data = await reply.json();
        console.log(data);

        if (reply.status !== 200) {
            document.querySelector("h1").innerHTML = "Acesso Negado!";
        } else {
            // Armazenar o id do usuário no localStorage
            localStorage.setItem('user_id', data.id);

            document.querySelector("h1").innerHTML = `Bem-vindo, ${data.name}`;
            loadAvailableEvents();  // Carregar eventos disponíveis
            loadRegisteredEvents();  // Carregar eventos inscritos
        }
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        document.querySelector("h1").innerHTML = "Erro ao carregar perfil!";
    }
}

// Função para carregar eventos disponíveis para inscrição
function loadAvailableEvents() {
    const userToken = window.localStorage.getItem("token");

    fetch('http://localhost:8080/event/all', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {

        // Agora acessando a chave "Events" na resposta
        const events = data.Events;  // Corrigido para acessar a chave "Events"

        const availableEventsContainer = document.getElementById('availableEvents');
        availableEventsContainer.innerHTML = '';

        if (events && events.length > 0) {
            const row = document.createElement('div');
            row.className = 'row g-4';

            events.forEach(event => {
                const col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

                col.innerHTML = `
                    <div class="card h-100 shadow-sm" style="background-color: transparent;">
                        <img src="${event.image_url}" class="card-img-top" alt="Imagem do evento" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column" style="background-color: transparent;">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">${event.description}</p>
                            <p class="card-text mt-auto"><small style="color: green;">Data: ${new Date(event.date).toLocaleString()}</small></p>
                            <button class="btn btn-primary mt-2" onclick="registerForEvent(${event.id})">Inscrever-se</button>
                        </div>
                    </div>
                `;

                row.appendChild(col);
            });

            availableEventsContainer.appendChild(row);
        } else {
            availableEventsContainer.innerHTML = '<p>Nenhum evento disponível.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar eventos:', error);
        alert("Erro ao carregar eventos disponíveis.");
    });
}

// Função para listar os eventos registrados pelo usuário
async function loadRegisteredEvents() {
    const userToken = window.localStorage.getItem("token");
    const userId = window.localStorage.getItem("user_id");

    if (!userToken || !userId) {
        alert("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/user/${userId}/subscriptions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        });

        const data = await response.json();
        

        const registeredEventsContainer = document.getElementById('registeredEvents');
        registeredEventsContainer.innerHTML = '';

        if (data && data.subscriptions && data.subscriptions.length > 0) {
            
            data.subscriptions.forEach(async (subscription) => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('col-12', 'col-md-6', 'mb-2');  // 2 cards por linha no desktop

                eventElement.innerHTML = `
                    <div class="card shadow-sm border-0 rounded-4">
                        <div class="row g-0">
                            <div class="col-12 col-md-4 d-flex flex-column align-items-center justify-content-center p-4 bg-light">
                                <img src="${subscription.image_url}" class="img-fluid rounded-3 mb-3" alt="${subscription.title}" style="max-height: 180px; object-fit: cover; width: 100%;"> 

                                <!-- QR Code ficará aqui, mas não afetará o layout do card -->
                                <div id="qrcode-${subscription.subscription_id}" class="mb-2" style="width: 120px; height: 120px; display: flex; justify-content: center; align-items: center;"></div>

                                <p class="text-center fw-semibold small text-secondary mb-0">Inscrição:</p>
                                <p class="text-center fw-bold small">${subscription.subscription_id}</p>
                            </div>
                            <div class="col-12 col-md-8">
                                <div class="card-body d-flex flex-column h-100 p-4">
                                    <h5 class="card-title text-primary mb-3 text-center text-md-start">${subscription.title}</h5>
                                    <p class="card-text text-justify small mb-4">${subscription.description}</p>

                                    <div class="mb-2">
                                        <p class="mb-1 small">
                                            <strong>Data do Evento:</strong> 
                                            ${new Date(subscription.date).toLocaleDateString()} 
                                            <span class="text-success">às ${new Date(subscription.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </p>
                                        <p class="mb-1 small"><strong>Participante:</strong> ${subscription.user_name}</p>
                                    </div>

                                    <div class="mt-auto text-center">
                                        <button class="btn btn-outline-danger btn-sm px-4" onclick="cancelRegistration('${subscription.subscription_id}')">
                                            Cancelar Inscrição
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                registeredEventsContainer.appendChild(eventElement);

                // Gerar o QR Code como imagem
                const qrcodeDiv = document.getElementById(`qrcode-${subscription.subscription_id}`);
                if (qrcodeDiv) {
                    try {
                        const qrDataUrl = await QRCode.toDataURL(subscription.subscription_id, {
                            width: 120,
                            margin: 1,
                            color: {
                                dark: '#000000',
                                light: '#ffffff'
                            }
                        });
                        const img = document.createElement('img');
                        img.src = qrDataUrl;
                        img.alt = 'QR Code';
                        img.style.width = '120px';
                        img.style.height = '120px';
                        img.classList.add('img-fluid');
                        qrcodeDiv.appendChild(img);
                    } catch (error) {
                        console.error('Erro ao gerar QR Code:', error);
                    }
                }
            });
        } else {
            registeredEventsContainer.innerHTML = '<p class="text-center text-muted">Você não está inscrito em nenhum evento.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar eventos registrados:', error);
        alert("Erro ao carregar eventos registrados.");
    }
}

// Função para inscrever-se em um evento
function registerForEvent(eventId) {
    const userToken = window.localStorage.getItem("token");
    const userId = window.localStorage.getItem("user_id"); // Pegando o user_id salvo no localStorage

    if (!userId) {
        alert('Usuário não identificado. Por favor, faça o login novamente.');
        window.location.href = '/login';  // Redireciona para o login caso o ID do usuário não exista
        return;
    }

    fetch('http://localhost:8080/event/Subscription', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            user_id: parseInt(userId), // Garante que é número
            event_id: eventId 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error) {
            alert('Inscrição realizada com sucesso!');
            loadAvailableEvents();  // Recarregar eventos disponíveis
            loadRegisteredEvents(); // Recarregar eventos do usuário
        } else {
            alert(`Erro ao se inscrever no evento: ${data.error}`);
        }
    })
    .catch(error => {
        console.error('Erro ao inscrever no evento:', error);
        alert('Ocorreu um erro ao tentar se inscrever no evento.');
    });
}

// Função para cancelar inscrição em um evento
async function cancelRegistration(subscription_id) {
    const userToken = window.localStorage.getItem("token");

    if (!userToken) {
        alert("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/subscription/${subscription_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            loadRegisteredEvents();  // Recarrega a lista de eventos registrados
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Erro ao cancelar inscrição:", error);
        alert("Erro ao cancelar inscrição.");
    }
}

// Função para fazer logout
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');  // Remove também o user_id
    window.location.href = '../../pages/login.html';  // Redireciona para a página de login
});

function generateQRCode(subscriptionId) {
    const canvas = document.getElementById('qrcodeCanvas');

    QRCode.toCanvas(canvas, subscriptionId, function (error) {
        if (error) console.error(error);
        console.log('QR Code gerado!');
    });
}
