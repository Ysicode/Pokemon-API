
let startLoadingRange = 0;
let endLoadingRange = 50;
let color;
let id;
let allPokemons = [];
let liked = [];

document.addEventListener('keydown', keyDown);

function keyDown(e) {
    if (e.key === "Enter") {
        renderSearch();
        closeSearch();
    }
}

function refreshAllPokemons() {
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    startLoadingRange = 0;
    endLoadingRange = 50;
    showLoadMoreButton();
    renderAllPokemons();
}

async function getAllPokemons() {
    for (let i = 1; i < 650; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        allPokemons.push(currentPokemon);
        if (i == 50) {
            renderAllPokemons();
        }
    }
}

function renderAllPokemons() {
    refreshLikeHeart();
    let content = document.getElementById('start_pokemon_cards');
    for (let i = startLoadingRange; i < endLoadingRange; i++) {
        const pokemon = allPokemons[i];
        let name = pokemon['name'];
        let number = pokemon['id'];
        let pokemonPic = allPokemons[i]['sprites']['other']['dream_world']['front_default'];
        content.innerHTML += showAllPokemons(i, name, number, pokemonPic);
    }
}

function getBackgroundColourAtListView(i) {
    let backgroundColor = '';
    backgroundColor = allPokemons[i]['types'][0]['type']['name']
    return backgroundColor;
}

function renderPokemonCardAtListView(i) {
    let typeStyle = '';
    let types = allPokemons[i]['types'];
    for (let j = 0; j < types.length; j++) {
        let type = types[j]['type']['name'];
        typeStyle += setTypeOfSelection(j, i, type);
    }
    return typeStyle;
}

function loadMore() {
    startLoadingRange += 50;
    if (allPokemons.length - endLoadingRange <= 50) {
        endLoadingRange = allPokemons.length;
        removeLoadMoreButton();
    } else {
        endLoadingRange += 50;
    }
    renderAllPokemons();
}

function getLikes() {
    let likes = document.getElementById('likedPokemons');
    likes.innerHTML = '';
    let number = liked.length;
    likes.innerHTML = showLikesNumber(number);
}

function renderLikedPokemons() {
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    for (let i = 0; i < allPokemons.length; i++) {
        for (let j = 0; j < liked.length; j++) {
            if (allPokemons[i]['id'] == liked[j]) {
                showSearch(content, i);
            }
        }
    }
    removeLoadMoreButton();
    showLikesNumber();
}

function addLike() {
    liked.push(id + 1);
    changeHeartStyle();
}

function removeLike() {
    for (let i = 0; i < liked.length; i++) {
        const likedId = liked[i];
        if (likedId == id + 1) {
            liked.splice(i, 1);
        }
    }
    changeHeartStyle();
}

function renderPokemonCard() {
    changeHeartStyle();
    closeListView();
    openSingleView();
    renderPokemonStyle(id);
    let types = allPokemons[id]['types'];
    for (let j = 0; j < types.length; j++) {
        let type = types[j]['type']['name'];
        document.getElementById('types_line').innerHTML += setTypesOfCurrentPokemon(type, j);
    }
    renderPokemonInfo(id);
    setNewBackgroundColor(id);
}

function decrementPokemonShow() {
    if (id == 0) {
        id = 649;
    }
    id--;
    renderPokemonCard();
}

function incrementPokemonShow() {
    if (id == 648) {
        id = -1;
    }
    id++;
    renderPokemonCard();
}

function renderSearch() {
    let search = document.getElementById('inputfield').value;
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    search = search.toLowerCase();
    for (let i = 0; i < allPokemons.length; i++) {
        if (allPokemons[i].name.toLowerCase() == (search) ||
            allPokemons[i]['id'].toString() == (search) ||
            allPokemons[i].types[0].type['name'].toLowerCase() == (search)) {
            showSearch(content, i);
            closeSingleView();
        }
    }
    removeLoadMoreButton();
}

function showSearch(content, i) {
    let name = allPokemons[i]['name'];
    let number = allPokemons[i]['id'];
    let pokemonPic = allPokemons[i]['sprites']['other']['dream_world']['front_default'];
    content.innerHTML += showAllPokemons(i, name, number, pokemonPic);
}

function addPokemonsToSearch(i) {
    search.push(i);
    id = allPokemons[i].id - 1;
    searchIndex = 0;
}

function openPokemonCard(i) {
    id = i;
    closeSearch();
    renderPokemonCard();
}

function setInputValueForSelectedType(j) {
    document.getElementById('inputfield').value = '';
    let typeSearch = document.getElementById('inputfield');
    let inputvalue = allPokemons[id]['types'][[j]]['type']['name'];
    typeSearch.value = inputvalue;
    closeSingleView();
    renderSearch();
}

function renderPokemonInfo(id) {
    getWeights(id);
    getHeights(id);
    getMoves(id);
    renderPokemonStats(id);
}

function getHeights(id) {
    let cm = allPokemons[id]['height'];
    let ft = cm * 0.0328084;
    document.getElementById('height_cm').innerHTML = `${cm}cm`;
    document.getElementById('height_ft').innerHTML = `${ft.toFixed(2)}ft`;
}

function getWeights(id) {
    let kilo = allPokemons[id]['weight'];
    let pounds = kilo * 2.20462
    document.getElementById('weight_kg').innerHTML = `${allPokemons[id]['weight']}kg`;
    document.getElementById('weight_lbs').innerHTML = ` ${Math.floor(pounds.toFixed(2))}lbs`;
}

function getMoves(id) {
    let moves = allPokemons[id]['moves'];
    document.getElementById('moves').innerHTML = moves.length;
}

function renderPokemonStats(id) {
    let stats = allPokemons[id]['stats'];
    document.getElementById('stats').innerHTML = '';
    for (let k = 0; k < stats.length; k++) {
        getStatsAndPowerBars(stats, k);
    }
    checkHighestStat(stats);
}

function getStatsAndPowerBars(stats, k,) {
    const stat = stats[k]['stat']['name'];
    base_stat = stats[k]['base_stat'];
    let total = stats.map(sum => sum.base_stat).reduce((all, current) => all + current);
    document.getElementById('stat_total_power').innerHTML = `${total}`;
    document.getElementById('stats').innerHTML += getStats(stat, base_stat, k);
    setPowerBars(k, base_stat, total);
}

function setPowerBars(k, base_stat, total) {
    let totalBar = total * 100 / 1530;
    let powerBar = base_stat * 100 / 255;
    document.getElementById(`power_bar${k}`).style.width = `${Math.floor(powerBar.toFixed(2))}%`;
    document.getElementById('total_power_bar').style.width = `${Math.floor(totalBar.toFixed(2))}%`;
}

function checkHighestStat(stats) {
    let array_stats = stats.map(sum => sum.base_stat);
    let heighest_stat = Math.max(...array_stats);
    let index = array_stats.indexOf(heighest_stat);
    document.getElementById(`power_bar${index}`).classList.add(`type_${color}`);
}

function changeHeartStyle() {
    const filtered = liked.filter(element => element === id + 1);
    if (filtered == id + 1) {
        fillHeart();
    }
    else {
        removeFillHeart();
    }
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
    search = [];
    document.getElementById('search_icon').classList.add('d-none');
    document.getElementById('inputfield').classList.add('inputfield_open');
    document.getElementById('inputfield').focus();
}

function closeSearch() {
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
    changeHeartStyle();
    document.getElementById('likedPokemons').classList.add('d-none')
    document.getElementById('pokemon_card_top').classList.remove('d-none');
    document.getElementById('pokemon_card_bottom').classList.remove('d-none');
    document.getElementById('title').classList.add('d-none');
    document.getElementById('left_arrow').classList.remove('d-none');
    document.getElementById('navbar').classList.remove('navbarscroll');
}

function closeSingleView() {
    getLikes();
    refreshLikeHeart();
    setNavbarBackground();
    document.getElementById('likedPokemons').classList.remove('d-none')
    document.getElementById('pokemon_card_top_start').classList.remove('d-none');
    document.getElementById('pokemon_card_top').classList.add('d-none');
    document.getElementById('pokemon_card_bottom').classList.add('d-none');
    document.getElementById('title').classList.remove('d-none');
    document.getElementById('left_arrow').classList.add('d-none');
}

function renderPokemonStyle(id) {
    color = allPokemons[id]['types'][0]['type']['name'];
    document.getElementById('types_line').innerHTML = '';
    document.getElementById('current_name').innerHTML = allPokemons[id]['name'];
    document.getElementById('pokemon_card_pic').src = allPokemons[id]['sprites']['other']['dream_world']['front_default'];
    document.getElementById('pokemon_id').innerHTML = `#${allPokemons[id]['id']}`;
}

function setNewBackgroundColor() {
    let style = document.getElementById('pokemon_card_top');
    style.className = '';
    document.getElementById('pokemon_card_top').classList.add(`type_${color}`, 'pokemon_card_top');
}

function closeListView() {
    document.getElementById('pokemon_card_top_start').classList.add('d-none');
}

function fillHeart() {
    document.getElementById('heart_full').classList.remove('d-none');
    document.getElementById('heart_outline').classList.add('d-none');
}

function removeFillHeart() {
    document.getElementById('heart_outline').classList.remove('d-none');
    document.getElementById('heart_full').classList.add('d-none');
}

function showLoadMoreButton() {
    document.getElementById('load_more_button').classList.remove('d-none');
}

function removeLoadMoreButton() {
    document.getElementById('load_more_button').classList.add('d-none');
}

function refreshLikeHeart() {
    document.getElementById('heart_full').classList.add('d-none');
    document.getElementById('heart_outline').classList.remove('d-none')
}