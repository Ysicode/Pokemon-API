
 let currentPokemon;


 async function loadPokemon() {
     let url = 'https://pokeapi.co/api/v2/pokemon/242';
     let response = await fetch(url);
     currentPokemon = await response.json();
     console.log('loaded', currentPokemon);

     renderPokemonInfo();
 }

 function renderPokemonInfo() {
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
 }

 function likePokemon() {
     document.getElementById('heart_outline').classList.toggle('d-none');
     document.getElementById('heart_full').classList.toggle('d-none');
 }
