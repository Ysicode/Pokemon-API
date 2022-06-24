let startLoadingRange = 0;
let endLoadingRange = 50;
let color;
let id;
let allPokemons = [];
let liked = [];

/**
 * This function is used to toggle the filter Overlay at start Screen
 */
function toggleFilter() {
    document.getElementById('filter_overlay').classList.toggle('d-none');
    showStatsFilter();
}

/**
 * This function is used to display the stats array of one Pokemon object / which is the same at each Pokemon
 */
function showStatsFilter() {
    let stats = allPokemons[4]['stats'];
    let areaRange = document.getElementById('area_range');
    areaRange.innerHTML = '';
    for (let i = 0; i < stats.length; i++) {
        const stat = stats[i]['stat']['name'];
        areaRange.innerHTML += getStatsFilter(i, stat);
    }
}

/**
 * This function is used to filter all Pokemons by setting a range value
 * 
 * @param {number} i - gets the range at position 0 - 6
 */
function setValue(i) {
    for (let k = 0; k < 6; k++) {
        if (k != i) {
            document.getElementById(`rangebar${k}`).value = 0;
            document.getElementById(`stat_number${k}`).innerHTML = '0';
        }
    }
    let range = document.getElementById(`rangebar${i}`).value;
    document.getElementById(`stat_number${i}`).innerHTML = `${range}`;
    filterAllPokemons(i, range);
}

/**
 * This function is used to filter allPokemons Json objects by the value of one range bar and display them
 * 
 * @param {number} i - gets the range at position 0 - 6
 * @param {number} range - value of the rangebar
 */
function filterAllPokemons(i, range) {
    let filtered = allPokemons.filter(pokemon => pokemon.stats[i]['base_stat'] > `${range}`)
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    for (let i = 0; i < allPokemons.length; i++) {
        for (let j = 0; j < filtered.length; j++) {
            if (j <= 50) {
                if (allPokemons[i]['id'] == filtered[j]['id']) {
                    showSearch(content, i);
                    removeLoadMoreButton();
                }
            }
        }
    }
}

/**
 * This function is used to filter allPokemons Json objects for the selected type/button
 * 
 * @param {string} type - this is the selected type by clicking on one of the type/buttons
 */
function filterAllByType(type) {
    let filtered = allPokemons.filter(pokemon => pokemon.types[0].type.name == `${type}`)
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    for (let i = 0; i < allPokemons.length; i++) {
        for (let j = 0; j < filtered.length; j++) {
            if (allPokemons[i]['id'] == filtered[j]['id']) {
                showSearch(content, i);
            }
        }
    }
    removeLoadMoreButton();
    toggleFilter();
}

/**
 * This function is used to sort allPokemons Json objects by type name from a-z or z-a
 * 
 * @param {number} x - this parameter is either 1 to start with a or -1 to start with z 
 * @param {number} y - this parameter is either 1 to end with z or -1 to end with a 
 */
function sortByType(x, y) {
    let filtered = allPokemons.sort((a, b) => a.types[0]['type']['name'] > b.types[0]['type']['name'] ? `${x}` : `${y}`);
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    for (let i = startLoadingRange; i < endLoadingRange; i++) {
        for (let j = 0; j < filtered.length; j++) {
            if (allPokemons[i]['id'] == filtered[j]['id']) {
                showSearch(content, i);
            }
        }
    }
    toggleFilter();
}

/**
 * This function is used to sort allPokemons Json objects by name from a-z or z-a
 * 
 * @param {number} x - this parameter is either 1 to start with a or -1 to start with z 
 * @param {number} y - this parameter is either 1 to end with z or -1 to end with a 
 */
function sortByName(x, y) {
    let sorted = allPokemons.sort((a, b) => a.name > b.name ? `${x}` : `${y}`);
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    for (let i = startLoadingRange; i < endLoadingRange; i++) {
        for (let j = 0; j < sorted.length; j++) {
            if (allPokemons[i]['id'] == sorted[j]['id']) {
                showSearch(content, i);
            }
        }
    }
    toggleFilter();
}

/**
 * This function is used to sort allPokemons Json objects by name from a-z or z-a
 * 
 * @param {number} x - this parameter is either 1 to start with a or -1 to start with z
 * @param {number} y - this parameter is either 1 to end with z or -1 to end with a
 */
function sortById(x, y) {
    let filtered = allPokemons.sort((a, b) => a.id > b.id ? `${x}` : `${y}`);
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    for (let i = startLoadingRange; i < endLoadingRange; i++) {
        for (let j = 0; j < filtered.length; j++) {
            if (allPokemons[i]['id'] == filtered[j]['id']) {
                showSearch(content, i);
            }
        }
    }
    toggleFilter();
}

document.addEventListener('keydown', keyDown);

/**
 * This function is used to call a function render search by keydown of enter
 * 
 * @param {string} e - keydowm parameter
 */
function keyDown(e) {
    if (e.key === "Enter") {
        renderSearch();
        closeSearch();
    }
}

/**
 * This function is used to refresh the starting page by onclick on Logo
 */
function refreshAllPokemons() {
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    startLoadingRange = 0;
    endLoadingRange = 50;
    showLoadMoreButton();
    renderAllPokemons();
}

/**
 * This function is used to fetch one pokemon each time iterating trough a for loop 1 - 650. 
 * To fasten the display, When the loop run 50 times, first 50 pokemons will be displayed directly   
 */
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

/**
 * This function is used to render all object of the allPomeons Json array and display it at start page
 */
function renderAllPokemons() {
    removeFillHeart();
    let content = document.getElementById('start_pokemon_cards');
    for (let i = startLoadingRange; i < endLoadingRange; i++) {
        const pokemon = allPokemons[i];
        let name = pokemon['name'];
        let number = pokemon['id'];
        let pokemonPic = allPokemons[i]['sprites']['other']['dream_world']['front_default'];
        content.innerHTML += showAllPokemons(i, name, number, pokemonPic);
    }
}

/**
 * This function is used to set the background color of each object (pokemon) by calling the first type
 * 
 * @param {number} i - This parameter sets the position of each pokemon in the array
 * @returns 
 */
function getBackgroundColourAtListView(i) {
    let backgroundColor = '';
    backgroundColor = allPokemons[i]['types'][0]['type']['name']
    return backgroundColor;
}

/**
 *  This function is used to render all types of each object (pokemon) by iterating trough its types array
 * 
 * @param {number} i -  This parameter sets the position of each pokemon in the array
 * @returns 
 */
function renderPokemonCardAtListView(i) {
    let typeStyle = '';
    let types = allPokemons[i]['types'];
    for (let j = 0; j < types.length; j++) {
        let type = types[j]['type']['name'];
        typeStyle += setTypeOfSelection(j, i, type);
    }
    return typeStyle;
}

/**
 * This function is used to increment the number of displayed objects (pokemons) until 649
 * by setting new parameters to the function renderAllPokemons()
 *  
 */
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

/**
 * This function is used to display the length of likes array in the navbar hearticon
 */
function getLikes() {
    let likes = document.getElementById('likedPokemons');
    likes.innerHTML = '';
    let number = liked.length;
    likes.innerHTML = showLikesNumber(number);
}

/**
 * This function is used to render all liked objects (Pokemons)
 */
function renderLikedPokemons() {
    let noLikes = true;
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    getAllLikedPokemons(noLikes, content);
    removeLoadMoreButton();
    showLikesNumber();
}

/**
 * This function is used to iterate trough the likes array
 * If the array is empty, html content will be displayed
 * 
 * @param {boolean} noLikes - by default true (empty array) at false(display pokemons)
 * @param {string} content - varaibale to the div with id (start_pokemon_cards)
 */
function getAllLikedPokemons(noLikes, content) {
    for (let i = 0; i < allPokemons.length; i++) {
        for (let j = 0; j < liked.length; j++) {
            if (allPokemons[i]['id'] == liked[j]) {
                noLikes = false;
                showSearch(content, i);
            }
        }
    }
    if (noLikes) {
        content.innerHTML = showLikeSomePokemons();
    }
}

/**
 * This function is used to add the current global varaiable id +1 to the liked array 
 */
function addLike() {
    liked.push(id + 1);
    changeHeartStyle();
}

/**
 * This function is used to remove the current global varaiable id +1 from the liked array if true
 */
function removeLike() {
    for (let i = 0; i < liked.length; i++) {
        const likedId = liked[i];
        if (likedId == id + 1) {
            liked.splice(i, 1);
        }
    }
    changeHeartStyle();
}

/**
 * This function is used to render one pokemon at position of array (global varaibale id)
 */
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

/**
 * This function is used to decrement the global variable id and display then another object (pokemon)
 */
function decrementPokemonShow() {
    if (id == 0) {
        id = 649;
    }
    id--;
    renderPokemonCard();
}

/**
 * This function is used to increment the global variable id and display then another object (pokemon)
 */
function incrementPokemonShow() {
    if (id == 648) {
        id = -1;
    }
    id++;
    renderPokemonCard();
}

/**
 * This function is used to get the value of the search input field 
 */
function renderSearch() {
    let search = document.getElementById('inputfield').value;
    if (search == '') {
        refreshAllPokemons();
    } else {
        searchForNameTypeId(search);
        removeLoadMoreButton();
    }
}

/**
 * This function is used to display all objects (Pokemons) match to the search value
 * 
 * @param {string} search - This is the value of the search input field
 */
function searchForNameTypeId(search) {
    let notFound = true;
    let content = document.getElementById('start_pokemon_cards');
    content.innerHTML = '';
    search = search.toLowerCase();
    for (let i = 0; i < allPokemons.length; i++) {
        if (allPokemons[i].name.toLowerCase().startsWith(search) ||
            allPokemons[i]['id'].toString() == (search) ||
            allPokemons[i].types[0].type['name'].toLowerCase() == (search)) {
            notFound = false;
            showSearch(content, i);
            closeSingleView();
        }
    }
    if (notFound) {
        content.innerHTML = showSearchNotFound();
    }
}

/**
 * This function is used to display all search objects at starting page
 * 
 * @param {string} content - varaibale to the div with id (start_pokemon_cards)
 * @param {number} i - This parameter sets the position of each pokemon in the array
 */
function showSearch(content, i) {
    showLoadMoreButton();
    let name = allPokemons[i]['name'];
    let number = allPokemons[i]['id'];
    let pokemonPic = allPokemons[i]['sprites']['other']['dream_world']['front_default'];
    content.innerHTML += showAllPokemons(i, name, number, pokemonPic);
}

/**
 * Thsi function is used to display the selected object in a single view
 * 
 * @param {number} i - This parameter sets the position of each pokemon in the array
 */
function openPokemonCard(i) {
    id = i;
    closeSearch();
    renderPokemonCard();
}

/**
 * This function is used to get the selected type and puts it to the value of the search input field
 * 
 * @param {*} j - This parameter sets the position of the selected type at types array
 */
function setInputValueForSelectedType(j) {
    document.getElementById('inputfield').value = '';
    let typeSearch = document.getElementById('inputfield');
    let inputvalue = allPokemons[id]['types'][j]['type']['name'];
    typeSearch.value = inputvalue;
    closeSingleView();
    renderSearch();
}
/**
 * this function is used to render all informations from the object (Pokemon)
 * 
 * @param {number} id - its the selected number of the allPokemons array
 */
function renderPokemonInfo(id) {
    getWeights(id);
    getHeights(id);
    getMoves(id);
    renderPokemonStats(id);
}

/**
 * this function is used to get the heights from the object (Pokemon)
 * 
 * @param {number} id - its the selected number of the allPokemons array
 */
function getHeights(id) {
    let cm = allPokemons[id]['height'];
    let ft = cm * 0.0328084;
    document.getElementById('height_cm').innerHTML = `${cm}cm`;
    document.getElementById('height_ft').innerHTML = `${ft.toFixed(2)}ft`;
}

/**
 * this function is used to get the weights from the object (Pokemon)
 * 
 * @param {number} id - its the selected number of the allPokemons array
 */
function getWeights(id) {
    let kilo = allPokemons[id]['weight'];
    let pounds = kilo * 2.20462
    document.getElementById('weight_kg').innerHTML = `${allPokemons[id]['weight']}kg`;
    document.getElementById('weight_lbs').innerHTML = ` ${Math.floor(pounds.toFixed(2))}lbs`;
}

/**
 * this function is used to get the length of moves from the object (Pokemon)
 * 
 * @param {number} id - its the selected number of the allPokemons array
 */
function getMoves(id) {
    let moves = allPokemons[id]['moves'];
    document.getElementById('moves').innerHTML = moves.length;
}

/**
 * this function is used to get all stats from the object (Pokemon)
 * 
 * @param {number} id - its the selected number of the allPokemons array
 */
function renderPokemonStats(id) {
    let stats = allPokemons[id]['stats'];
    document.getElementById('stats').innerHTML = '';
    for (let k = 0; k < stats.length; k++) {
        getStatsAndPowerBars(stats, k);
    }
    checkHighestStat(stats);
}

/**
 * This function is used to set power bars and calculate the total from the stats array of the object (Pokemon)
 * 
 * @param {string} stats - is the name of the stat
 * @param {number} k - This parameter sets the position of each stat in the stat array
 */
function getStatsAndPowerBars(stats, k,) {
    const stat = stats[k]['stat']['name'];
    base_stat = stats[k]['base_stat'];
    let total = stats.map(sum => sum.base_stat).reduce((all, current) => all + current);
    document.getElementById('stat_total_power').innerHTML = `${total}`;
    document.getElementById('stats').innerHTML += getStats(stat, base_stat, k);
    setPowerBars(k, base_stat, total);
}

/**
 * This function is used to calculate the percentage of the stat from 255
 * 
 * @param {number} k - position at the stat array
 * @param {string} base_stat - number of the stat
 * @param {number} total - calculated total amount of all stats
 */
function setPowerBars(k, base_stat, total) {
    let totalBar = total * 100 / 1530;
    let powerBar = base_stat * 100 / 255;
    document.getElementById(`power_bar${k}`).style.width = `${Math.floor(powerBar.toFixed(2))}%`;
    document.getElementById('total_power_bar').style.width = `${Math.floor(totalBar.toFixed(2))}%`;
}

/**
 * Thsi function is used to check the highest stat of each object (Pokemon)
 * 
 * @param {string} stats - varaiable fro the stats array
 */
function checkHighestStat(stats) {
    let array_stats = stats.map(sum => sum.base_stat);
    let heighest_stat = Math.max(...array_stats);
    let index = array_stats.indexOf(heighest_stat);
    document.getElementById(`power_bar${index}`).classList.add(`type_${color}`);
}

/**
 * This function is used to check if a object is already liked or not by filter the liked array
 */
function changeHeartStyle() {
    const filtered = liked.filter(element => element == id + 1);
    if (filtered == id + 1) {
        fillHeart();
    }
    else {
        removeFillHeart();
    }
}

/**
 * This function is used to set a different navbar background on scrolling
 */
function setNavbarBackground() {
    let background = document.getElementById('pokemon_card_top_start');
    if (background.scrollTop > 100) {
        document.getElementById('navbar').classList.add('navbarscroll');
    } else {
        document.getElementById('navbar').classList.remove('navbarscroll');
    }
}

/**
 * This function is used show the search input field
 */
function openSearch() {
    hideElement('search_icon');
    document.getElementById('inputfield').classList.add('inputfield_open');
    document.getElementById('inputfield').focus();
}

/**
 * This function is used hide the search input field
 */
function closeSearch() {
    document.getElementById('inputfield').classList.remove('inputfield_open');
    showElement('search_icon');
}

/**
 * This function is used to animate an invalid search value
 */
function searchNotFoundAnimation() {
    document.getElementById('inputfield').style.width = '40%';
    document.getElementById('inputfield').style.left = '30%';
    setTimeout(() => {
        document.getElementById('inputfield').style.width = '47%';
        document.getElementById('inputfield').style.left = '27%';
    }, 100);
}

/**
 * This function is used to show the single view of an object (Pokemon)
 */
function openSingleView() {
    changeHeartStyle();
    hideElement('filter_button');
    hideElement('likedPokemons');
    hideElement('title');
    showElement('pokemon_card_top');
    showElement('pokemon_card_bottom');
    showElement('left_arrow');
    showElement('navbar');
    document.getElementById('navbar').classList.remove('navbarscroll')
}

/**
 * This function is used to hide the single view of an object (Pokemon)
 */
function closeSingleView() {
    getLikes();
    removeFillHeart();
    setNavbarBackground();
    showElement('title');
    showElement('filter_button');
    showElement('likedPokemons');
    showElement('pokemon_card_top_start');
    hideElement('pokemon_card_top');
    hideElement('pokemon_card_bottom');
    hideElement('left_arrow');
}

/**
 * This function is used to set the style of an object (Pokemon) with name,photo
 */
function renderPokemonStyle() {
    color = allPokemons[id]['types'][0]['type']['name'];
    document.getElementById('types_line').innerHTML = '';
    document.getElementById('current_name').innerHTML = allPokemons[id]['name'];
    document.getElementById('pokemon_card_pic').src = allPokemons[id]['sprites']['other']['dream_world']['front_default'];
    document.getElementById('pokemon_id').innerHTML = `#${allPokemons[id]['id']}`;
}

/**
 *  This function is used to set the background color of an object (Pokemon)
 */
function setNewBackgroundColor() {
    let style = document.getElementById('pokemon_card_top');
    style.className = '';
    document.getElementById('pokemon_card_top').classList.add(`type_${color}`, 'pokemon_card_top');
}

/**
 *  This function is used to hide the list view at start
 */
function closeListView() {
    hideElement('pokemon_card_top_start');
}

/**
 * This function is used to show a filled heart style
 */
function fillHeart() {
    showElement('heart_full');
    hideElement('heart_outline');
}

/**
 * This function is used to show a outlined heart style
 */
function removeFillHeart() {
    showElement('heart_outline');
    hideElement('heart_full');
}

/**
 * This function is used to show the load more button
 */
function showLoadMoreButton() {
    showElement('load_more_button');
}

/**
 * This function is used to hide the load more button
 */
function removeLoadMoreButton() {
    hideElement('load_more_button');
}

/**
 * This function is a template function to hide elements with an id
 * 
 * @param {string} id - is the string of the id element
 */
function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
}

/**
 * This function is a template function to show elements with an id
 * 
 * @param {string} id 
 */
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}

function addJSON() {
    allPokemons[0]['liked'] = true;
    allPokemons[0]['species']['morenames'] = ['Simon, Malia'];
    console.log(allPokemons[0]['species']['morenames']);
    allPokemons[0]['species']['name'] = 'Simon';
    allPokemons[0]['species']['morenames'][1] = 'Simon, Jonas';
    console.log(allPokemons[0]);
}