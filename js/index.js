/* =========================================================
   MapeoTec — lógica básica (sin backend todavía)
   Datos de ejemplo: esto luego vendrá de la API/base de datos
   ========================================================= */

const lugares = [
  {
    id: 1,
    nombre: "Edificio A — Aulas",
    categoria: "aulas",
    descripcion: "Salones de clase, planta baja y primer piso",
  },
  {
    id: 2,
    nombre: "Cafetería Central",
    categoria: "cafeteria",
    descripcion: "Comida y bebidas, abierto en horario de clases",
  },
  {
    id: 3,
    nombre: "Baños — Edificio A",
    categoria: "banos",
    descripcion: "Junto a la entrada principal",
  },
  {
    id: 4,
    nombre: "Dirección Académica",
    categoria: "admin",
    descripcion: "Trámites y atención a alumnos",
  },
  {
    id: 5,
    nombre: "Sala Audiovisual",
    categoria: "aulas",
    descripcion: "Edificio B, planta alta",
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
    li.innerHTML = `
      <div class="lugar-icono">${iconosPorCategoria[lugar.categoria] || "📍"}</div>
      <div class="lugar-info">
        <h3>${lugar.nombre}</h3>
        <p>${lugar.descripcion}</p>
      </div>
    `;
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
