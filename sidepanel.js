// Script específico para o sidepanel
document.addEventListener('DOMContentLoaded', function() {
    const btnEnviarAPI = document.getElementById('enviar-api');
    const totalDadosEl = document.getElementById('total-dados');
    const dadosValidosEl = document.getElementById('dados-validos');
    const alertMessageEl = document.getElementById('alert-message');
    const descricaoPesquisaEl = document.getElementById('descricao-pesquisa');
    const cidadePesquisaEl = document.getElementById('cidade-pesquisa');
    
    // Função para atualizar o status dos dados coletados
    function atualizarStatusDados() {
        chrome.runtime.sendMessage({
            action: 'verificarDadosColetados'
        }, function(response) {
            if (response) {
                totalDadosEl.textContent = response.quantidade;
                dadosValidosEl.textContent = response.dadosValidos;
                
                // Atualizar os parâmetros de pesquisa, se disponíveis
                if (response.parametrosPesquisa) {
                    descricaoPesquisaEl.textContent = response.parametrosPesquisa.descricao || "Não definido";
                    cidadePesquisaEl.textContent = response.parametrosPesquisa.cidade || "Não definida";
                }
            }
        });
    }

    // Atualizar status a cada 5 segundos
    setInterval(atualizarStatusDados, 5000);
    // Atualizar status imediatamente quando a página carrega
    atualizarStatusDados();

    // Configurar o botão de envio para API
    btnEnviarAPI.addEventListener('click', function() {
        // Mostrar mensagem de carregamento
        mostrarAlerta('Enviando dados para a API...', 'alert-warning');
        
        chrome.runtime.sendMessage({
            action: 'enviarDadosAPI'
        }, function(response) {
            console.log('response', response.success)
            if (response.success) {
                mostrarAlerta('Dados enviados com sucesso!', 'alert-success');
                // Atualizar contadores
                atualizarStatusDados();
            } else {
                mostrarAlerta(response.message || response.error || 'Erro ao enviar dados', 'alert-error');
            }
        });
    });

    // Função para mostrar alertas
    function mostrarAlerta(mensagem, tipo) {
        alertMessageEl.textContent = mensagem;
        alertMessageEl.className = 'alert ' + tipo;
        
        // Esconder o alerta após 5 segundos para tipos success e warning
        if (tipo === 'alert-success' || tipo === 'alert-warning') {
            setTimeout(() => {
                alertMessageEl.className = 'alert hidden';
            }, 5000);
        }
    }
}); 