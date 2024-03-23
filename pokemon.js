'use strict';
import { obtenerPokemons  } from "./pokemonService.js";
import { cerrarModal } from "./modal.js";

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


document.getElementById('close').addEventListener('click', cerrarModal);
