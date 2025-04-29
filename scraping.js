
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
    console.log( 'esse é o objeto rs', rs)
    await sendDados(rs)
}, 4000);

