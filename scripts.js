const pokemonListElement = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const modalElement = document.getElementById("modal");

async function fetchAndDisplayPokemons() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=300");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const pokemons = data.results;
  
      await displayPokemons(pokemons);
  
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
        displayPokemons(filteredPokemons);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  function createPokemon(pokemon) {
    return {
      name: pokemon.name,
      type: pokemon.types.map(type => type.type.name),
      ThumbnailImage: pokemon.sprites.front_default,
      weight: pokemon.weight,
      abilities: pokemon.abilities.map(ability => ability.ability.name),
      weakness: [] // Puedes llenar esto según las debilidades de tipo
    };
  }


  
  function displayPokemon(pokemon) {
    const card = createCard(pokemon);
    pokemonListElement.appendChild(card);
  }
  
  async function displayPokemons(pokemons) {
    pokemonListElement.innerHTML = "";
  
    await Promise.all(pokemons.map(async pokemon => {
      const response = await fetch(pokemon.url);
      const pokemonData = await response.json();
      displayPokemon(createPokemon(pokemonData));
    }));
  }

function createCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card', 'm-1', 'text-center', 'justify-content-between');
  
    const typeCard = document.createElement('div');
    typeCard.classList.add('m-0', 'p-0');
    pokemon.type.forEach(type => {
      const iconElement = createTypeIcon(type);
      typeCard.appendChild(iconElement);
    });
  
    const imageElement = createImage(pokemon.ThumbnailImage, pokemon.name);
  
    const nameElement = document.createElement('h2');
    nameElement.textContent = pokemon.name;
  
    card.appendChild(typeCard);
    card.appendChild(imageElement);
    card.appendChild(nameElement);
  
    card.addEventListener("click", () => displayModal(pokemon));
  
    return card;
  }

  function createTypeIcon(typeName) {
    const typeToIconClass = {
      grass: 'fa-leaf',
      fire: 'fa-fire',
      water: 'fa-tint',
      bug: 'fa-bug',
      electric: 'fa-bolt',
      flying: 'fa-dove',
      dark: 'fa-moon',
      dragon: 'fa-dragon',
      ghost: 'fa-ghost',
      fighting: 'fa-fist-raised',
      ground: 'fa-mountain',
      ice: 'fa-icicles',
      normal: 'fa-paw',
      poison: 'fa-skull-crossbones',
      psychic: 'fa-brain',
      rock: 'fa-gem',
      steel: 'fa-cog',
      fairy: 'fa-magic'
    };
    
    const iconClass = typeToIconClass[typeName];
    
    if (iconClass) {
      const iconElement = document.createElement('i');
      iconElement.classList.add('fas', iconClass);
      return iconElement;
    } else {
      const unknownIconElement = document.createElement('i');
      unknownIconElement.classList.add('fas', 'fa-question');
      return unknownIconElement;
    }
  }

  function createImage(imageUrl, altText) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', imageUrl);
    imageElement.setAttribute('alt', altText);
    return imageElement;
  }

function displayModal(pokemon) {
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalImage = document.createElement("img");
  modalImage.classList.add("modal-image");
  modalImage.src = pokemon.ThumbnailImage;
  modalImage.alt = pokemon.name;

  const modalInfo = document.createElement("div");
  modalInfo.innerHTML = `
    <h2>${pokemon.name}</h2>
    <p>Type: ${pokemon.type.join(", ")}</p>
    <p>Weight: ${pokemon.weight} kg</p>
    <h3>Abilities:</h3>
    <ul>
      ${pokemon.abilities.map(ability => `<li>${ability}</li>`).join("")}
    </ul>
  `;

  modalContent.appendChild(modalImage);
  modalContent.appendChild(modalInfo);

  modalElement.innerHTML = "";
  modalElement.appendChild(modalContent);
  modalElement.classList.add("modal-open");
}

// Close modal when clicking outside of it
modalElement.addEventListener("click", () => {
  modalElement.classList.remove("modal-open");
});

// Load and display Pokémon data when the page loads
fetchAndDisplayPokemons();
