    var colores = ["yellow", "blue", "red", "green"];
    var secuencia = [];
    var secuencia2 = [];
    var puntaje = 0;
    var tiempo = 0;
    var nivel = 0;
    var juegoON = false;
    var secuenciaON = false;
    var buttons = document.querySelectorAll(".botondejuego");
    var startButton = document.getElementById("Empezar");
    var tiempoon = document.getElementById("Tiempo");
    var puntuacion = document.getElementById("Puntaje");
    var niveles = document.getElementById("Nivel");
    var puntajefinal = 0;
    var penalizacion = 0;


    // funcion para poder prender el boton, determinando una opacidad inicial y despues de 500 segundos este cambia su opacidad ademas reproduce un audio cuando se prende el boton
    function PrenderBoton(color) {
      var button = document.getElementById(color);
      button.style.opacity = 1;
      var audio = new Audio('click.wav');
      audio.play();
      setTimeout(function() {
        button.style.opacity = 0.5;
      }, 500);
    }

    //funcion para generar una secuencia
    function GenerarSecuencia() {
      secuencia.push(colores[Math.floor(Math.random() * colores.length)]);
    }


    // funcion para prender la secuencia de botones
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

    // Función para iniciar el juego con las verificaciones del nombre y iniciadores de tiempo etc
    function startGame() {
      var playerNameInput = document.getElementById("playerName");
      playerName = playerNameInput.value.trim();
      if (playerName.length < 3) {
        alert("El nombre del jugador debe tener al menos 3 letras.");
        return;
      }
      console.log(playerName)
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

    // Función para verificar si la secuencia del jugador es correcta, si es correcto en 3 segundos genera una nueva secuencia para empezar la siguiente ronda y si es incorrecto termina el juego
    function VerificarSecuencia() {
      for (var i = 0; i < secuencia2.length; i++) {
        if (secuencia2[i] !== secuencia[i]) return end(); 
      }
      if (secuencia2.length === secuencia.length) {
        secuencia2 = [];
        nivel = nivel + 1
        niveles.innerHTML = nivel;
        setTimeout(playRound, 3000);
      }
    }

    // Función para dar el fin del juego
    function end() {
      var lose = new Audio('lose.wav');
      lose.play();
      var modalTiempo = tiempo + 's';
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
      puntuacion.innerHTML = puntaje - 1;
      penalizacion = tiempo * 0.01
      puntajefinal = (puntaje - 1) - penalizacion 
      var nombreJugadorElement = document.getElementById("nombreJugador");
      nombreJugadorElement.textContent = playerName;
      document.getElementById("modalPuntajeFinal").textContent = puntajefinal;
      document.getElementById("modalPenalizacion").textContent = penalizacion;
      document.getElementById("modalTiempo").textContent = modalTiempo;
      document.getElementById("modalPuntaje").textContent = puntaje - 1;
      document.getElementById("modalNivel").textContent = nivel;
      guardarResultados();
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

    // Función para reiniciar el juego en el modal
    function restartGame() {
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
      startGame();
    }

    // Función para empezar el temporizador del juego
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
          puntaje = puntaje + 1
          puntuacion.innerHTML = puntaje;
          VerificarSecuencia();
        }
      };
    }

    //funcion para guardar los resultados de la partida
    function guardarResultados() {
      var partida = {
        nombre: playerName,
        puntaje: puntaje - 1,
        nivel: nivel,
        tiempo: tiempo + "s",
        penalizacion: penalizacion,
        puntajeFinal: puntajefinal,
        fecha: new Date().toLocaleString(), 
      };
    
      // Obtener el array de partidas almacenado en LocalStorage (si existe)
      var partidasGuardadas = JSON.parse(localStorage.getItem("partidas")) || [];
    
      // Agregar la nueva partida al array
      partidasGuardadas.push(partida);
    
      // Guardar el array de partidas actualizado en LocalStorage
      localStorage.setItem("partidas", JSON.stringify(partidasGuardadas));
    }
    // Función para obtener los datos del local storage
    function obtenerPartidas() {
      var partidas = localStorage.getItem('partidas');
      return partidas ? JSON.parse(partidas) : [];
    }

    function obtenerPartidasOrdenadasPorPuntaje() {
      var partidas = obtenerPartidas();
    
      // Ordenar las partidas por puntaje de forma descendente
      partidas.sort(function(a, b) {
        return b.puntajeFinal - a.puntajeFinal;
      });
    
      return partidas;
    }
    
    // Función para mostrar el popup con la lista de partidas
    function mostrarPopup() {
      var partidasOrdenadas = obtenerPartidasOrdenadasPorPuntaje();
      var listaPartidas = document.getElementById('listaPartidas');
      listaPartidas.innerHTML = '';
    
      // Crear elementos de lista con los datos de cada partida (ordenados por puntaje)
      for (var i = 0; i < partidasOrdenadas.length; i++) {
        var partida = partidasOrdenadas[i];
        var listItem = document.createElement('li');
        var puntajeFinalRedondeado = Number(partida.puntajeFinal.toFixed(4));
        listItem.textContent = 'Jugador: ' + partida.nombre + ' | Puntaje Final: ' + puntajeFinalRedondeado + ' | Fecha: ' + partida.fecha;
        listaPartidas.appendChild(listItem);
      }
    
      var popup = document.getElementById('popup');
      popup.style.display = 'block';
    
      var cerrarPopupBtn = document.getElementById('cerrarPopupBtn');
      cerrarPopupBtn.addEventListener('click', function() {
        popup.style.display = 'none';
      });
    }

    var mostrarPartidasBtn = document.getElementById('mostrarPartidasBtn');
    mostrarPartidasBtn.addEventListener('click', mostrarPopup);

    startButton.onclick = startGame;