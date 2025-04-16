let currentSubscriptionId = null;
let scanner;
const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
const eventInfoModal = new bootstrap.Modal(document.getElementById('eventInfoModal'));
const qrResult = document.getElementById('qrResult');
const retryBtn = document.getElementById('retryScanButton');
const eventDetailsContainer = document.getElementById('eventDetails');
const checkInBtn = document.getElementById('checkInButton');
const readerContainer = document.getElementById('reader');

// Função chamada quando o botão "Escanear QR" é pressionado
document.getElementById('openScannerBtn').addEventListener('click', () => {
  qrModal.show();
  setTimeout(startScanner, 500); // Espera um pouco para iniciar o scanner
});

// Função chamada quando o botão "Tentar Novamente" é pressionado
retryBtn.addEventListener('click', () => {
  retryBtn.style.display = "none";
  startScanner(); // Reinicia o scanner quando o usuário tenta novamente
});

function startScanner() {
  qrResult.textContent = "Iniciando câmera...";
  eventDetailsContainer.innerHTML = '';
  const config = { fps: 10, qrbox: 250 };

  if (!scanner) {
    scanner = new Html5Qrcode("reader");
  } else {
    scanner.stop().then(() => {
      // Reinicia o scanner com as novas configurações
      return scanner.start({ facingMode: "environment" }, config, handleSuccess, handleError);
    }).catch(console.error);
    return;
  }

  // Inicia o scanner se ele não existir
  scanner.start({ facingMode: "environment" }, config, handleSuccess, handleError);
}

function handleSuccess(decodedText, decodedResult) {
  qrResult.textContent = `QR Code detectado: ${decodedText}`;
  scanner.stop(); // Para o scanner após detectar o QR Code
  fetchEventDetails(decodedText); // Busca os detalhes do evento
}

function handleError(errorMessage) {
  qrResult.textContent = `Aguardando QR Code...`;
}

async function fetchEventDetails(subscriptionId) {
  try {
    const response = await fetch(`http://localhost:8080/subscription/${subscriptionId}`);
    if (!response.ok) throw new Error('Erro ao buscar dados da inscrição.');
    const data = await response.json();
    const subscription = data.subscription;
    displayEventDetails(subscription);
  } catch (error) {
    qrResult.textContent = `Erro: ${error.message}`;
    retryBtn.style.display = "inline-block";
    console.error("Erro ao buscar dados da inscrição:", error);
  }
}

function displayEventDetails(subscription) {
  currentSubscriptionId = subscription.subscription_id;

  eventDetailsContainer.innerHTML = `
    <h5>${subscription.title}</h5>
    <img src="${subscription.image_url}" alt="Evento" class="img-fluid mb-3">
    <p><strong>Descrição:</strong> ${subscription.description}</p>
    <p><strong>Data:</strong> ${new Date(subscription.date).toLocaleString()}</p>
    <p><strong>Status do Check-in:</strong> ${subscription.check_in}</p>
    <p><strong>Inscrito por:</strong> ${subscription.user_name}</p>
    <p><strong>ID da Inscrição:</strong> ${subscription.subscription_id}</p>
  `;
  qrModal.hide(); // Fecha o modal do scanner
  eventInfoModal.show(); // Abre o modal de detalhes do inscrito
}

// Função para confirmar o check-in
checkInBtn.addEventListener('click', async () => {
if (!currentSubscriptionId) {
alert('ID da inscrição não encontrado.');
return;
}

try {
const response = await fetch(`http://localhost:8080/subscription/${currentSubscriptionId}/checkin`, {
method: 'PUT'
});

if (!response.ok) throw new Error('Falha ao confirmar o check-in.');

alert('Check-in confirmado!');
eventInfoModal.hide();

setTimeout(() => {
location.reload(); // Recarrega a página após o modal fechar
}, 500);
} catch (error) {
alert('Erro ao confirmar o check-in.');
console.error(error);
}
});