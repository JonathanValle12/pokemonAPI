'use strict'
import { currentGeneration, tipoSeleccionadoPorGeneracion, tipoSeleccionadoGlobal } from "./variables.js";
const selectTipo = document.querySelector('.filtroTipo');

// Manejar el cambio en el filtro de tipo
selectTipo.addEventListener('change', () => {
    // Al cambiar el filtro por tipo, almacenar el tipo seleccionado a nivel de generación y globalmente y aplicar el filtro
    tipoSeleccionadoPorGeneracion[currentGeneration] = selectTipo.value.toLowerCase();
    window.tipoSeleccionadoGlobal = selectTipo.value.toLowerCase();
    aplicarFiltroPorTipo();
});

// Función para aplicar el filtro por tipo
export function aplicarFiltroPorTipo(inmediato = false) {
    const tipoSeleccionado = tipoSeleccionadoPorGeneracion[currentGeneration] || tipoSeleccionadoGlobal || ''; // Obtener el tipo seleccionado para la generación actual o globalmente, si no hay ninguno seleccionado, usar cadena vacía
    const articles = document.querySelectorAll('.contenedor article');

    const aplicarFiltro = () => {
        articles.forEach(article => {
            const tiposPokemon = article.querySelector('.tipos').textContent.toLowerCase();
             if(tipoSeleccionado === '' || tiposPokemon.includes(tipoSeleccionado)) {
                article.style.display = 'block';
             } else {
                article.style.display = 'none';
             }
        });
    };

    aplicarFiltro();
}