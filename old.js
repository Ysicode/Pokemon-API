let currentPokemon;
let color;
let pokemonCardId = 1;
let allPokemons = [];
let search = [];
let searchIndex = 0;
let searchFunction = false;
let startLoadingRange = 0;
let endLoadingRange = 20;
let singleView = false;
let pokemonSearch = [];

function loadMore() {
    startLoadingRange += 80;
    if (allPokemons.length - endLoadingRange <= 80) {
        endLoadingRange = allPokemons.length;
        document.getElementById('_area_load_more_button').classList.add('d-none');
    }else {
        endLoadingRange += 80;
    }
    renderAllPokemons();
}

document.addEventListener('keydown', keyDown);

function keyDown(e) {
    if (e.key === "Enter") {
        filterPokemonCard();
    }
}

function decrementPokemonShow() {
    if (searchFunction === true) {
        if (searchIndex <= 0) {
            searchIndex = search.length;
        } else {
            searchIndex--;
        }
    }
    if (pokemonCardId == 1) {
        pokemonCardId = 649;
    } else {
        pokemonCardId--;
    }
    loadPokemon();
}

function incrementPokemonShow() {
    if (searchFunction === true) {
        if (searchIndex >= search.length) {
            searchIndex = 0;
        } else {
            searchIndex++;
        }
    }
    if (pokemonCardId == 649) {
        pokemonCardId = 1;
    } else {
        pokemonCardId++;
    }
    loadPokemon();
}

//Reading API
async function loadPokemon() {
    if (searchFunction == true) {
        pokemonCardId = search[`${searchIndex}`];
    }
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonCardId}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log(currentPokemon);
    renderPokemonCard();
}

async function getAllPokemons() {
    for (let i = 1; i < 650; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log(currentPokemon);
        allPokemons.push(currentPokemon);
        if (i == 20) {
            renderAllPokemons();
        }
    }
}
/////////////

function renderAllPokemons() {
    let content = document.getElementById('start_pokemon_cards');
    for (let i = startLoadingRange; i < endLoadingRange; i++) {
        const pokemon = allPokemons[i];
        let name = pokemon['name'];
        let number = pokemon['id'];
        let pokemonPic = allPokemons[i]['sprites']['other']['dream_world']['front_default'];
        content.innerHTML += showAllPokemons(i, name, number, pokemonPic);
    }
}

function setBackgroundPokemonCardAtStart(i) {
    let backgroundColor = '';
    backgroundColor = allPokemons[i]['types'][0]['type']['name']
    return backgroundColor;
}

function renderPokemonCardAtStart(index) {
    let typeStyle = '';
    let types = allPokemons[index]['types'];
    for (let i = 0; i < types.length; i++) {
        let type = types[i]['type']['name'];
        typeStyle += setTypeOfSelection(i, index, type);
    }
    return typeStyle;

}
//render pokemon card with main data and sets card style
function renderPokemonCard() {
    document.getElementById('pokemon_card_top_start').classList.add('d-none');
    openSingleView();
    renderPokemonStyle();
    let types = currentPokemon['types'];
    for (let i = 0; i < types.length; i++) {
        let type = types[i]['type']['name'];
        document.getElementById('types_line').innerHTML += setTypesOfCurrentPokemon(type, i);
    }
    renderPokemonInfo();
    setNewBackgroundColor();
}


//search function for name / type / id number
function filterPokemonCard() {
    let search = document.getElementById('inputfield').value;
    search = search.toLowerCase();
    for (let i = 0; i < allPokemons.length; i++) {
        if (allPokemons[i].name.toLowerCase().includes(search) ||
            allPokemons[i].types[0].type.name.toLowerCase().includes(search) ||
            allPokemons[i]['id'].toString() == search) {
            addPokemonsToSearch(i)
        } else {
            searchNotFoundAnimation();
        }
    }
}

function addPokemonsToSearch(i) {
    search.push(allPokemons[i].id);
    searchIndex = 0;
    if (searchFunction == true) {
        pokemonCardId = search[0];
    }
    loadPokemon();
    closeSearch();
}

function setInputValueForSelectedPokemon(i) {
    search = [];
    let inputvalue = allPokemons[i]['id'];
    console.log(allPokemons[i]['id']);
    pokemonCardId = inputvalue;
    let typeSearch = document.getElementById('inputfield');
    typeSearch.value = inputvalue;
    filterPokemonCard();
}

function setInputValueForSelectedType(i, index) {
    search = [];
    let typeSearch = document.getElementById('inputfield');
    if (singleView == true) {
        let inputvalue = currentPokemon['types'][[i]]['type']['name'];
        typeSearch.value = inputvalue;
    } else {
        let inputvalue = allPokemons[index]['types'][[i]]['type']['name'];
        typeSearch.value = inputvalue;
    }
    searchFunction = true;
    filterPokemonCard();
}
///////////

//render Pokemon Information with facts as size width an moves
function renderPokemonInfo() {
    getWeights();
    getHeights();
    getMoves();
    renderPokemonStats();
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

function getMoves() {
    let moves = currentPokemon['moves'];
    document.getElementById('moves').innerHTML = moves.length;
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
    document.getElementById(`power_bar${index}`).classList.add(`type_${color}`);
    console.log(color);
}
///////////

//styleFunctions
function likePokemon() {
    document.getElementById('heart_outline').classList.toggle('d-none');
    document.getElementById('heart_full').classList.toggle('d-none');
}

function setNavbarBackground() {
    let background = document.getElementById('pokemon_card_top_start');
    if (background.scrollTop > 100) {
        document.getElementById('navbar').classList.add('navbarscroll');
    } else {
        document.getElementById('navbar').classList.remove('navbarscroll');
    }
}

function openSearch() {
    searchFunction = true;
    search = [];
    document.getElementById('search_icon').classList.add('d-none');
    document.getElementById('inputfield').classList.add('inputfield_open');
    document.getElementById('inputfield').focus();
}

function closeSearch() {
    document.getElementById('inputfield').value = '';
    document.getElementById('inputfield').classList.remove('inputfield_open');
    document.getElementById('search_icon').classList.remove('d-none');
}

function searchNotFoundAnimation() {
    document.getElementById('inputfield').style.width = '40%';
    document.getElementById('inputfield').style.left = '30%';
    setTimeout(() => {
        document.getElementById('inputfield').style.width = '47%';
        document.getElementById('inputfield').style.left = '27%';
    }, 100);
}

function openSingleView() {
    singleView = true;
    document.getElementById('pokemon_card_top').classList.remove('d-none');
    document.getElementById('pokemon_card_bottom').classList.remove('d-none');
    document.getElementById('title').classList.add('d-none');
    document.getElementById('left_arrow').classList.remove('d-none');
    document.getElementById('navbar').classList.remove('navbarscroll');
}

function closeSingleView() {
    singleView = false;
    searchFunction = false;
    setNavbarBackground();
    document.getElementById('pokemon_card_top_start').classList.remove('d-none');
    document.getElementById('pokemon_card_top').classList.add('d-none');
    document.getElementById('pokemon_card_bottom').classList.add('d-none');
    document.getElementById('title').classList.remove('d-none');
    document.getElementById('left_arrow').classList.add('d-none');
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
    style.className = '';
    document.getElementById('pokemon_card_top').classList.add(`type_${color}`, 'pokemon_card_top');
}
