//VARIABLES
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");

//Seleccionamos el div padre de TODO el cual contiene al "a"
const listaCursos = document.querySelector("#lista-cursos");

let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
  //Cuando agregas un curso presionando "Agregar al carrito"
  listaCursos.addEventListener("click", agregarCurso);

  //Elimina cursos del carrito
  carrito.addEventListener("click", eliminarCurso);

  //Muestra los cursos del localStorage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoHTML();
  });

  //Vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; //Reseteamos el arreglo
    limpiarHTML(); //Eliminamos todo el HTML
  });
}

//FUNCIONES
function agregarCurso(e) {
  e.preventDefault(); //Prevenimos el evento por default del href que al hacer click en el boton nos mueve a la parte superior de la p.web

  //Le doy click al "a", ASI PREVENIMOS EL "EVENT BUBBLING"
  if (e.target.classList.contains("agregar-carrito")) {
    //Subimos dos(2) niveles a: <div class="card">
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

//Funcion que elimina curso del carrito
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    //Elimina del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter(
      (eliminar) => eliminar.id !== cursoId
    );

    carritoHTML(); //Iterar sobre el carrito y mostrar su HTML
  }
}

//Lee el  contenido del HTML al que dimos click y extrae la información
function leerDatosCurso(curso) {
  //Crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  //Revisa si un elemento ya existe en el carrito, devuelve true o false
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);

  if (existe) {
    //Actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso;
      } else {
        return curso;
      }
    });
    articulosCarrito = [...cursos];
  } else {
    //Agrego el curso seleccionado al carrito "Array"
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito);

  carritoHTML();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {
  //Limpiamos el HTML, si no limpiamos se repiten los items selecionados anteriormente y tendriamos duplicados
  limpiarHTML();

  //Recorre el carrito y genera el HTML
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>

            <td>${titulo} </td>

            <td>${precio}</td>

            <td>${cantidad}</td>

            <td><a href="#" class="borrar-curso" data-id="${id}" }>X</a></td>
            
        `;

    //Agrega el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });

  //Agregar el carrito de compras al storage
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

//Limpia el HTML
function limpiarHTML() {
  //FORMA LENTA
  //contenedorCarrito.innerHTML = " ";

  //Lo recomendado para limpiar, ES MUCHO MÁS RAPIDO ES NOTORIA LA DIFERENCIA CON EL ANTERIOR !
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
