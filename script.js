var colores = ["yellow", "blue", "red", "green"];
    var secuencia = [];
    var secuencia2 = [];
    var puntaje = 0;
    var tiempo = 0;
    var juegoON = false;
    var secuenciaON = false;
    var buttons = document.querySelectorAll(".botondejuego");
    var startButton = document.getElementById("Empezar");
    var tiempoon = document.getElementById("Tiempo");
    var puntuacion = document.getElementById("Puntaje");

    function PrenderBoton(color) {
      var button = document.getElementById(color);
      button.style.opacity = 1;
      var audio = new Audio('click.wav');
      audio.play();
      setTimeout(function() {
        button.style.opacity = 0.5;
      }, 1000);
    }

    function GenerarSecuencia() {
      secuencia.push(colores[Math.floor(Math.random() * colores.length)]);
    }

    function SecuenciaON() {
      var i = 0;
      secuenciaON = true;
      var intervalId = setInterval(function() {
        PrenderBoton(secuencia[i]);
        if (++i >= secuencia.length) {
          clearInterval(intervalId);
          secuenciaON = false;
        }
      }, 1000);
    }

    function startGame() {
      console.log(juegoON);
      juegoON = true;
      startButton.disabled = true;
      secuencia = [];
      secuencia2 = [];
      puntaje = 0;
      tiempo = 0;
      puntuacion.innerHTML = puntaje;
      tiempoon.innerHTML = tiempo;
      buttons[1].style.opacity = 0.5;
      buttons[2].style.opacity = 0.5;
      buttons[3].style.opacity = 0.5;
      buttons[0].style.opacity = 0.5;
      playRound();
      startTimer();
    }

    function playRound() {
      GenerarSecuencia();
      SecuenciaON();
    }

    function VerificarSecuencia() {
      for (var i = 0; i < secuencia2.length; i++) {
        if (secuencia2[i] !== secuencia[i]) return end();
      }
      if (secuencia2.length === secuencia.length) {
        secuencia2 = [];
        puntuacion.innerHTML = ++puntaje;
        setTimeout(playRound, 3000);
      }
    }

    function end() {
      var lose = new Audio('lose.wav');
      lose.play();
      var modalTiempo = tiempo + 's';
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
      document.getElementById("modalTiempo").textContent = modalTiempo;
      document.getElementById("modalPuntaje").textContent = puntaje;
      var closeBtn = document.getElementsByClassName("close")[0];
      closeBtn.onclick = function() {
        modal.style.display = "none";
      };
      juegoON = false;
      startButton.disabled = false;
      tiempoon.innerHTML = 0;
      tiempo = 0
      clearInterval(timerInterval);
      
    }

    function startTimer() {
      if (juegoON) {
        timerInterval = setInterval(function() {
          tiempo = 1 + tiempo;
          tiempoon.innerHTML = tiempo;
        }, 1000);
      } else {
        clearInterval(timerInterval);
      }
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].onclick = function() {
        if (juegoON && !secuenciaON) {
          var color = this.id;
          PrenderBoton(color);
          secuencia2.push(color);
          VerificarSecuencia();
        }
      };
    }

    startButton.onclick = startGame;