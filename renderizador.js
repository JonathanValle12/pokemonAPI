'use strict'

import { tipoSeleccionadoPorGeneracion, tipoSeleccionadoGlobal, currentGeneration, currentIndex } from "./variables.js";
import { mostrarModal } from "./modal.js";
const tiposUnicos = new Set();

export async function renderizarPokemones(pokemones) {
    const contenedor = document.querySelector('.contenedor');
    const selectTipo = document.querySelector('.filtroTipo');
    const tipoSeleccionado = tipoSeleccionadoPorGeneracion[currentGeneration] || tipoSeleccionadoGlobal;

    // Limpiar el contenedor si estamos mostrando los primeros Pokémon
    if (currentIndex === 0) {
        contenedor.innerHTML = '';
        selectTipo.innerHTML = '<option value="">Todos los tipos</option>';
        tiposUnicos.clear();
    }

    pokemones.forEach(pokemon => {
        const article = document.createElement('article');
        article.id = pokemon.id;

        const tipoPrincipal = pokemon.types.length > 0 ? pokemon.types[0].type.name.toLowerCase() : 'unknown';

        if (tipoPrincipal === tipoSeleccionado || tipoSeleccionado === '') {
            article.classList.add(tipoPrincipal, 'pokemon');
            article.innerHTML = `
                <header class="identificacion">
                    <p class="numero">#${pokemon.id}</p>
                    <div class="bola tipo-${tipoPrincipal}"></div>
                </header>
                <div class="circulo">
                    <img src="${pokemon.sprites.front_default}" alt="Imagen del Pokémon" />
                </div>
                <h2 class="nombre">${pokemon.name}</h2>
                <div class="container-caracteristicas">
                    <div>
                        <h3>Weight</h3>
                        <p class="peso">${pokemon.weight / 10} kg</p>
                    </div>
                    <div>
                        <h3>Height</h3>
                        <p class="altura">${pokemon.height / 10} m</p>
                    </div>
                </div>
                <p class="tipo">Type: <span class="tipos">${tipoPrincipal}</span></p>
            `;
            contenedor.appendChild(article);
        }

        tiposUnicos.add(tipoPrincipal);

        article.addEventListener('click', () => mostrarModal(pokemon));

    });

    tiposUnicos.forEach(tipo => {
        const option = document.createElement('option');
        option.textContent = tipo;
        option.value = tipo;
        selectTipo.appendChild(option);
    });

    selectTipo.value = tipoSeleccionado;
}