/*
function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
        return;
    }

    const observer = new MutationObserver(() => {
        const foundElement = document.querySelector(selector);
        if (foundElement) {
            observer.disconnect(); // Para de observar quando o elemento é encontrado
            callback(foundElement);
        }
    });

    // Observa mudanças no DOM
    observer.observe(document.body, {
        childList: true,  // Observa adição/remoção de filhos
        subtree: true     // Observa toda a árvore DOM
    });
}
*/

async function sendDados(dados){
   let tabid= await chrome.runtime.sendMessage({
        action: 'data',
        info: dados
      });

    
}

 const fetchCompanyDetails=()=> {
   
    return new Promise((resolve) => {

        let details = {};
        try {
            const title = document.querySelector(".DUwDvf")?.innerText;
            let phone;
            document
                .querySelectorAll(".RcCsl")
                .forEach((element) => {
                    const phoneIcon = element.querySelector(".NhBTye");
                    if (phoneIcon) {
                        phone =
                            element
                                .querySelector(".Io6YTe")
                                .innerText.replace(/[\s()-]/g, "");
                    }

                    console.log("Phone", phone);
                    console.log("Companie", title);
                });
            details = { title, phone };
        } catch (error) {
            console.error("Error parsing company page:", error);
        }
        resolve(details);

    });
}


setTimeout(async () => {
    let rs = await fetchCompanyDetails()
    await sendDados(rs)
}, 4000);

