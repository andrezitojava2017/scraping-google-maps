// Elementos da UI
let descricao;
let cidade;

const inputDescricao = document.getElementById("descricao");
const inputCidade = document.getElementById("cidade");
const btnEnviar = document.getElementById("enviar");


inputDescricao.addEventListener('change',(e)=>{
  descricao = e.currentTarget.value;
})

inputCidade.addEventListener('change',(e)=>{
  cidade = e.currentTarget.value;
})

btnEnviar.addEventListener("click", (e) => {
  e.preventDefault();
  let search = `${descricao},+${cidade}`

  btnEnviar.textContent='Lendo informações'
  btnEnviar.classList.add('disabled-btn')
  btnEnviar.disabled=true;

  chrome.runtime.sendMessage({
    action: 'getList',
    url: `https://www.google.com.br/maps/search/${search}/`,
    descricao: descricao,
    cidade: cidade
  });
});

