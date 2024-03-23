import { openModal } from "./variables.js";

export function mostrarModal(pokemon) {
    window.openModal = true;
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

export function cerrarModal() {
    document.getElementById('modal').classList.remove('open'); // Remueve la clase 'open' para ocultar el modal
    document.querySelector('.modal-open').style.setProperty('--color', 'transparent');
    document.body.classList.remove('modal-open');
    window.openModal = false;
}