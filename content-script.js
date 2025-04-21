// Remove DOMContentLoaded (não necessário para injeção programática)
console.log("content-script.js carregado!");

let autoscroll;
let round = 1;
let eventStop = true;

const getListCompanies = async () => {
  let url = [];
  const results = document.querySelectorAll("a.hfpxzc");
  console.log("Total de empresas localizadas ", results.length);

  for (const el of results) {
    try {
      const result = await new Promise((resolve, reject) => {
        // Sua lógica assíncrona
        resolve(el.getAttribute("href"));
      });
      url.push(result);
    } catch (error) {
      console.error("Falha no elemento:", el, error);
    }
        /*
      results.forEach((el) => {
        //console.log(el.getAttribute("href"));
        url.push(el.getAttribute("href"))
      });
      */
  }

  // envia lista com todos os links
  setTimeout(() => {
    chrome.runtime.sendMessage({
      type: "LOAD_LINK_OF_GET_INFO",
      link: url,
    });
  }, 5000);
};

function createbutton(autoscroll) {
  // Encontra o elemento com a classe SZQmle
  const targetElement = document.querySelector(".SZQmle");

  if (targetElement) {
    // Cria um novo botão
    const newButton = document.createElement("button");
    newButton.textContent = "Pronto";
    //newButton.style.marginLeft = "10px"; // Estilo opcional
    newButton.style.padding = "8px";
    newButton.style.backgroundColor = "#f9866d";
    newButton.style.color = "white";
    newButton.style.border = "none";
    newButton.style.borderRadius = "4px";
    newButton.style.cursor = "pointer";

    // Adiciona um evento de clique (opcional)
    newButton.addEventListener("click", function () {
      clearInterval(autoscroll);
      eventStop = false;
      getListCompanies();
    });

    // Insere o botão após o elemento SZQmle
    targetElement.parentNode.insertBefore(newButton, targetElement.nextSibling);
  } else {
    console.log("Elemento com a classe SZQmle não encontrado.");
  }
}

async function start() {
  return new Promise((resolve, reject) => {
    let container = document.querySelector(
      "#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd"
    );

    if (!container) {
      reject("Container não encontrado");
      return;
    }

    console.log("container localizado ", container);

    if (eventStop) {
      autoscroll = setInterval(() => {
        if (!eventStop) {
          clearInterval(autoscroll);
          resolve(true);
          return;
        }

        container.scrollTo({
          top: 1000 * round,
          behavior: "smooth",
        });
        round++;
      }, 2500);
    }

    createbutton(autoscroll);
  });
}

// Delay opcional para garantir que o Maps está pronto
setTimeout(async () => {
  console.log("Iniciando scraping...");

  await start();

  /*
  // Exemplo: Verifica se elementos do Maps existem
  const results = document.querySelectorAll("a.hfpxzc");
  results.forEach((el) => {
    console.log(el.getAttribute("href"));
  });
*/
  // Seu código de scraping aqui...
}, 4000);
