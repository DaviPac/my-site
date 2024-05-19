function sendEmail() {

    //var name = document.getElementById("name").value;
    var resposta = document.getElementById("anel").value;
    const email = "davipadecarvalho@homail.com";

    Email.send({
        SecureToken : token,
        To : 'davipiresaquino@gmail.com',
        From : "davipadecarvalho@hotmail.com",
        Subject : "This is the subject",
        Body : resposta
    }).then(
      message => alert(message)
    );

}