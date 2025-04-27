let menu = {
  1: { nombre: "Enchiladas", precio: 50, agotado: false },
  2: { nombre: "Tajada con queso", precio: 50, agotado: false },
  3: { nombre: "Carne asada", precio: 160, agotado: true },
  4: { nombre: "Maduro con queso", precio: 50, agotado: false },
  5: { nombre: "Torta de papa", precio: 30, agotado: false },
  6: { nombre: "Pescozon", precio: 30, agotado: false },
  7: { nombre: "Carne Desmenuzada", precio: 150, agotado: false },
  8: { nombre: "Extra de queso", precio: 30, agotado: false }
};

let total = 0;
let tasaCambio = 36.5; // 1 USD = 36.5 córdobas
let lista = document.getElementById("lista");
let totalEl = document.getElementById("total");
let horaEl = document.getElementById("hora");
let numeroOrden = 1;
let sonido = new Audio("ding.mp3");
sonido.play();

function agregar(opcion) {
  let platillo = menu[opcion];
  let items = lista.getElementsByTagName("li");
  let encontrado = false;

  for (let i = 0; i < items.length; i++) {
    let texto = items[i].innerText;
    if (texto.includes(platillo.nombre)) {
      let match = texto.match(/x(\d+)/);
      let cantidad = match ? parseInt(match[1]) + 1 : 2;
      items[i].firstChild.nodeValue = `✅ ${platillo.nombre} x${cantidad} - C$${platillo.precio * cantidad}`;
      total += platillo.precio;
      actualizarTotales();
      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    let li = document.createElement("li");
    li.innerText = `✅ ${platillo.nombre} x1 - C$${platillo.precio}`;

    let btnEliminar = document.createElement("p");
    btnEliminar.innerText = "❌";
    btnEliminar.onclick = function () {
      lista.removeChild(li);
      let match = li.innerText.match(/x(\d+)/);
      let cantidad = match ? parseInt(match[1]) : 1;
      total -= platillo.precio * cantidad;
      actualizarTotales();
    };

    li.appendChild(btnEliminar);
    lista.appendChild(li);

    total += platillo.precio;
    actualizarTotales();
  }
}

function actualizarTotales() {
  totalEl.innerText = "Total: C$" + total;

  let cantidad = 0;
  const items = document.querySelectorAll("#lista li");
  items.forEach(item => {
    let match = item.innerText.match(/x(\d+)/);
    cantidad += match ? parseInt(match[1]) : 1;
  });

  document.getElementById("cantidadProductos").innerText = `🧾 Total de productos: ${cantidad}`;
  horaEl.innerText = "🕒 Pedido realizado a las " + new Date().toLocaleTimeString();
}

function reiniciar() {
  lista.innerHTML = "";
  total = 0;
  totalEl.innerText = "Total: C$0";
  document.getElementById("cantidadProductos").innerText = "";
  horaEl.innerText = `🧾 Orden #${String(numeroOrden).padStart(3, '0')}`;
  numeroOrden++;
}

function generarPDF() {
  const contenido = document.getElementById("orden").innerText;
  const ventana = window.open('', '', 'height=600,width=800');
  ventana.document.write('<html><head><title>Resumen de Pedido</title>');
  ventana.document.write('</head><body>');
  ventana.document.write('<pre>' + contenido + '</pre>');
  ventana.document.write('</body></html>');
  ventana.document.close();
  ventana.print();
}

function enviarWhatsApp() {
  let mensaje = "📋 Pedido Fritanga La Chinita:%0A";
  const items = document.querySelectorAll("#lista li");
  items.forEach(item => {
    mensaje += item.innerText + "%0A";
  });
  mensaje += totalEl.innerText + "%0A";
  mensaje += horaEl.innerText + "%0A";
  
  const numero = "50589277326";
  const url = "https://wa.me/" + numero + "?text=" + mensaje;
  window.open(url, '_blank');
}


function actualizarEstadoNegocio() {
  const estado = document.getElementById("estadoNegocio");

  const ahora = new Date();
  const dia = ahora.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
  const hora = ahora.getHours();
  const minutos = ahora.getMinutes();

  // Horario: Jueves (4), Viernes (5), Sábado (6) de 5:00 PM a 10:30 PM
  const diasAbierto = [4, 5, 6];
  const horaApertura = 17; // 5 PM
  const horaCierre = 22;   // 10 PM
  const minutosCierre = 30; // 10:00 PM

  let abierto = false;

  if (diasAbierto.includes(dia)) {
    if (hora > horaApertura && (hora < horaCierre || (hora === horaCierre && minutos <= minutosCierre))) {
      abierto = true;
    } else if (hora === horaApertura && minutos >= 0) {
      abierto = true;
    }
  }

  if (abierto) {
    estado.innerHTML = "<strong style='color: green;'>🟢 Abierto</strong><br>Horario: De Jueves a Sábado de 5:00 PM - 10:00 PM";
  } else {
    estado.innerHTML = "<strong style='color: red;'>🔴 Cerrado</strong><br>Horario: De Jueves a Sábado de 5:00 PM - 10:00 PM";
  }
}

// Llamarlo cuando cargue la página
actualizarEstadoNegocio();

// Opcional: actualizar cada minuto por si la página se deja abierta
setInterval(actualizarEstadoNegocio, 60000);


function dibujarMenu() {
  const menuDiv = document.querySelector(".menu");
  menuDiv.innerHTML = ""; // Limpiar el menú anterior

  for (let id in menu) {
    const platillo = menu[id];
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    if (platillo.agotado) {
      itemDiv.classList.add("agotado");
      itemDiv.innerText = `${platillo.nombre} - Agotado`;
    } else {
      itemDiv.innerText = `${platillo.nombre} - C$${platillo.precio}`;
      itemDiv.onclick = function() {
        agregar(id);
      };
    }

    menuDiv.appendChild(itemDiv);
  }
}

dibujarMenu();
