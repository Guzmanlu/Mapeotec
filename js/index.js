/* =========================================================
   MapeoTec — lógica básica (sin backend todavía)
   Datos de ejemplo: esto luego vendrá de la API/base de datos
   ========================================================= */

// ⚠️ Coordenadas de EJEMPLO centradas en Chihuahua capital.
// Reemplácenlas por las de su campus real: abran Google Maps, clic derecho
// sobre cada edificio > clic en las coordenadas para copiarlas.
const CENTRO_MAPA = [28.708247, -106.105005];

const lugares = [
  {
    id: 1,
    nombre: "Edificio D — Aulas",
    categoria: "aulas",
    descripcion: "Salones de clase, planta baja y primer piso",
    lat: 28.707960325105965,
    lng: -106.10549602866749,
  },  
  {
    id: 2,
    nombre: "Cafetería Central",
    categoria: "cafeteria",
    descripcion: "Comida y bebidas, abierto en horario de clases",
    lat: 28.709291837492962,
    lng: -106.10514734149805,
  },  
  {
    id: 3,
    nombre: "Baños — Centro de computo",
    categoria: "banos",
    descripcion: "Junto a la entrada",
    lat: 28.708470843292705,
    lng: -106.10645044086601,
  }, 
  {
    id: 4,
    nombre: "Administrativo",
    categoria: "admin",
    descripcion: "Trámites y atención a alumnos",
    lat: 28.70744747658663,
    lng: -106.10450897575176, 
  }, 
  {
    id: 5,
    nombre: "Sala Audiovisual",
    categoria: "aulas",
    descripcion: "Edificio B",
    lat:28.708748413096146,
    lng: -106.10489521385308,
    
  },
];

const iconosPorCategoria = {
  aulas: "🏫",
  banos: "🚻",
  cafeteria: "☕",
  admin: "🗂️",
};

// Estado actual de los filtros
let categoriaActiva = "todos";
let textoBusqueda = "";

const listaLugares = document.getElementById("listaLugares");
const sinResultados = document.getElementById("sinResultados");
const contador = document.getElementById("contador");
const buscador = document.getElementById("buscador");
const chips = document.querySelectorAll(".chip");

// ---------- Mapa (Leaflet) ----------

const mapa = L.map("mapa").setView(CENTRO_MAPA, 17);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; colaboradores de OpenStreetMap",
}).addTo(mapa);

// Un marcador por lugar; los guardamos por id para poder "volar" a ellos
const marcadoresPorId = {};

lugares.forEach((lugar) => {
  const marcador = L.marker([lugar.lat, lugar.lng]).addTo(mapa);
  marcador.bindPopup(`<strong>${lugar.nombre}</strong><br>${lugar.descripcion}`);
  marcadoresPorId[lugar.id] = marcador;
});

function irAlLugar(lugar) {
  mapa.flyTo([lugar.lat, lugar.lng], 18, { duration: 0.6 });
  marcadoresPorId[lugar.id].openPopup();
}

function filtrarLugares() {
  return lugares.filter((lugar) => {
    const coincideCategoria =
      categoriaActiva === "todos" || lugar.categoria === categoriaActiva;
    const coincideTexto = lugar.nombre
      .toLowerCase()
      .includes(textoBusqueda.toLowerCase());
    return coincideCategoria && coincideTexto;
  });
}

function renderLugares() {
  const resultado = filtrarLugares();

  listaLugares.innerHTML = "";

  resultado.forEach((lugar) => {
    const li = document.createElement("li");
    li.className = "lugar-card";
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.innerHTML = `
      <div class="lugar-icono">${iconosPorCategoria[lugar.categoria] || "📍"}</div>
      <div class="lugar-info">
        <h3>${lugar.nombre}</h3>
        <p>${lugar.descripcion}</p>
      </div>
    `;
    li.addEventListener("click", () => irAlLugar(lugar));
    li.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") irAlLugar(lugar);
    });
    listaLugares.appendChild(li);
  });

  sinResultados.hidden = resultado.length !== 0;
  contador.textContent = resultado.length
    ? `${resultado.length} ${resultado.length === 1 ? "resultado" : "resultados"}`
    : "";
}

// Buscador de texto
buscador.addEventListener("input", (evento) => {
  textoBusqueda = evento.target.value;
  renderLugares();
});

// Chips de categoría
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    categoriaActiva = chip.dataset.categoria;
    renderLugares();
  });
});

// Primera carga
renderLugares();