document.getElementById("prenotazione-form").addEventListener("submit", function(event) {
  event.preventDefault();

  var nome = document.getElementById("nome").value;
  var cognome = document.getElementById("cognome").value;
  var email = document.getElementById("email").value;
  var data = document.getElementById("data").value;

  sendMail(nome, cognome, email, data)
      .then(function(res) {
          console.log(res);
          alert("Messaggio inviato con successo!");
      })
      .catch(function(error) {
          console.log(error);
          alert("Errore nell'invio del messaggio");
      });
});

function formatDate(dateString) {
  var date = new Date(dateString);
  
  var day = date.getDate();
  var month = date.getMonth() + 1; // I mesi in JavaScript partono da 0, quindi aggiungiamo 1
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  // Aggiungi uno zero iniziale se il giorno, il mese, le ore o i minuti sono composti da un solo cifra
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  var formattedDate = day + "/" + month + "/" + year + " " + hours + ":" + minutes;
  return formattedDate;
}

function sendMail(nome, cognome, email, data) {
  var formattedDate = formatDate(data);

  return new Promise(function(resolve, reject) {
      // Field validation
      var isNomeValid = nome !== "";
      var isCognomeValid = cognome !== "";
      var isEmailValid = email !== "";
      var isDataValid = data !== "";

      if (!isNomeValid || !isCognomeValid || !isEmailValid || !isDataValid) {
          reject("Campi non validi");
          return;
      }

      // Format validation
      var regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      var isEmailFormatValid = regexEmail.test(email);
      var regexNome = /^[A-Za-z]+$/;
      var isNomeFormatValid = regexNome.test(nome);
      var regexCognome = /^[A-Za-z]+$/;
      var isCognomeFormatValid = regexCognome.test(cognome);

      if (!isEmailFormatValid || !isNomeFormatValid || !isCognomeFormatValid) {
          reject("Formati non validi");
          return;
      }

      // Date validation
      var dataSelezionata = new Date(data);

      // Calcola la data massima di prenotazione (6 mesi indietro)
      var dataMassimaPrenotazione = new Date(dataSelezionata);
      dataMassimaPrenotazione.setMonth(dataSelezionata.getMonth() - 6);

      // Calcola la data massima di acquisto (30 minuti indietro)
      var dataMassimaAcquisto = new Date(dataSelezionata);
      dataMassimaAcquisto.setMinutes(dataSelezionata.getMinutes() + 30);

      var isTicketValid = dataSelezionata >= dataMassimaPrenotazione && dataSelezionata <= dataMassimaAcquisto;

      if (!isTicketValid) {
        reject("Data del biglietto non valida");
        return;
      }

      var params = {
          nome: nome,
          cognome: cognome,
          email: email,
          data: formattedDate,
      };

      var serviceID = "service_jeserq9";
      var templateID = "template_yxs0ona";

      emailjs.send(serviceID, templateID, params)
          .then(function(res) {
              resolve(res);
          })
          .catch(function(error) {
              reject(error);
          });
  });
}