let collectedLinks = [];
let dadosColetados = [];

/*
async function getDataInfo(urls) {

  const promises = urls.map((url) => {
    return new Promise(async (resolve) => {
      try {
        // Abre nova aba
        const tab = await chrome.tabs.create({ url, active: false });

        // Espera a aba carregar totalmente
        await new Promise((innerResolve) => {
          const listener = (tabId, changeInfo) => {
            if (tabId === tab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              innerResolve();
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
        });
        // Injeta content script após a página carregar
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["scraping.js"],
        });
       
        resolve({url:url, tab:tab.id});
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
        resolve(null); // ou você pode usar reject(error) se preferir
      }
    });
  });

  return Promise.all(promises);
}
*/
async function getDataInfos(url) {

  
    return new Promise(async (resolve) => {
      try {
        // Abre nova aba
        const tab = await chrome.tabs.create({ url, active: false });

        // Espera a aba carregar totalmente
        await new Promise((innerResolve) => {
          const listener = (tabId, changeInfo) => {
            if (tabId === tab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              innerResolve();
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
        });
        // Injeta content script após a página carregar
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["scraping.js"]
        });
       
        resolve({url:url, tab:tab.id});
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
        resolve(null); // ou você pode usar reject(error) se preferir
      }
    });
 

}

// Ouvinte para mensagens do popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "getList") {
    chrome.tabs.create({ url: request.url }, (tab) => {
      console.log(`Tab criada com ID: ${tab.id}`);

      // Ouvinte para quando a página estiver completamente carregada
      const onUpdatedListener = (tabId, changeInfo, updatedTab) => {
        if (tabId === tab.id && changeInfo.status === "complete") {
          // Remove o ouvinte após o uso para evitar vazamentos
          chrome.tabs.onUpdated.removeListener(onUpdatedListener);

          // Verifica se a URL é do Google Maps
          if (updatedTab.url.includes("google.com.br/maps")) {
            chrome.scripting
              .executeScript({
                target: { tabId: tab.id },
                files: ["content-script.js"],
              })
              .then(() => {
                console.log("Script injetado com sucesso!");
              })
              .catch((err) => {
                console.error("Falha ao injetar o script:", err);
              });
          }
        }
      };

      // Adiciona o ouvinte para quando a página terminar de carregar
      chrome.tabs.onUpdated.addListener(onUpdatedListener);
    });

    return true; // Indica que a resposta será assíncrona
  }

  if (request.type === "LOAD_LINK_OF_GET_INFO") {
    collectedLinks = request.link;

    // caso link esteja vazio
    if (collectedLinks.length === 0) {
      console.warn("Lista de links vazia");
      return;
    }

    console.log("Link collected:", request.link);

    //getDataInfo(collectedLinks)
    for(const el of collectedLinks) {
      getDataInfos(el)  
      .then((rs) => {
        console.warn("link aberto: ", rs);
      })
      .catch((e) => {
        console.warn("link NAO aberto: ", e);
      });

    }
    
    /*
    const promises = collectedLinks.map((el) => {
      return new Promise((resolve, reject) => {
        getDataInfo(el)
          .then((rs) => {
            console.log("promise resolvida ", rs);
            resolve(rs);
          })
          .catch((e) => {
            console.warn("erro na promise ", e);
            reject(e);
          });
      });
    });

    Promise.all(promises)
      .then((v) => {
        console.log("Finalizada");
      })
      .catch((e) => {
        console.warn("Erro nas promises", e);
      });
      */
  }

  if (request.action === "data") {
   
      try {
        // Adiciona os dados ao array
        dadosColetados.push(request.info);

        // Fecha a aba, se sender.tab.id existir
        if (sender.tab?.id) {
          console.log('Fechando aba:', sender.tab.id);
          await chrome.tabs.remove(sender.tab.id);
        } else {
          console.warn('Nenhuma aba associada à mensagem');
        }

        sendResponse({ success: true });
      } catch (error) {
        console.error('Erro no processamento da mensagem:', error);
        sendResponse({ success: false, error: error.message });
      }
   
    
    return true;
  }

});

// background.js
chrome.tabs.onCreated.addListener((tab) => {
  console.log("Nova aba criada:", tab.url);
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));