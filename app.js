let BASE_URL = 'https://www.dnd5eapi.co/api/monsters';


async function getMonstersList(limit) {
    const response = await fetch(`${BASE_URL}?limit=${limit}`);
    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al cargar la lista`);
    }
    const data = await response.json();
    return data.results;
}

async function getMonsterDetails(monsterUrl) {
    const response = await fetch(monsterUrl);
    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al cargar detalles`);
    }
    return response.json();
}

async function fetchAllDetails(monsterUrl) {

    const promises = monsterUrl.map(url => fetchPokemonDetail(url));
    const rawList = await Promise.all(promises);
    return rawList.map(extractDetail);
}



