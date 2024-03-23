'use strict';

let isLoading = false;
let allPokemonLoaded = false;

let currentIndex = 0; // Índice para rastrear la cantidad de Pokémon ya mostrados
let currentGeneration = '';
let tipoSeleccionadoPorGeneracion = {};
let tipoSeleccionadoGlobal = ''; // Variable global para almacenar el tipo seleccionado
let openModal = false;

const generaciones = {
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

async function obtenerPokemons(generacion) {
    if (isLoading || allPokemonLoaded) return;

    isLoading = true;
    try {
        const { startIndex, endIndex } = generaciones[generacion];
        currentGeneration = generacion;

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

        // Incrementar currentIndex para la próxima carga
        currentIndex += limit;

        // Aplicar el filtro por tipo después de cargar los Pokémon
        aplicarFiltroPorTipo();

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    } finally {
        isLoading = false;
    }
}

const tiposUnicos = new Set();

async function renderizarPokemones(pokemones) {
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

        currentIndex = 0;

        // Guardar el tipo seleccionado antes de cambiar de generación
        const tipoSeleccionado = selectTipo.value.toLowerCase();

        // Al cambiar de generación, limpiar el tipo seleccionado por generación y cargar los Pokémon de esa generación
        tipoSeleccionadoPorGeneracion[currentGeneration] = '';
        tipoSeleccionadoGlobal = '';
        await obtenerPokemons(generacion);

        // Restaurar el filtro por tipo después de cargar los Pokémon de la nueva generación
        selectTipo.value = tipoSeleccionado;
        tipoSeleccionadoPorGeneracion[currentGeneration] = selectTipo.value.toLowerCase();
        tipoSeleccionadoGlobal = selectTipo.value.toLowerCase();
        aplicarFiltroPorTipo();
    });
});


window.addEventListener('load', () => {
    const primerEnlace = document.querySelector('nav a:first-child');
    primerEnlace.classList.add('active');
    obtenerPokemons('gen1');

    const buscador = document.getElementById('buscador');

    buscador.addEventListener('input', () => {
        const term = buscador.value.toLowerCase();
        const articles = document.querySelectorAll('.contenedor article');

        articles.forEach(article => {
            const nombre = article.querySelector('.nombre').textContent.toLowerCase();
            const numero = article.querySelector('.numero').textContent;

            if (nombre.includes(term) || numero.includes(term)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    });
});

const selectTipo = document.querySelector('.filtroTipo');

// Manejar el cambio en el filtro de tipo
selectTipo.addEventListener('change', () => {
    // Al cambiar el filtro por tipo, almacenar el tipo seleccionado a nivel de generación y globalmente y aplicar el filtro
    tipoSeleccionadoPorGeneracion[currentGeneration] = selectTipo.value.toLowerCase();
    tipoSeleccionadoGlobal = selectTipo.value.toLowerCase();
    aplicarFiltroPorTipo();
});


// Función para aplicar el filtro por tipo
function aplicarFiltroPorTipo(inmediato = false) {
    const tipoSeleccionado = tipoSeleccionadoPorGeneracion[currentGeneration] || tipoSeleccionadoGlobal || ''; // Obtener el tipo seleccionado para la generación actual o globalmente, si no hay ninguno seleccionado, usar cadena vacía
    const articles = document.querySelectorAll('.contenedor article');

    const aplicarFiltro = () => {
        articles.forEach(article => {
            const tiposPokemon = article.querySelector('.tipos').textContent.toLowerCase();

            // Mostrar el elemento si coincide con el tipo seleccionado o si no hay tipo seleccionado
            // Ocultar el elemento si no coincide con el tipo seleccionado y hay un tipo seleccionado
            article.style.display = (tipoSeleccionado === '' || tiposPokemon.includes(tipoSeleccionado)) ? 'block' : 'none';
        });
    };

    aplicarFiltro();
}

function mostrarModal(pokemon) {
    openModal = true;
    const tipoPrincipal = pokemon.types.length > 0 ? pokemon.types[0].type.name.toLowerCase() : 'unknown';

    document.body.classList.add('modal-open');

    document.querySelector('.modal-open').style.setProperty('--color', 'rgba(0, 0, 0, 0.5)');
    
    const modalContent = document.querySelector('.modal-content');
    const modalType = document.querySelector('.modalPokemonType');
    // Limpiar todas las clases existentes en modalContent
    modalContent.className = 'modal-content';
    modalType.className = 'modalPokemonType';
    // Agregar la nueva clase del tipo principal
    modalContent.classList.add(tipoPrincipal);
    modalType.classList.add(tipoPrincipal);

    document.getElementById('modal').classList.add('open'); // Agrega la clase 'open' para mostrar el modal

    document.getElementById('modalPokemonName').textContent = pokemon.name;
    document.getElementById('modalPokemonImage').src = pokemon.sprites.front_default;
    document.getElementById('modalPokemonType').textContent = tipoPrincipal;
    document.getElementById('caracteristica-peso').textContent = pokemon.weight / 10 + " kg";
    document.getElementById('caracteristica-altura').textContent = pokemon.height / 10 + " m";

    pokemon.stats.forEach(stat => {

        const statValue = stat.base_stat;
        switch (stat.stat.name) {

            case 'hp':
                const hpBar = document.querySelector('.container-perfomances #hp');
                hpBar.style.setProperty('--stat-width', statValue + '%'); // Establece una propiedad CSS personalizada
                hpBar.style.setProperty('--color', '#ff6600');
                break;
            case 'attack':
                const attackBar = document.querySelector('.container-perfomances #ataque');
                attackBar.style.setProperty('--stat-width', statValue + '%'); // Establece una propiedad CSS personalizada para el ancho del ataque
                attackBar.style.setProperty('--color', '#00BFFF');
                break;
            case 'defense':
                const defenseBar = document.querySelector('.container-perfomances #defensa');
                defenseBar.style.setProperty('--stat-width', statValue + '%'); // Establece una propiedad CSS personalizada para el ancho del ataque
                defenseBar.style.setProperty('--color', '#EA899A');
                break;
            case 'special-attack':
                const specialAttackBar = document.querySelector('.container-perfomances #ataque-especial');
                specialAttackBar.style.setProperty('--stat-width', statValue + '%');
                specialAttackBar.style.setProperty('--color', '#BDECB6');
                break;

            case 'special-defense':
                const specialDefenseBar = document.querySelector('.container-perfomances #defensa-especial');
                specialDefenseBar.style.setProperty('--stat-width', statValue + '%');
                specialDefenseBar.style.setProperty('--color', '#00aae4');
                break;
            case 'speed':
                const speedBar = document.querySelector('.container-perfomances #velocidad-especial');
                speedBar.style.setProperty('--stat-width', statValue + '%');
                speedBar.style.setProperty('--color', '#2596be');
                break;
        }
    });
}

function cerrarModal() {
    document.getElementById('modal').classList.remove('open'); // Remueve la clase 'open' para ocultar el modal
    document.querySelector('.modal-open').style.setProperty('--color', 'transparent');
    document.body.classList.remove('modal-open');
    openModal = false;
}
