'use strict'
export let allPokemonLoaded = false;
export let currentGeneration = '';
export let currentIndex = 0; // Índice para rastrear la cantidad de Pokémon ya mostrados
export let tipoSeleccionadoPorGeneracion = {};
export let tipoSeleccionadoGlobal = ''; // Variable global para almacenar el tipo seleccionado
export let openModal = false;

export const generaciones = {
    gen1: { startIndex: 1, endIndex: 151, limit: 151 }, // Ajuste del startIndex y endIndex
    gen2: { startIndex: 152, endIndex: 251, limit: 251 },
    gen3: { startIndex: 252, endIndex: 386, limit: 386 },
    gen4: { startIndex: 387, endIndex: 493, limit: 493 },
    gen5: { startIndex: 494, endIndex: 649, limit: 649 },
    gen6: { startIndex: 650, endIndex: 721, limit: 721 },
    gen7: { startIndex: 722, endIndex: 809, limit: 809 },
    gen8: { startIndex: 810, endIndex: 898, limit: 898 },
    gen9: { startIndex: 899, endIndex: 1000, limit: 1000 }
};