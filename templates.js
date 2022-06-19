function getStats(stat, base_stat, k) {
    return `
    <div class="stat d-flex_start" id="stat">
        <p id="stat_type" class="stat_type">${stat}</p>
        <p id="stat_power" class="stat_power">${base_stat}</p>
        <div class="stat_power_bar" id="stat_power_bar${k}">
            <div id="power_bar${k}" class="power_bar"></div>
        </div>
    </div>
 `
}

function setTypesOfCurrentPokemon(type, j) {
    return `
    <div onclick="setInputValueForSelectedType(${j})" id="type" class="type_bg d-flex type_${type}">
        <img class="type_icon_pokemon_card" id="type_icon_pokemon_card" src="img/${type}.png" alt="">
        <p class="type_pokemon_card" id="type_pokemon_card">${type}</p>
    </div>
    `
}


function showAllPokemons(i, name, number, pokemonPic) {
    return `
    <div onclick="openPokemonCard(${i})" class="d-none start_pokemon_card type_${getBackgroundColourAtListView(i)}" id="start_pokemon_card${i}">
    
    <div class="d-flex_space start_pokemon_card_headline">
        <h2 id="name_start" class="start_card_name">${name}</h2>
        <p id="id_start" class="start_card_number">#${number}</p>
    </div>
    <div onclick="event.stopPropagation() id="start_types_line" class="start_types_line">
        ${renderPokemonCardAtListView(i)}
    </div>
    <img class="start_pokemon_pic" id="start_pokemon_pic" src="${pokemonPic}" alt="">
    <img class="pokeball_card" src="img/pokeball.png" alt="">

</div>
    `
}


function setTypeOfSelection(j, i, type) {
    return `
    <div id="type" class="type_start d-flex type_${type}">
        <img class="icon_start_card" id="type_icon_pokemon_card" src="img/${type}.png" alt="">
        <p class="type_pokemon_card" id="type_pokemon_card">${type}</p>
    </div>
`
}

function showLikesNumber(number) {
    return `
    <img class="heart_liked_pokemons" src="img/heart_full.png" alt="">
            <p class="number_likes">${number}</p>
    `
}