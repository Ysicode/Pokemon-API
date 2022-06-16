function getStats(stat, base_stat, i) {
    return `
    <div class="stat d-flex_start" id="stat">
        <p id="stat_type" class="stat_type">${stat}</p>
        <p id="stat_power" class="stat_power">${base_stat}</p>
        <div class="stat_power_bar" id="stat_power_bar${i}">
            <div id="power_bar${i}" class="power_bar"></div>
        </div>
    </div>
 `
}

function setTypesOfCurrentPokemon(type, i) {
    return `
    <div onclick="setInputValueForSelectedType(${i})" id="type" class="type_bg d-flex type_${type}">
        <img class="type_icon_pokemon_card" id="type_icon_pokemon_card" src="img/${type}.png" alt="">
        <p class="type_pokemon_card" id="type_pokemon_card">${type}</p>
    </div>
    `
}

