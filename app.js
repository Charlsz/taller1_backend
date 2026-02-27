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


function extractDetail(m) {
  return {
    index: m.index,
    name: m.name,
    size: m.size,
    type: m.type,
    alignment: m.alignment,
    cr: m.challenge_rating,
    ac: getAC(m.armor_class),
    hp: m.hit_points,
    speed: getMaxSpeed(m.speed),
    stats: {
      str: m.strength,
      dex: m.dexterity,
      con: m.constitution,
      int: m.intelligence,
      wis: m.wisdom,
      cha: m.charisma,
    },
    immuneCount: m.damage_immunities?.length ?? 0,
    resistCount: m.damage_resistances?.length ?? 0,
    vulnCount: m.damage_vulnerabilities?.length ?? 0,
    hasLegendary: (m.legendary_actions?.length ?? 0) > 0,
  };
}

async function fetchAllDetails(monsterUrl) {

    const promises = monsterUrl.map(url => getMonsterDetails(url));
    const rawList = await Promise.all(promises);
    return rawList.map(extractDetail);
}