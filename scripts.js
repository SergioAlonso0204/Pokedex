document.addEventListener("DOMContentLoaded", () => {
  const pokemonListElement = document.getElementById("pokemonList");
  const searchInput = document.getElementById("searchInput");
  const modalElement = document.getElementById("modal");
  const prevPageButton = document.getElementById("prevPageButton");
  const nextPageButton = document.getElementById("nextPageButton");
  const pageInfoElement = document.getElementById("pageInfo");

  let pokemons = []; // Almacena los Pokémon obtenidos
  let currentPage = 1;
  let totalPages = 1; // Agregado
  const itemsPerPage = 25; // Cantidad de Pokémon por página

  async function fetchAndDisplayPokemons(page) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${(page - 1) * itemsPerPage}&limit=${itemsPerPage}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      pokemons = data.results; // Almacena los resultados en la lista de Pokémon

      // Calcular el número total de páginas
      totalPages = Math.ceil(data.count / itemsPerPage);

      pokemonListElement.innerHTML = ""; // Limpia la lista antes de agregar nuevos Pokémon

      await Promise.all(pokemons.map(async pokemon => {
        const response = await fetch(pokemon.url);
        const pokemonData = await response.json();
        displayPokemon(createPokemon(pokemonData, pokemon.url));
      }));

      // Actualizar los botones de paginación
      updatePaginationButtons();
      updatePageInfo();

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function updatePageInfo() {
    const pageInfo = document.getElementById("pageInfo");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  function updatePaginationButtons() {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  }

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchAndDisplayPokemons(currentPage);
    }
  });

  nextPageButton.addEventListener("click", () => {
    currentPage++;
    fetchAndDisplayPokemons(currentPage);
  });



  function createPokemon(pokemon, url) {
    const number = extractPokemonNumberFromUrl(url);

    return {
      number: number,
      name: pokemon.name,
      type: pokemon.types.map(type => type.type.name),
      ThumbnailImage: pokemon.sprites.front_default,
      weight: pokemon.weight,
      abilities: pokemon.abilities.map(ability => ability.ability.name),
      weakness: [] // Puedes llenar esto según las debilidades de tipo
    };
  }

  function extractPokemonNumberFromUrl(url) {
    const regex = /\/(\d+)\/$/;
    const matches = url.match(regex);
    if (matches && matches[1]) {
      return matches[1];
    }
    return "???";
  }

  function displayPokemon(pokemon) {
    const card = createCard(pokemon);
    pokemonListElement.appendChild(card);
  }
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    displayPokemons(filteredPokemons);
  });

  async function displayPokemons(pokemon) {
    pokemonListElement.innerHTML = "";

    await Promise.all(pokemons.map(async pokemon => {
      const response = await fetch(pokemon.url);
      const pokemonData = await response.json();
      displayPokemon(createPokemon(pokemonData, pokemon.url));
    }));
  }

  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function createCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card', 'm-1', 'text-center', 'justify-content-between');

    const numberElement = createNumberElement(pokemon.number);
    const imageElement = createImage(pokemon.ThumbnailImage, pokemon.name);
    const nameElement = document.createElement('h2');
    nameElement.textContent = capitalizeFirstLetter(pokemon.name);

    const typeElement = createTypeElement(pokemon.type);

    card.appendChild(numberElement);
    card.appendChild(imageElement);
    card.appendChild(nameElement);
    card.appendChild(typeElement);

    card.addEventListener('click', () => displayModal(pokemon));

    return card;
  }

  function createNumberElement(number) {
    const numberElement = document.createElement('p');
    numberElement.textContent = '#' + number.toString().padStart(3, '0');
    return numberElement;
  }

  function createImage(imageUrl, altText) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', imageUrl);
    imageElement.setAttribute('alt', altText);
    return imageElement;
  }

  function createTypeElement(types) {
    const typeContainer = document.createElement('div');
    typeContainer.classList.add('card-type');

    types.forEach(type => {
      const typeElement = document.createElement('span');
      typeElement.textContent = type;
      typeContainer.appendChild(typeElement);
    });

    return typeContainer;
  }

  function displayModal(pokemon) {
    console.log("Modal opened for:", pokemon.name);
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
  
    const modalImage = createImage(pokemon.ThumbnailImage, pokemon.name);
    modalImage.classList.add("modal-image");
  
    const modalInfo = document.createElement("div");
    modalInfo.classList.add("modal-info");
    modalInfo.innerHTML = `
      <h2>${pokemon.name}</h2>
      <p>Type: ${pokemon.type.map(type => `<button class="card-type">${type}</button>`).join("")}</p>
      <p>Weight: ${pokemon.weight} kg</p>
      <h3>Abilities:</h3>
      <ul>
        ${pokemon.abilities.map(ability => `<li>${ability}</li>`).join("")}
      </ul>
    `;
  
    modalContent.appendChild(modalImage);
    modalContent.appendChild(modalInfo);
  
    modalElement.innerHTML = ""; // Limpia el contenido anterior
    modalElement.appendChild(modalContent);
    modalElement.classList.add("modal-open");
    modalElement.addEventListener("click", event => {
      if (event.target === modalElement) {
        modalElement.classList.remove("modal-open");
      }
    });
  }
  fetchAndDisplayPokemons();
});