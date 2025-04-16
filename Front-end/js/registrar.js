document.querySelector('#btnSalvar').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
  
    // Pegando os valores dos campos
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const birth = document.getElementById('birth').value;
  
    // Verificando se todos os campos estão preenchidos
    if (!name || !email || !password || !birth) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    // Montando o objeto JSON
    const userData = {
      name: name,
      email: email,
      password: password,
      birth: birth
    };
  
    console.log('Enviando dados:', userData); // Depuração
  
    // Enviando a requisição POST
    fetch('http://localhost:8080/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();  // Parseia a resposta JSON
      } else {
        return Promise.reject('Erro no servidor. Status: ' + response.status); // Gera um erro se status não for OK
      }
    })
    .then(data => {
      alert('Cadastro realizado com sucesso!');
      
      // Fechar o modal usando JavaScript puro
      const modalElement = document.getElementById('registerModal');
      const modal = bootstrap.Modal.getInstance(modalElement); // Obter instância do modal
      modal.hide(); // Fechar o modal
    })
    .catch(error => {
      console.error('Erro no cadastro:', error); // Mostrar o erro completo no console
      alert('Ocorreu um erro ao tentar se registrar. Detalhes no console.');
    });
  });
  