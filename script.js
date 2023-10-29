let names = []; 
let labels = [];
let stats = [];
let limit = 20;
let ownedPokemon = [];
let nameUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;
let typeColor = 
[{'normal': 'rgba(169, 169, 169, 0.4)',
  'fire': 'rgba(255, 0, 0, 0.4)',
  'water': 'rgba(0, 0, 255, 0.4)',
  'grass': 'rgba(0, 128, 0, 0.4)',
  'electric': 'rgba(255, 255, 0, 0.4)',
  'ground': 'rgba(139, 69, 19, 0.4, 0.4)',
  'flying': 'rgba(135, 206, 235, 0.4)',
  'rock': 'rgba(139, 126, 102, 0.4)',
  'bug': 'rgba(124, 252, 0, 0.4)',
  'poison': 'rgba(128, 0, 128, 0.4)',
  'psychic': 'rgba(255, 182, 193, 0.4)',
  'fighting': 'rgba(255, 165, 0, 0.4)',
  'ice': 'rgba(173, 216, 230, 0.4)',
  'ghost': 'rgba(148, 0, 211, 0.4)',
  'dark': 'rgba(0, 0, 0, 0.4)',
  'dragon': 'rgba(139, 0, 0, 0.4)',
  'steel': 'rgba(192, 192, 192, 0.4)',
  'fairy': 'rgba(255, 182, 193, 0.4)',
}]

function init(){    
    loadPokemonOverview();
    
}

async function loadPokemonOverview(){
    let nameResponse = await fetch(nameUrl);
    let namesAsJSON = await nameResponse.json();

    document.getElementById('pokedex').innerHTML ='';
    
    for (let i = 0; i < namesAsJSON['results'].length; i++) {
        const name = namesAsJSON['results'][i]['name'];
        names.push();
       let id = i + 1;
        document.getElementById('pokedex').innerHTML += renderPokedex(i, id, name);
    }
  
}

async function loadMorePokemon(){
  limit = limit + 20;
  nameUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;
  loadPokemonOverview(nameUrl);
}

async function loadPokemonData(id){
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    let responseAsJSON = await response.json();
    console.log(responseAsJSON);
    let currentPokemon = responseAsJSON;
    loadStats(currentPokemon);
    openDetail(currentPokemon, id);
   
}

function openDetail(currentPokemon, id){
    let pokedex = document.getElementById('pokedex');
    pokedex.style.display = 'none';
    let detailContainer = document.getElementById('detail-container');
    detailContainer.style.display = 'flex';
    let weight = currentPokemon['weight'] / 10;
    let height = currentPokemon['height'] /10;
    const hp = stats[0];
    const atk = stats[1];
    const def = stats[2];
    const satk = stats[3];
    const sdef = stats[4];
    const spd = stats[5];
    let detail = document.getElementById('pokemon-detail-card');
    detail.innerHTML = `
        <div id="button-area">
          <button onclick="closeDetail(${id})"><img src="./img/back.png"></button>
          <button id="shiny-button" onclick="changeImg(${id})"><h4>shiny</h4></button>
        </div>
        <div id="name-number">
        <h1>${currentPokemon['name']}</h1>
        <h2>#${id}</h2>
        </div>
        <div id="types"></div>
        <div id="pokemon-img-container">
            <img id="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png">
        </div>
        
        
      <div class="bttn-container-btm">
        <button class="buttons-bottom" onclick="showInfo(${id})">Info</button>
        <button class="buttons-bottom" onclick="showStats()">Stats</button>
        <button class="buttons-bottom" onclick="showMoves(${id})">Moves</button>
      </div>  
        <div id="pokemon-info" style ="display: flex">
          <div id="info-label">
          <span>Weight: </span>
          <span>Height: </span>
          <span>Abilities: </span>
          </div>
          <div id="info">
            <span>${weight} kg</span>
            <span>${height} m</span>
            <span id="abilities"></span>
          </div>
        </div>
  
      <div id="currentStats" style="display: none">

        <div class="label-container">
          <span>HP</span>
          <span>ATTACK</span>
          <span>DEFENSE</span>
          <span>S-ATTACK</span>
          <span>S-DEFENSE</span>
          <span>SPEED</span>
        </div>

        <div class="stats-container">
            <span>${hp}</span>
            <span>${atk}</span>
            <span>${def}</span>
            <span>${satk}</span>
            <span>${sdef}</span>
            <span>${spd}</span>
        </div>

        <div class="bar-container">
          <div class="progressbar">
            <div class="hp" style="width: ${hp / 2}%"></div>
          </div>
        
          <div class="progressbar">
            <div class="attack" style="width: ${atk / 2}%"></div>
          </div>
    
          <div class="progressbar">
            <div class="defense" style="width: ${def / 2}%"></div>
          </div>
        
          <div class="progressbar">
            <div class="special-attack" style="width: ${satk / 2}%"></div>
          </div>
        
          <div class="progressbar">
            <div class="special-defense" style="width: ${sdef / 2}%"></div>
          </div>
    
          <div class="progressbar">
            <div class="speed" style="width: ${spd / 2}%"></div>
          </div>

        </div>
      </div>
       
        <ul id="moves" class="d-none"></ul>

    `;
    showPokemonType(currentPokemon);
    showPokemonAbilities(currentPokemon);
    loadMoves(currentPokemon);
}

function closeDetail(){
    let detailContainer = document.getElementById('detail-container');
    detailContainer.style.display = 'none';
    let pokedex = document.getElementById('pokedex');
    pokedex.style.display = 'flex';
    labels = [];
    stats = [];
}

function changeImg(id){
let pokemonImg = document.getElementById('pokemon-image');
let imgButton = document.getElementById('shiny-button');

  if(pokemonImg.src == `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`){
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
    imgButton.innerHTML = '<h4>normal</h4>';
  }else{
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    imgButton.innerHTML = '<h4>shiny</h4>';
  }
}

function showPokemonType(currentPokemon){
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        const type = currentPokemon['types'][i]['type']['name'];
        document.getElementById('types').innerHTML += `
        <div id="typeColor${i}"><h4>${type}</h4></div>`;
        document.getElementById(`typeColor${i}`).style.backgroundColor = typeColor[0][type];
    }
    
}

function showPokemonAbilities(currentPokemon){
  for (let i = 0; i < currentPokemon['abilities'].length; i++) {
    const ability = currentPokemon['abilities'][i]['ability']['name'];
    document.getElementById('abilities').innerHTML += `
    <div>${ability}</div>`;
}
}

function loadMoves(currentPokemon){
  for (let i = 0; i < currentPokemon['moves'].length; i++) {
    const move = currentPokemon['moves'][i]['move']['name'];
    document.getElementById('moves').innerHTML += `<li>${move}</li>`; 
  }
}

function loadStats(currentPokemon){
  
  for (let i = 0; i < currentPokemon['stats'].length; i++) {
    const label = currentPokemon['stats'][i]['stat']['name'];
    labels.push(label);
  }

  for (let j = 0; j  < currentPokemon['stats'].length; j++) {
    const stat = currentPokemon['stats'][j]['base_stat'] ;
    stats.push(stat);
  }
  
}

function showMoves(){
  document.getElementById('moves').style.display = 'flex';
  document.getElementById('currentStats').style.display = 'none';
  document.getElementById('pokemon-info').style.display = 'none';
}

function showStats(){
  document.getElementById('moves').style.display = 'none';
  document.getElementById('currentStats').style.display = 'flex';
  document.getElementById('pokemon-info').style.display = 'none';
}

function showInfo(){
  document.getElementById('moves').style.display = 'none';
  document.getElementById('currentStats').style.display = 'none';
  document.getElementById('pokemon-info').style.display = 'flex';
}

function renderPokedex(i, id, name){
  return  `
  <div id="pokemon-card${i}" class="pokemon-card" onclick="loadPokemonData(${id})">
  <h1>#${id}</h1>
  <img src="https://img.pokemondb.net/artwork/${name}.jpg">
  <h1>${name}</h1>
  </div>
`;
}