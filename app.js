let reportes = 0;
let map;

// 🗺️ INICIAR MAPA
function iniciarMapa() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -6, lng: -76 },
    zoom: 13
  });
}

// 🧠 FUNCIÓN PRINCIPAL
function guardar() {
  const texto = document.getElementById("texto").value;

  if (texto === "") {
    alert("⚠️ Escribe algo primero");
    return;
  }

  // 📍 GPS
  navigator.geolocation.getCurrentPosition(function (pos) {

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    reportes++;

    let mensaje = "";
    let color = "";

    if (reportes <= 3) {
      mensaje = "🟢 Zona segura";
      color = "green";
    } else if (reportes <= 6) {
      mensaje = "🟡 Zona en riesgo";
      color = "orange";
    } else {
      mensaje = "🔴 Zona peligrosa";
      color = "red";
    }

    // 🧾 RESULTADO
    const resultado = document.getElementById("resultado");

    resultado.innerText =
      "📍 " + texto +
      "\nUbicación: " + lat.toFixed(4) + ", " + lng.toFixed(4) +
      "\nEstado: " + mensaje;

    resultado.style.color = color;

    // 📋 LISTA
    const lista = document.getElementById("lista");

    const item = document.createElement("li");
    item.innerText =
      texto + " (" + lat.toFixed(2) + ", " + lng.toFixed(2) + ")";

    lista.appendChild(item);

    // 📍 MARCADOR EN MAPA
    new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map
    });

    // limpiar
    document.getElementById("texto").value = "";

  });
}