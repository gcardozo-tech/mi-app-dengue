let reportes = 0;
let map;

const db = window.db;

// 🗺️ INICIAR MAPA
function iniciarMapa() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -6, lng: -76 },
    zoom: 13
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (pos) {

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      map.setCenter({ lat: lat, lng: lng });
      map.setZoom(15);

      new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: "Tu ubicación"
      });

    });
  }
}

// 🧠 GUARDAR REPORTE
function guardar() {
  const texto = document.getElementById("texto").value;

  if (texto === "") {
    alert("⚠️ Escribe algo primero");
    return;
  }

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

    const resultado = document.getElementById("resultado");

    resultado.innerText =
      "📍 " + texto +
      "\nUbicación: " + lat.toFixed(4) + ", " + lng.toFixed(4) +
      "\nEstado: " + mensaje;

    resultado.style.color = color;

    const lista = document.getElementById("lista");

    const item = document.createElement("li");
    item.innerText =
      texto + " (" + lat.toFixed(2) + ", " + lng.toFixed(2) + ")";

    lista.appendChild(item);

    // 📍 marcador en mapa
    new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map
    });

    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(15);

    // ☁️ GUARDAR EN FIREBASE
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
    .then(({ collection, addDoc }) => {

      addDoc(collection(db, "reportes"), {
        texto: texto,
        lat: lat,
        lng: lng,
        fecha: new Date()
      });

    });

    document.getElementById("texto").value = "";

  });
}

// 🔄 MOSTRAR DATOS DESDE FIREBASE
import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
.then(({ collection, onSnapshot }) => {

  const lista = document.getElementById("lista");

  onSnapshot(collection(db, "reportes"), (snapshot) => {
    lista.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      const item = document.createElement("li");
      item.innerText =
        data.texto + " (" + data.lat.toFixed(2) + ", " + data.lng.toFixed(2) + ")";

      lista.appendChild(item);
    });
  });

});
