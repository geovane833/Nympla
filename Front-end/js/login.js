document.querySelector("#btnLogin").addEventListener("click", login);

async function login() {
  const email = document.querySelector("#inputEmail").value;
  const password = document.querySelector("#inputPassword").value;

  if (email == "" || password == "") {
    alert("Preencha os campos");
    return;
  }

  const dataLogin = {
    email,
    password,
  };

  /* Criacao da requisição pelo login */
  const reply = await fetch("http://localhost:8080/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataLogin),
  });

  console.log(reply.status);
  if (reply.status != 200){
    alert("Algo errado nao esta certo: ", reply.status);
    return;
  }

  const data = await reply.json();
  console.log(data);


  /* 1) salvar o token*/
  window.localStorage.setItem("token", data.token);

  /* 2) Redirecionar para  a pagina de profile ou admin*/
  window.location.href = data.redirect;
}
