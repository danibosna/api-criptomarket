const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedasSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const criptoObj = {
  moneda: "",
  criptomoneda: "",
};

//crear un promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", validarFormulario);
  criptomonedasSelect.addEventListener("change", leerSelect);
  monedasSelect.addEventListener("change", leerSelect);
});

function validarFormulario(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = criptoObj;
  if (moneda === "" || criptomoneda === "") {
    imprimirAlerta("Ambos campos son obligatorios");
    return;
  }

  //consultar la API con los resultados
  consultaAPI();
}

async function consultaAPI() {
  const { moneda, criptomoneda } = criptoObj;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    mostrarCotizacionHTML(datos.DISPLAY[criptomoneda][moneda]);
  } catch (error) {
    console.log(error);
  }
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `Precio mas alto del dia <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `Precio mas bajo del dia <span>${LOWDAY}</span>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `Variacion en las ultimas 24hrs. <span>%${CHANGEPCT24HOUR}</span>`;

  const ultimaActualizacion = document.createElement("p");
  ultimaActualizacion.innerHTML = `Ultima actualizacion <span>${LASTUPDATE}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function imprimirAlerta(mensaje) {
  const existeError = document.querySelector(".error");

  if (!existeError) {
    const divError = document.createElement("div");
    divError.classList.add("error");
    divError.textContent = mensaje;

    formulario.appendChild(divError);

    setTimeout(() => {
      divError.remove();
    }, 3000);
  }
}

async function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const criptomonedas = await obtenerCriptomonedas(datos.Data);
    selectCriptomonedas(criptomonedas);
  } catch (error) {
    console.log(error);
  }
}

function selectCriptomonedas(criptomoneda) {
  criptomoneda.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerSelect(e) {
  criptoObj[e.target.name] = e.target.value;
  console.log(criptoObj);
}

function mostrarSpinner() {
  limpiarHTML();

  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");
  divSpinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

  resultado.appendChild(divSpinner);
}
