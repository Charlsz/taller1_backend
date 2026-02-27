function runQueriesB(monsters) {

    const highTier = monsters.filter(m => m.cr >= 5 && m.hp >= 80);

    const firstDragon = monsters.find(m => m.type === 'dragon' && m.cr >= 6);

    const anyLegendary = monsters.some(m => m.hasLegendary === true);

    const allComplete = monsters.every(
        m => Object.keys(m.stats).length === 6 && m.hp > 0
    );

    const byType = monsters.reduce((acc, m) => {
        if (!acc[m.type]) acc[m.type] = { count: 0, totalCR: 0, maxHP: 0 };
        acc[m.type].count++;
        acc[m.type].totalCR += m.cr;
        acc[m.type].maxHP = Math.max(acc[m.type].maxHP, m.hp);
        return acc;
    }, {});
    const grouped = Object.fromEntries(
        Object.entries(byType).map(([type, d]) => [
            type,
            { count: d.count, avgCR: +(d.totalCR / d.count).toFixed(1), maxHP: d.maxHP }
        ])
    );

    const crBuckets = monsters.reduce((acc, m) => {
        const key = m.cr <= 1 ? '0-1' : m.cr <= 4 ? '2-4' : m.cr <= 9 ? '5-9' : '10+';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    console.log('1. filter (cr>=5, hp>=80):', highTier);
    console.log('2. find (dragon, cr>=6):', firstDragon);
    console.log('3. some (hasLegendary):', anyLegendary);
    console.log('4. every (stats completos, hp>0):', allComplete);
    console.log('5. reduce por tipo:', grouped);
    console.log('6. reduce CR buckets:', crBuckets);
}

module.exports = { runQueriesB };
