
let currentPokemon;
let color;

let pokemonCardId = 1;


function decrementPokemonShow() {
    if (pokemonCardId == 1) {
        pokemonCardId = 649;
    } else {
        pokemonCardId--;
    }
    loadPokemon();
}

function incrementPokemonShow() {
    if (pokemonCardId == 649) {
        pokemonCardId = 1;
    } else {
        pokemonCardId++;
    }
    loadPokemon();
}


async function loadPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonCardId}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log('loaded', currentPokemon);

    renderPokemonCard();
}


//render pokemon card with main data and sets card style
function renderPokemonCard() {
    renderPokemonStyle();
    let types = currentPokemon['types'];
    for (let i = 0; i < types.length; i++) {
        let type = currentPokemon['types'][i]['type']['name'];
        document.getElementById('types_line').innerHTML += setTypesOfCurrentPokemon(type);
    }
    renderPokemonInfo();
    setNewBackgroundColor();
}

function renderPokemonStyle() {
    color = currentPokemon['types'][0]['type']['name'];
    document.getElementById('types_line').innerHTML = '';
    document.getElementById('current_name').innerHTML = currentPokemon['name'];
    document.getElementById('pokemon_card_pic').src = currentPokemon['sprites']['other']['dream_world']['front_default'];
    document.getElementById('pokemon_id').innerHTML = `#${currentPokemon['id']}`;
}

function setNewBackgroundColor() {
    let style = document.getElementById('pokemon_card_top');
    style.className = ''
    document.getElementById('pokemon_card_top').classList.add(`type_${color}`, 'pokemon_card_top');
}


//render Pokemon Information with facts as size width an moves
function renderPokemonInfo() {
    getWeights();
    getHeights();
    getMoves();
    renderPokemonStats();
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
///////////


//Render Pokemon statistics and sets Power Bars
function renderPokemonStats() {
    let stats = currentPokemon['stats'];
    document.getElementById('stats').innerHTML = '';
    for (let i = 0; i < stats.length; i++) {
        getStatsAndPowerBars(stats, i);
    }
    checkHighestStat(stats);
}

function getStatsAndPowerBars(stats, i,) {
    const stat = stats[i]['stat']['name'];
    base_stat = stats[i]['base_stat'];
    let total = stats.map(sum => sum.base_stat).reduce((all, current) => all + current);
    document.getElementById('stat_total_power').innerHTML = `${total}`;      
    document.getElementById('stats').innerHTML += getStats(stat, base_stat, i);
    setPowerBars(i, base_stat, total);
}

function setPowerBars(i, base_stat, total) {
    let totalBar = total * 100 / 1530;
    let powerBar = base_stat * 100 / 255;
     document.getElementById(`power_bar${i}`).style.width = `${Math.floor(powerBar.toFixed(2))}%`;
     document.getElementById('total_power_bar').style.width = `${Math.floor(totalBar.toFixed(2))}%`;
}

function checkHighestStat(stats) {
    let array_stats = stats.map(sum => sum.base_stat);
    let heighest_stat = Math.max(...array_stats);
    let index = array_stats.indexOf(heighest_stat);
    console.log(index);
    document.getElementById(`power_bar${index}`).classList.add(`type_${color}`);
    console.log(color);
}
///////////



function likePokemon() {
    document.getElementById('heart_outline').classList.toggle('d-none');
    document.getElementById('heart_full').classList.toggle('d-none');
}
