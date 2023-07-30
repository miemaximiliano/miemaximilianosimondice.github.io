function validateForm() {
  // Obtenemos los valores ingresados por el usuario en los campos del formulario
  var nombre = document.getElementById("nombre").value;
  var email = document.getElementById("email").value;
  var mensaje = document.getElementById("mensaje").value;

  // Definimos patrones para validar el nombre y el correo electrónico
  var namePattern = /^[A-Za-z0-9\s]+$/;
  var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  var nombreError = document.getElementById("nombre-error");
  var emailError = document.getElementById("email-error");
  var mensajeError = document.getElementById("mensaje-error");

  nombreError.textContent = "";
  emailError.textContent = "";
  mensajeError.textContent = "";

  // Variable para almacenar si la validación es exitosa o no
  var isValid = true;

   // Validación de los campos nombre,email y el mensaje
  if (!namePattern.test(nombre)) {
    nombreError.textContent = "El nombre debe ser alfanumérico (solo letras y números).";
    isValid = false;
  }

  if (!emailPattern.test(email)) {
    emailError.textContent = "Ingrese un correo electrónico válido.";
    isValid = false;
  }

  if (mensaje.length < 5) {
    mensajeError.textContent = "El mensaje debe tener al menos 5 caracteres.";
    isValid = false;
  }

  return isValid;
}

// Agregamos un evento al formulario para que, al intentar enviarlo primero se ejecute la función de validación.
document.getElementById("formulario").addEventListener("submit", function(event) {
  if (validateForm()) {
    // Si el formulario es valido, abrimos el correo predeterminado con los datos del formulario para enviar un correo electrónico.
    window.open('mailto:' + document.getElementById("email").value +
      '?subject=' + encodeURIComponent('Mensaje desde el formulario de contacto') +
      '&body=' + encodeURIComponent('Nombre: ' + document.getElementById("nombre").value +
        '\nEmail: ' + document.getElementById("email").value +
        '\nMensaje: ' + document.getElementById("mensaje").value)
    );
  } else {
    // Si el formulario no es valido, evitamos que se envíe el formulario.
    event.preventDefault();
  }
});