function sendEmail() {

    var resposta = document.getElementById("anel").value;
    const email = "davipadecarvalho@homail.com";
    const token = "8c48cd89-f44b-414a-885e-127c7e4bafe7";

    Email.send({
        SecureToken : token,
        To : 'davipiresaquino@gmail.com',
        From : "davipadecarvalho@hotmail.com",
        Subject : "This is the subject",
        Body : resposta
    }).then(
        message => {
            setTimeout(function() {
                if (message == "OsK") {
                    window.location.href = 'result';
                }
                else {
                    alert("Erro. Tente novamente");
                }
            }, 3000);
        }
    );

}