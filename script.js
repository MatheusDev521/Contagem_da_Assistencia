let presencialInput = document.getElementById("presencialInput");
let buttonHoje = document.getElementById("buttonHoje");
let calcularButton = document.getElementById("calcular");
let limparButton = document.getElementById("limpar");

let totalPresencialElement = document.getElementById("TotalPresencial");
let totalZoomElement = document.getElementById("TotalZoom");
let totalGeralElement = document.getElementById("TotalGeral");

let inputsZoom = document.querySelectorAll('#ZoomForm input');

// Variáveis para armazenar os totais
let totalPresencial = 0;
let totalZoom = 0;
let totalGeral = 0;

// Função para formatar a data
function informarDiaMes(dataNumerica) {
    const partesData = dataNumerica.split('/');
    const dia = parseInt(partesData[0], 10);
    const mes = parseInt(partesData[1], 10) - 1;
    const ano = parseInt(partesData[2], 10);
  
    const data = new Date(ano, mes, dia);
    
    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const mesesDoAno = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
    const diaDaSemana = diasDaSemana[data.getDay()];
    const mesDoAno = mesesDoAno[data.getMonth()];
  
    return `${diaDaSemana}, ${dia} de ${mesDoAno} de ${ano}`;
}

buttonHoje.addEventListener("click", function() {
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();
    let todayString = `${year}-${month}-${day}`;
    document.getElementById("dataInput").value = todayString;
});

calcularButton.addEventListener("click", function() {
    totalPresencial = parseInt(presencialInput.value) || 0;
    totalZoom = 0;

    for (let i = 1; i <= 10; i++) {
        const voto = parseInt(document.getElementById(i + 'p').value);
        totalZoom += isNaN(voto) ? 0 : voto * i;
    }

    totalGeral = totalPresencial + totalZoom;

    totalPresencialElement.textContent = `Presencial: ${totalPresencial}`;
    totalZoomElement.textContent = `Zoom: ${totalZoom}`;
    totalGeralElement.textContent = `Total: ${totalGeral} pessoas`;
});

limparButton.addEventListener("click", function() {
    if (confirm("Tem certeza que deseja limpar todos os dados?")) {
        presencialInput.value = "";
        inputsZoom.forEach(input => input.value = "");
        document.getElementById("dataInput").value = "";
        totalPresencialElement.textContent = ``;
        totalZoomElement.textContent = ``;
        totalGeralElement.textContent = ``;    
        totalPresencial = 0;
        totalZoom = 0;
        totalGeral = 0;
    }
});

// Função para compartilhar no WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('whatsapp-share-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Pegar a data e formatar
        let dataInput = document.getElementById('dataInput').value;
        let dataFormatada = 'Data não informada';
        
        if (dataInput) {
            // Converter de YYYY-MM-DD para DD/MM/YYYY
            let partesData = dataInput.split('-');
            let dataFormatadaSimples = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
            dataFormatada = informarDiaMes(dataFormatadaSimples);
        }
        
        // Criar mensagem
        let mensagem = `*ASSISTÊNCIA DA REUNIÃO*\n\n`;
        mensagem += `${dataFormatada}\n\n`;
        mensagem += `Presencial: ${totalPresencial}\n`;
        mensagem += `Zoom: ${totalZoom}\n\n`;
        mensagem += `*Total: ${totalGeral} pessoas*`;
        
        let mensagemCodificada = encodeURIComponent(mensagem);
        let whatsappUrl = `https://wa.me/?text=${mensagemCodificada}`;
        window.open(whatsappUrl, '_blank');
    });
    
    // Função para compartilhar genérico (usando Web Share API)
    document.getElementById('generic-share-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (navigator.share !== undefined) {
            // Pegar a data e formatar
            let dataInput = document.getElementById('dataInput').value;
            let dataFormatada = 'Data não informada';
            
            if (dataInput) {
                // Converter de YYYY-MM-DD para DD/MM/YYYY
                let partesData = dataInput.split('-');
                let dataFormatadaSimples = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
                dataFormatada = informarDiaMes(dataFormatadaSimples);
            }
            
            // Criar mensagem
            let mensagem = `ASSISTÊNCIA DA REUNIÃO\n\n`;
            mensagem += `${dataFormatada}\n\n`;
            mensagem += `Presencial: ${totalPresencial}\n`;
            mensagem += `Zoom: ${totalZoom}\n\n`;
            mensagem += `Total: ${totalGeral} pessoas`;
            
            navigator.share({
                title: 'Assistência da Reunião',
                text: mensagem
            })
            .then(() => console.log('Compartilhamento bem-sucedido'))
            .catch((error) => console.log('Erro ao compartilhar', error));
        } else {
            alert('Seu navegador não suporta compartilhamento. Use o botão do WhatsApp.');
        }
    });
});