let names = []; 


function init(){    
    loadPokemonOverview();
}

async function loadPokemonOverview(){
    let nameUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
    let nameResponse = await fetch(nameUrl);
    let namesAsJSON = await nameResponse.json();
    
    for (let i = 0; i < namesAsJSON['results'].length; i++) {
        const name = namesAsJSON['results'][i]['name'];
        names.push();
       let id = i + 1;
        document.getElementById('pokedex').innerHTML += 
        `
        <div id="pokemon-card${i}" class="pokemon-card" onclick="loadPokemonData(${id})">
        <h1>#${id}</h1>
        <img src="https://img.pokemondb.net/artwork/${name}.jpg">
        
        <h1>${name}</h1>
        </div>
          
      `;
    }
  
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
    <div id="button-area"><button onclick="closeDetail(${id})">Close</button><input type="checkbox"></div>
        <div id="pokemon-img-container">
            <img src="https://img.pokemondb.net/artwork/${currentPokemon['name']}.jpg">
        </div>
    
        <h1>${currentPokemon['name']}</h1>
        <h2>No. ${id}</h2>
        <div id="types"></div>
    
        <h3>Weight: ${weight} kg</h3>
        <h3>Height: ${height} m</h3>
    
        <button>Stats</button>
        <button>Moves</button>
        <button>Evolutions</button>

        <div>
            <canvas id="myChart"></canvas>
        </div>
    
    `;
    showPokemonType(currentPokemon);
    renderChart(currentPokemon);
}

function closeDetail(){
    let detailContainer = document.getElementById('detail-container');
    detailContainer.style.display = 'none';
    let pokedex = document.getElementById('pokedex');
    pokedex.style.display = 'flex';
}

function showPokemonType(currentPokemon){
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        const type = currentPokemon['types'][i]['type']['name'];
        document.getElementById('types').innerHTML += `
        <div>${type}</div>`;
    }
}

function renderChart(currentPokemon){
    const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [currentPokemon['stats'][0]['stat']['name']],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}