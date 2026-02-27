const BASE_URL = 'https://www.dnd5eapi.co/api/monsters';
const BASE_DOMAIN = 'https://www.dnd5eapi.co';

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

function getAC(armor_class) {
    if (Array.isArray(armor_class)) return armor_class[0]?.value ?? 0;
    return armor_class ?? 0;
}

function getMaxSpeed(speed) {
    const parse = (val) => parseInt(val) || 0;
    return Math.max(
        parse(speed?.walk),
        parse(speed?.fly),
        parse(speed?.swim),
        parse(speed?.burrow),
        parse(speed?.climb)
    );
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllDetails(monsterUrls, batchSize = 3, delayMs = 500) {
    const results = [];

    for (let i = 0; i < monsterUrls.length; i += batchSize) {
        const batch = monsterUrls.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(url => getMonsterDetails(url))
        );
        results.push(...batchResults.map(extractDetail));

        if (i + batchSize < monsterUrls.length) {
            await sleep(delayMs);
        }
    }

    return results;
}

async function loadMonsters(limit) {
    try {
        const monstersList = await getMonstersList(limit);
        const monsterUrls = monstersList.map(m => `${BASE_DOMAIN}${m.url}`);
        const detailedMonsters = await fetchAllDetails(monsterUrls);
        console.log(detailedMonsters);
    } catch (error) {
        console.error('Error al cargar monstruos:', error);
    }
}

async function main() {
    const totalLoaded = 40;
    const display = parseInt(process.argv[2]) || totalLoaded;

    const monstersList = await getMonstersList(totalLoaded);
    const monsterUrls = monstersList.slice(0, display).map(m => `${BASE_DOMAIN}${m.url}`);
    const monsters = await fetchAllDetails(monsterUrls);
    console.log(monsters);
    console.log(`Mostrando ${monsters.length} de ${totalLoaded} monstruos cargados`);
}

main();
