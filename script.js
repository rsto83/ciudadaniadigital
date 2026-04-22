console.log("JS cargó correctamente");


   

function saludo() {
  const mensaje = document.getElementById("mensaje");
  if (mensaje) {
    mensaje.textContent =
      "✔ Bienvenido al mundo de la ciudadanía digital";
  }
}


  

function toggleMenu() {
  const nav = document.getElementById("nav");
  if (nav) nav.classList.toggle("active");
}


 


function iniciarExperiencia() {
  const modal = document.getElementById("modalVideo");
  if (modal) modal.classList.remove("oculto");
}

function cerrarExperiencia() {
  const modal = document.getElementById("modalVideo");

  if (modal) modal.classList.add("oculto");

  const iframe = modal.querySelector("iframe");
  if (iframe) {
    const src = iframe.src;
    iframe.src = "";
    iframe.src = src;
  }

  const resultado = document.getElementById("miniResultado");
  if (resultado) {
    resultado.textContent = "";
    delete resultado.dataset.respondido;
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modalVideo");

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        cerrarExperiencia();
      }
    });
  }
});


  

function miniRespuesta(boton, esCorrecto) {
  const resultado = document.getElementById("miniResultado");

  if (!resultado.dataset.respondido) {
    resultado.dataset.respondido = "true";
  }

  resultado.textContent = esCorrecto
    ? "✔ ¡Correcto!"
    : "❌ Intenta nuevamente";

  resultado.style.color = esCorrecto ? "#2ecc71" : "#e74c3c";
}


  

document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const respuesta = document.getElementById("respuesta");
      if (respuesta) {
        respuesta.textContent = "✔ Gracias, te respondo rápido";
      }

      form.reset();
    });
  }

  mostrarRanking();
});


  

window.addEventListener("load", function () {
  const scrollPos = sessionStorage.getItem("scrollPos");
  if (scrollPos !== null) {
    window.scrollTo(0, parseInt(scrollPos));
  }
});

window.addEventListener("beforeunload", function () {
  sessionStorage.setItem("scrollPos", window.scrollY);
});

function respuesta(boton, esCorrecto) {
  const pregunta = boton.closest(".pregunta");

  if (!pregunta || pregunta.dataset.respondido === "true") return;

  pregunta.dataset.respondido = "true";

  const botones = pregunta.querySelectorAll("button");

  let acierto = esCorrecto ? 1 : 0;

  botones.forEach(b => {
    b.disabled = true;

    // marcar correcta real
    if (b.dataset.correcto === "true") {
      b.classList.add("correcto");
    }

    // marcar incorrecta elegida
    if (b === boton && !esCorrecto) {
      b.classList.add("incorrecto");
    }
  });

  // guardar resultado en la pregunta
  pregunta.dataset.correcto = acierto;

  const resultado = document.createElement("p");

  resultado.textContent = esCorrecto
    ? "✔ ¡Correcto!"
    : "❌ Incorrecto";

  resultado.style.fontWeight = "bold";
  resultado.style.color = esCorrecto ? "#2ecc71" : "#e74c3c";

  pregunta.appendChild(resultado);
}

 


function mostrarResultado() {

  const quizPrincipal = document.getElementById("quiz-principal");
  const quizHuella = document.getElementById("quiz-huella");

  let preguntas = [];
  let tipoQuiz = "";

  if (quizPrincipal) {
    preguntas = quizPrincipal.querySelectorAll(".pregunta");
    tipoQuiz = "principal";
  } 
  else if (quizHuella) {
    preguntas = quizHuella.querySelectorAll(".pregunta");
    tipoQuiz = "huella";
  } 
  else {
    preguntas = document.querySelectorAll(".pregunta");
    tipoQuiz = "general";
  }

  let correctas = 0;
  let total = preguntas.length;

  preguntas.forEach(p => {
    if (p.dataset.correcto === "1") correctas++;
  });

  const nombreInput = document.getElementById("nombreUsuario");

  let nombre = "";

  if (tipoQuiz === "principal" && nombreInput) {
    nombre = nombreInput.value.trim();

    if (!nombre) {
      alert("Por favor escribe tu nombre antes de ver el resultado");
      return;
    }
  } else {
    nombre = "Anónimo";
  }

  const resultado = document.getElementById("resultadoQuiz");

  const porcentaje = (correctas / total) * 100;

  let mensaje = "";
  if (porcentaje === 100) mensaje = "🟢 Excelente";
  else if (porcentaje >= 60) mensaje = "🟡 Bien";
  else mensaje = "🔴 A mejorar";

  if (resultado) {
    resultado.innerHTML =
      `✔ ${nombre}, acertaste ${correctas} de ${total}<br>${mensaje}`;
  }

  if (tipoQuiz === "principal") {

    let resultados = JSON.parse(localStorage.getItem("resultadosQuiz")) || [];

    resultados.push({
      nombre,
      puntaje: correctas,
      total,
      tipo: tipoQuiz
    });

    localStorage.setItem("resultadosQuiz", JSON.stringify(resultados));

    mostrarRanking();
  }
}





function mostrarRanking() {
  const lista = document.getElementById("listaResultados");
  if (!lista) return;

  const quizPrincipal = document.getElementById("quiz-principal");
  if (!quizPrincipal) return;

  lista.innerHTML = "";

  let resultados = JSON.parse(localStorage.getItem("resultadosQuiz")) || [];

  resultados = resultados.filter(r => r.tipo === "principal");

  resultados.sort((a, b) => b.puntaje - a.puntaje);
  resultados = resultados.slice(0, 5);

  resultados.forEach((r, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${r.nombre} - ${r.puntaje}/${r.total}`;
    lista.appendChild(li);
  });
}


 


function borrarRanking() {
  let resultados = JSON.parse(localStorage.getItem("resultadosQuiz")) || [];

  resultados = resultados.filter(r => r.tipo !== "principal");

  localStorage.setItem("resultadosQuiz", JSON.stringify(resultados));

  mostrarRanking();
}


  


function reiniciarQuiz() {
  const preguntas = document.querySelectorAll(".pregunta");

  preguntas.forEach(p => {
    p.dataset.respondido = "false";
    p.dataset.correcto = "0";

    const feedback = p.querySelector("p:last-child");
    if (feedback && (feedback.textContent.includes("✔") || feedback.textContent.includes("❌"))) {
      feedback.remove();
    }

    const botones = p.querySelectorAll("button");
    botones.forEach(b => {
      b.disabled = false;
      b.style.backgroundColor = "";
      b.style.color = "";
    });
  });

  const resultado = document.getElementById("resultadoQuiz");
  if (resultado) resultado.innerHTML = "";
}