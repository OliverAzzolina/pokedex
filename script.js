let names = []; 
let labels = [];
let stats = [];
let limit = 20;
let ownedPokemon = [];
let nameUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;
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
    openDetail(currentPokemon, id);
}

function openDetail(currentPokemon, id){
    let pokedex = document.getElementById('pokedex');
    pokedex.style.display = 'none';
    let detailContainer = document.getElementById('detail-container');
    detailContainer.style.display = 'flex';
    let weight = currentPokemon['weight'] / 10;
    let height = currentPokemon['height'] /10;
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
        <div id="pokemon-info">
          <h3>Weight: </h3><span>${weight} kg</span>
          <h3>Height: </h3><span>${height} m</span>
          <h3>Abilities: </h3><span id="abilities"></span>
        </div>
  
        
        <canvas id="myChart" style="display: none;"></canvas>
       
        <ul id="moves" class="d-none"></ul>

    `;
    showPokemonType(currentPokemon);
    showPokemonAbilities(currentPokemon);
    loadStats(currentPokemon);
    loadMoves(currentPokemon);
    
}

function closeDetail(){
    let detailContainer = document.getElementById('detail-container');
    detailContainer.style.display = 'none';
    let pokedex = document.getElementById('pokedex');
    pokedex.style.display = 'flex';
    labels = [];
    stats = [];
    document.getElementById('myChart').innerHTML = '';
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
        <div><h4>${type}</h4></div>`;
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
  for (let i = 0; i < 20; i++) {
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

function renderChart(){
  const ctx = document.getElementById('myChart');

  let chartDataSets = [{
    label: '',
    data: stats,
    backgroundColor: [
      'red',
      'green',
      'yellow',
      'blue',
      'orange',
      'pink'
    ],
    hoverOffset: 6
  }];

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: chartDataSets,
      }
    });
    
  }

function showMoves(){
  document.getElementById('moves').style.display = 'block';
  document.getElementById('myChart').style.display = 'none';
  document.getElementById('pokemon-info').style.display = 'none';
}

function showStats(){
  document.getElementById('moves').style.display = 'none';
  document.getElementById('myChart').style.display = 'block';
  document.getElementById('pokemon-info').style.display = 'none';
  renderChart();
}

function showInfo(){
  document.getElementById('moves').style.display = 'none';
  document.getElementById('myChart').style.display = 'none';
  document.getElementById('pokemon-info').style.display = 'block';
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