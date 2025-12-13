// Affichage de la vue boutique
function showShopView(content) {
    let html = `<h2 style="color: #ff0000; margin-bottom: 20px;">🛒 Boutique d'Équipement</h2>
               <p style="color: #ff6b6b; margin-bottom: 20px;">💰 Argent: ${player.money} €</p>`;
    
    if (hasAnyEquipment()) {
        html += `<p style="color: #ffa500; margin-bottom: 20px;">⚠️ Coûts de maintenance: ${calculateMaintenance()} € toutes les 90 secondes</p>`;
    } else {
        html += `<p style="color: #00ff00; margin-bottom: 20px;">✓ Aucun coût de maintenance tant que tu n'achètes rien !</p>`;
    }
    
    for (let category in shopItems) {
        html += `<h3 style="color: #ff6b6b; margin: 20px 0 10px 0;">${shopCategories[category]}</h3><div class="shop-grid">`;
        shopItems[category].forEach(item => {
            const owned = player.equipment[category] >= item.level;
            const canBuy = player.money >= item.cost && player.equipment[category] === item.level - 1;
            html += `
                <div class="shop-item ${owned ? 'owned' : ''}">
                    <div style="color: #ff0000; font-weight: bold; font-size: 1.2em; margin-bottom: 10px;">${item.name}</div>
                    ${item.desc ? `<div style="color: #ff6b6b; margin: 5px 0; font-size: 0.85em; font-style: italic;">${item.desc}</div>` : ''}
                    <div style="color: #ff6b6b; margin: 5px 0; font-size: 0.9em;">Bonus: +${item.bonus}%</div>
                    <div style="color: #ffa500; margin: 5px 0;">Prix: ${item.cost} €</div>
                    <div style="color: #ff9999; margin: 5px 0; font-size: 0.85em;">Maintenance: ${item.level * 50} €</div>
                    ${owned ? '<div style="color: #00ff00; font-weight: bold;">✓ POSSÉDÉ</div>' :
                      `<button onclick="buyEquipment('${category}', ${item.level})" ${!canBuy ? 'disabled' : ''}>Acheter</button>`}
                </div>`;
        });
        html += '</div>';
    }
    content.innerHTML = html;
}

// Achat d'équipement
function buyEquipment(category, level) {
    const item = shopItems[category][level - 1];
    if (player.money < item.cost || player.equipment[category] !== level - 1) return;
    
    player.money -= item.cost;
    player.equipment[category] = level;
    updateDisplay();
    showView('shop');
}