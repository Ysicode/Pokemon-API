
let currentPokemon;


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/34';
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log('loaded', currentPokemon);

    renderPokemonCard();
    renderPokemonStats();
}

function renderPokemonStats() {
    let stats = currentPokemon['stats'];
    for (let i = 0; i < stats.length; i++) {
        const stat = stats[i]['stat']['name'];
        base_stat = stats[i]['base_stat'];
        let total = stats.map(sum => sum.base_stat).reduce((all, current) => all + current);      
        document.getElementById('stats').innerHTML += `
            <div class="stat d-flex_start" id="stat">
                <p id="stat_type" class="stat_type">${stat}</p>
                <p id="stat_power" class="stat_power">${base_stat}</p>
                <div class="stat_power_bar" id="stat_power_bar${i}">
                    <div id="power_bar${i}" class="power_bar"></div>
                </div>
            </div>
         `;
         document.getElementById('stat_total_power').innerHTML = `${total}`;
         setPowerBars(i, base_stat, total);
    }
}

function setPowerBars(i, base_stat, total) {
    let totalBar = total * 100 / 1530;
    let powerBar = base_stat * 100 / 255;
     document.getElementById(`power_bar${i}`).style.width = `${Math.floor(powerBar.toFixed(2))}%`;
     document.getElementById('total_power_bar').style.width = `${Math.floor(totalBar.toFixed(2))}%`;
}



function renderPokemonCard() {
    let types = currentPokemon['types'];
    let type = currentPokemon['types'][0]['type']['name'];
    document.getElementById('pokemon_card_top').classList.add(`type_${type}`)
    document.getElementById('current_name').innerHTML = currentPokemon['name'];
    document.getElementById('pokemon_card_pic').src = currentPokemon['sprites']['other']['dream_world']['front_default'];
    document.getElementById('pokemon_id').innerHTML = `#${currentPokemon['id']}`;
    for (let i = 0; i < types.length; i++) {
        let type = currentPokemon['types'][i]['type']['name'];
        document.getElementById('types_line').innerHTML += `
            <div id="type" class="type_bg d-flex type_${type}">
                <img class="type_icon_pokemon_card" id="type_icon_pokemon_card" src="img/${type}.png" alt="">
                <p class="type_pokemon_card" id="type_pokemon_card">${type}</p>
            </div>
            `;
    }
    renderPokemonInfo();
}

function renderPokemonInfo() {
    getWeights();
    getHeights();
    getMoves();
}

function getMoves() {
    let moves = currentPokemon['moves'];
    document.getElementById('moves').innerHTML = moves.length;
}

function getHeights() {
    let cm = currentPokemon['height'];
    let ft = cm * 0.0328084;
    document.getElementById('height_cm').innerHTML = `${cm}cm`;
    document.getElementById('height_ft').innerHTML = `${ft.toFixed(2)}ft`;
}

function getWeights() {
    let kilo = currentPokemon['weight'];
    let pounds = kilo * 2.20462
    document.getElementById('weight_kg').innerHTML = `${currentPokemon['weight']}kg`;
    document.getElementById('weight_lbs').innerHTML = ` ${Math.floor(pounds.toFixed(2))}lbs`;
}




function likePokemon() {
    document.getElementById('heart_outline').classList.toggle('d-none');
    document.getElementById('heart_full').classList.toggle('d-none');
}
