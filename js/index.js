const generarMapa = () => {
    ocultarFormulario();
    const tamanoParcela = 20; //tamaño de cada parcela 20x20 pixeles
    // Capturamos los valores del formulario
    const tamanoMapa = (parseInt(document.getElementById('tamanoMapa').value) * tamanoParcela); //el tamaño del mapa sera el numero de parcelas de 20px 
    const mapaGenerado = crearMapa(tamanoMapa); //creamos el mapa y lo obtenemos en una variable
    //obtenemos todas las variables
    const maximaAreaOcupada = parseInt(document.getElementById('maximaAreaOcupada').value);
    const totalAreasAsignadas = (maximaAreaOcupada/100) * tamanoMapa; //obtenemos el total de areas asignadas
    const minZonasNaturaleza = parseInt(document.getElementById('minZonasNaturaleza').value);
    const maxZonasNaturaleza = parseInt(document.getElementById('maxZonasNaturaleza').value);
    const tamanioMaxZonaNaturaleza = parseInt(document.getElementById('tamanioMaxZonaNaturaleza').value);
    const tamanioTotalMaxNaturaleza = parseInt(document.getElementById('tamanioTotalMaxNaturaleza').value);
    const minZonasUrbano = parseInt(document.getElementById('minZonasUrbano').value);
    const maxZonasUrbano = parseInt(document.getElementById('maxZonasUrbano').value);
    const tamanioMaxZonaUrbano = parseInt(document.getElementById('tamanioMaxZonaUrbano').value);
    const tamanioTotalMaxUrbano = parseInt(document.getElementById('tamanioTotalMaxUrbano').value);
    const minZonasComercial = parseInt(document.getElementById('minZonasComercial').value);
    const maxZonasComercial = parseInt(document.getElementById('maxZonasComercial').value);
    const tamanioMaxZonaComercial = parseInt(document.getElementById('tamanioMaxZonaComercial').value);
    const tamanioTotalMaxComercial = parseInt(document.getElementById('tamanioTotalMaxComercial').value);

    generarMallaParcelas(tamanoMapa, tamanoParcela, mapaGenerado);
    
    //creamos 3 variables que obtendran el resutado que devolvera la funcion asignarNumeroZonas
    const numZonasNaturaleza = asignarNumeroZonas(minZonasNaturaleza, maxZonasNaturaleza);
    const numZonasUrbano = asignarNumeroZonas(minZonasUrbano, maxZonasUrbano);
    const numZonasComercial = asignarNumeroZonas(minZonasComercial, maxZonasComercial);

    //llamamos a la funcion asignarParcelasAlMapa que inicializara el numero de parcelas por zona
    cantidadAreasAsignadas = asignarParcelasAlMapa(numZonasNaturaleza, "Naturaleza", tamanoMapa, tamanoParcela, totalAreasAsignadas, cantidadAreasAsignadas, tamanioMaxZonaNaturaleza, tamanioTotalMaxNaturaleza);
    cantidadAreasAsignadas = asignarParcelasAlMapa(numZonasUrbano, "Urbano",  tamanoMapa, tamanoParcela, totalAreasAsignadas, cantidadAreasAsignadas, tamanioMaxZonaUrbano, tamanioTotalMaxUrbano);
    asignarParcelasAlMapa(numZonasComercial, "Comercial", tamanoMapa, tamanoParcela, totalAreasAsignadas, cantidadAreasAsignadas, tamanioMaxZonaComercial,tamanioTotalMaxComercial);
    crecimiento(tamanoMapa, tamanoParcela);

};

let posiblesDireccionesCrecimiento = ["Horizontal derecha", "Horizontal izquierda", "Vertical arriba", "Vertical abajo", "Diagonal izquierda arriba", "Diagonal izquierda abajo", "Diagonal derecha arriba", "Diagonal derecha abajo"]; //array que contiene las diferente direciones en las que puede crecer una zona 

const crearMapa = (tamanoMapa) =>{ //geera el mapa en el html
    const mapa = document.createElement("div");
    mapa.className = "mapa-generado";
    mapa.style.position = "relative";
    mapa.style.width = tamanoMapa + "px";
    mapa.style.height = tamanoMapa + "px";
    document.querySelector("body").appendChild(mapa);
    return mapa;
}


const generarMallaParcelas = (tamanoMapa, tamanoParcela, mapaGenerado) =>{
    ocultarFormulario();
    for(let i = 0; i < tamanoMapa; i+=20){ //filas
        for(let j = 0; j < tamanoMapa; j+=20){ //columnas
            const parcela = document.createElement("p");
            parcela.style.width = tamanoParcela + "px";
            parcela.style.height = tamanoParcela + "px";
            parcela.style.position = "absolute";
            parcela.style.top = i + "px";
            parcela.style.marginLeft = j + "px";
            parcela.id = i + "x" + j;
            mapaGenerado.appendChild(parcela);
        }
    }
}

let idZona = 1;
let cantidadAreasAsignadas = 0; //cantidad de areas asignadas al mapa en un principio
let zonasAsignadas = [];
const asignarParcelasAlMapa = (numZonas, tipoZona, tamanoMapa, tamanoParcela, totalAreasAsignadas, cantidadAreasAsignadas, tamanioMaxZona, tamanioTotalMax) =>{ //, tamanioMaxZona, tamanioTotalMax) =>{
    for(let i = 0; i < numZonas; i++){ //recorremos el numero de zonas de cada tipo 
        let posicionX = calcularCoordenadaParcela(tamanoMapa, tamanoParcela); //generamos aleotoriamente unas coordenadas dentro del mapa
        let posicionY = calcularCoordenadaParcela(tamanoMapa, tamanoParcela);
        
        while(!parcelaLibre([posicionX, posicionY], idZona)){ //mientras no encuentre una zona valida
            posicionX = calcularCoordenadaParcela(tamanoMapa, tamanoParcela); //generera posiciones aleatorias dentro del mapa
            posicionY = calcularCoordenadaParcela(tamanoMapa, tamanoParcela);
        }

        if(cantidadAreasAsignadas <= totalAreasAsignadas){ //si la cantidad de areas asignadas es menor que total
            const parcela = document.getElementById(`${posicionX}x${posicionY}`); //obtenemos la parcela con dichas coordenadas
            parcela.innerHTML = idZona;
            parcela.style.backgroundColor = asignarColorZona(tipoZona);
            const zonaAsignada = {posicion : [posicionX, posicionY], id : idZona, zona : tipoZona, tamanio: tamanioMaxZona, tamanioTotal:tamanioTotalMax}; //creamos un objeto con la informacion de cada zona asignada
            zonasAsignadas.push(zonaAsignada); //creamos un array con esas zonas asignadas
            idZona++;
            cantidadAreasAsignadas++;
        }else{
            break;
        }
    }
    return cantidadAreasAsignadas;
}

const crecimiento = async(tamanoMapa, tamanoParcela) => {
    for (let i = 0; i < zonasAsignadas.length; i++) {
        let cantidadParcelasMaxPorMapa = 0;
        let posicion = zonasAsignadas[i].posicion;
        let posicionX = posicion[0];
        let posicionY = posicion[1];
        let idZona = zonasAsignadas[i].id;
        let tipoZona = zonasAsignadas[i].zona;
        let tamanioMaxZona = zonasAsignadas[i].tamanio;
        let tamanioTotalMax = zonasAsignadas[i].tamanioTotal;
        let tamanioMaxZonaAux = asignarNumeroParcelasZona(tamanioMaxZona); //asignamos para cada zona, su numero de parcelas, geerado aleatoriamente
        console.log(posicion, idZona, tipoZona, tamanioMaxZona, tamanioTotalMax);
        
        if (cantidadParcelasMaxPorMapa <= tamanioTotalMax) {
            let posicionNuevaParcela = [];
            for (let j = 0; j < tamanioMaxZonaAux; j++) {
                let posicion = [];
                if (posicionNuevaParcela.length !== 0) {
                    posicion = [posicionNuevaParcela[0], posicionNuevaParcela[1]];
                } else {
                    posicion = [posicionX, posicionY];
                }

                await new Promise(resolve => setTimeout(resolve, 50));

                posicionNuevaParcela = nuevaParcela(posiblesDireccionesCrecimiento[direccionAleatoria(posiblesDireccionesCrecimiento)], posicion[0], posicion[1]);

                if (esPosicionValida(posicionNuevaParcela, tamanoMapa, tamanoParcela) && parcelaLibre(posicionNuevaParcela, idZona)) {
                    const parcelaNueva = document.getElementById(`${posicionNuevaParcela[0]}x${posicionNuevaParcela[1]}`);
                    parcelaNueva.innerHTML = idZona;
                    parcelaNueva.style.backgroundColor = asignarColorZona(tipoZona);
                    cantidadParcelasMaxPorMapa++;
                } else {
                    break;
                }
            }
        }
    }
    generarNuevoMapa();
}


const esPosicionValida = (posiciones, tamanoMapa, tamanoParcela) =>{ //funcion que verifica que una parcela no se salga de los limites del mapa
    if(posiciones[0] < 0 || posiciones[1] < 0 || posiciones[0] > tamanoMapa-tamanoParcela || posiciones[1] > tamanoMapa-tamanoParcela){
        return false;
    }
    return true;
}

const parcelaLibre = (posicion, idZona) => {
    const parcela = document.getElementById(`${posicion[0]}x${posicion[1]}`); //obtenemos la nueva posicion
    const idZonaAux = parcela.innerHTML; //Obtenemos su conntenido
    if(idZonaAux === ""){ //si no contiene nada la parcela esta vacia, por tanto es una parcela valida, devolvemos true
        return true;
    }else if(idZonaAux !== "" && parseInt(idZonaAux) === idZona){ //si el id no esta vacio pero es de la misma zona, devolvemos true
        return true;
    }else if(idZonaAux !== "" && parseInt(idZonaAux) !== idZona){ //si el id no coincide con el de la zona, habremos llegado a otro zona, por tanto devolvemos false
        return false;
    }
};

let parcelasOcupadas = [];

const esParcelaDisponible = (posicionX, posicionY) =>{
    const posicionParcela = [posicionX, posicionY];
    for(let i = 0; i < parcelasOcupadas.length; i++){
        if(parcelasOcupadas[i].includes(posicionParcela)){
            return false;
        }
    }
    parcelasOcupadas.push(posicionParcela);
    return true;
}

const calcularCoordenadaParcela = (tamanoMapa, tamanoParcela) =>{
    const coordenada = (Math.floor(Math.random() * (tamanoMapa / tamanoParcela))) * tamanoParcela; //generamos aleotoriamente unas coordenadas dentro del mapa
    return coordenada;
}

const cambiarPosicion = (posicion) => posicion + 20;


function asignarColorZona(tipoZona) { //colores de las zonas
    switch (tipoZona) {
        case "Naturaleza":
            return '#33f7b6';
        case "Comercial":
            return '#f0e426';
        case "Urbano":
            return '#ffee60';
        default:
            return 'white'; 
    }
}

const asignarNumeroZonas = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const asignarNumeroParcelasZona = (tamanioMaxZonaNaturaleza) => Math.floor(Math.random() * tamanioMaxZonaNaturaleza); //asigna el numero maximo de parcelas por cada zona

const nuevaParcela = (direccion, posicionX, posicionY) =>{
    let posicionXAux = 0;
    let posicionYAux = 0;
    switch(direccion){
        case "Horizontal derecha": //crecimineto de la parcela hacia la derecha, es sumar 20px a el eje X, Y no varia
            posicionXAux = posicionX + 20;
            return [posicionXAux, posicionY]; //devolvemos un array con la posicion de la nueva parcela a crear
        case "Horizontal izquierda":
            posicionXAux = posicionX - 20;
            return [posicionXAux, posicionY];
        case "Vertical arriba":
            posicionYAux = posicionY - 20;
            return[posicionX, posicionYAux];
        case "Vertical abajo":
            posicionYAux = posicionY + 20;
            return[posicionX, posicionYAux];
        case "Diagonal izquierda arriba":
            posicionXAux = posicionX - 20;
            posicionYAux = posicionY - 20;
            return [posicionXAux, posicionYAux];
        case "Diagonal izquierda abajo":
            posicionXAux = posicionX + 20;
            posicionYAux = posicionY + 20;
            return [posicionXAux, posicionYAux];
        case "Diagonal derecha arriba":
            posicionXAux = posicionX - 20;
            posicionYAux = posicionY + 20;
            return [posicionXAux, posicionYAux];
        case "Diagonal derecha abajo":
            posicionXAux = posicionX - 20;
            posicionYAux = posicionY + 20;
            return [posicionXAux, posicionYAux];
        default:
            return [posicionX, posicionY];
    }
}

const direccionAleatoria = (posiblesDireccionesCrecimiento) =>{
    const direccion = Math.floor(Math.random() * posiblesDireccionesCrecimiento.length);
    return direccion;
}

const ocultarFormulario = () => {
    const body = document.querySelector("body");
    body.style.height = "100vh";
    const form = document.querySelector("form");
    form.style.display = "none";
}

  
const limpiarMapa = () => {
    document.querySelector(".mapa-generado").innerHTML = " ";
  };


const generarNuevoMapa = () =>{
    const enlanceFormulario = document.createElement("a");
    enlanceFormulario.className = "alFormulario";
    enlanceFormulario.href = "../index.html";
    enlanceFormulario.innerHTML = "Generar nuevo";
    enlanceFormulario.addEventListener('click', function(){
        setTimeout(limpiarMapa, 500);
    })
    document.querySelector("body").appendChild(enlanceFormulario);
}


  