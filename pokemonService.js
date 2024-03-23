'use strict'

import { currentIndex, allPokemonLoaded, generaciones, currentGeneration, tipoSeleccionadoPorGeneracion } from "./variables.js";
import { renderizarPokemones } from "./renderizador.js";
import { aplicarFiltroPorTipo } from "./filtro.js";

let isLoading = false;

export async function obtenerPokemons(generacion) {
    if (isLoading || allPokemonLoaded) return;

    isLoading = true;

    document.getElementById('loading').style.display = 'block';
    
    try {
        const { startIndex, endIndex } = generaciones[generacion];

        window.currentGeneration = generacion;
        const limit = endIndex - startIndex + 1; // Cantidad total de Pokémon en la generación

        const offset = startIndex - 1 + currentIndex;

        const request = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const data = await request.json();

        if (data.results.length === 0) {
            allPokemonLoaded = true;
            console.log('Todos los Pokémon del rango han sido cargados.');
            return;
        }

        const pokemonDetails = await Promise.all(data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return response.json();
        }));

        renderizarPokemones(pokemonDetails);

        isLoading = false;
        document.getElementById('loading').style.display = 'none';
        // Incrementar currentIndex para la próxima carga
        window.currentIndex += limit;

        // Aplicar el filtro por tipo después de cargar los Pokémon
        aplicarFiltroPorTipo();

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    } finally {
        isLoading = false;
    }
}
// Manejar el clic en los enlaces de generación
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', async (event) => {
        event.preventDefault();

        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });

        event.target.classList.add('active');
        const generacionId = event.target.id;
        const generacion = 'gen' + generacionId.slice(-1);

        window.currentIndex = 0; // Debes definir currentIndex

        const selectTipo = document.querySelector('.filtroTipo'); // Debes definir selectTipo aquí

        // Guardar el tipo seleccionado antes de cambiar de generación
        const tipoSeleccionado = selectTipo.value.toLowerCase();

        // Al cambiar de generación, limpiar el tipo seleccionado por generación y cargar los Pokémon de esa generación
        tipoSeleccionadoPorGeneracion[currentGeneration] = '';
        window.tipoSeleccionadoGlobal = '';
        await obtenerPokemons(generacion);

        // Restaurar el filtro por tipo después de cargar los Pokémon de la nueva generación
        selectTipo.value = tipoSeleccionado;
        tipoSeleccionadoPorGeneracion[currentGeneration] = selectTipo.value.toLowerCase();
        window.tipoSeleccionadoGlobal = selectTipo.value.toLowerCase();
        aplicarFiltroPorTipo();
    });
});