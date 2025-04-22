let menu = {
  1: { nombre: "Enchiladas", precio: 50 },
  2: { nombre: "Tajada con queso", precio: 50 },
  3: { nombre: "Carne asada", precio: 160 },
  4: { nombre: "Maduro con queso", precio: 50 },
  5: { nombre: "Torta de papa", precio: 30 },
  6: { nombre: "Pescozon", precio: 30 },
  7: { nombre: "Carne Desmenuzada", precio: 150 },
  8: { nombre: "extra de queso", precio: 30 }
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
