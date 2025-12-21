// Affichage de la vue concerts
function showConcertView(content) {
    const equipBonus = getTotalEquipmentBonus();
    const avgSkill = (player.skills.technique + player.skills.scene + player.skills.composition + player.skills.charisme) / 4;
    const activityMsg = getCurrentActivityMessage();
    
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">🎤 Concerts</h2>
        ${activityMsg ? `<div style="background: rgba(255, 165, 0, 0.3); border: 2px solid #ffa500; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: #ffa500;">
            ${activityMsg}
        </div>` : ''}
        <div class="stats-compact">
            <div class="stat-row"><span class="stat-label">💰 Argent</span><span class="stat-value">${player.money} €</span></div>
            <div class="stat-row"><span class="stat-label">👥 Fans</span><span class="stat-value">${player.fans}</span></div>
            <div class="stat-row"><span class="stat-label">⭐ Popularité</span><span class="stat-value">${player.popularity}</span></div>
            <div class="stat-row"><span class="stat-label">🎵 Concerts</span><span class="stat-value">${player.concertsPlayed}</span></div>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #ff6b6b;">Performance moyenne: ${Math.floor(avgSkill)}%</p>
            <p style="color: #ff6b6b;">Bonus équipement: +${equipBonus}%</p>
            ${player.group ? `<p style="color: #ff6b6b;">Bonus groupe: x${player.group.bonus}</p>` : ''}
        </div>
        <div class="action-grid">
            <button onclick="doConcert('bar')" ${isPlayerBusy() ? 'disabled' : ''}>🍺 Bar Local<br><small>50-150€</small><br><small>15s</small></button>
            <button onclick="doConcert('club')" ${player.popularity < 50 || isPlayerBusy() ? 'disabled' : ''}>🎵 Club<br><small>200-500€</small><br><small>20s</small></button>
            <button onclick="doConcert('salle')" ${player.popularity < 200 || isPlayerBusy() ? 'disabled' : ''}>🏛️ Grande Salle<br><small>1000-2500€</small><br><small>30s</small></button>
            <button onclick="doConcert('theatre')" ${player.popularity < 500 || isPlayerBusy() ? 'disabled' : ''}>🎭 Théâtre<br><small>3000-6000€</small><br><small>45s</small></button>
            <button onclick="doConcert('arena')" ${player.popularity < 1000 || isPlayerBusy() ? 'disabled' : ''}>🏟️ Arena<br><small>8000-15000€</small><br><small>60s</small></button>
            <button onclick="doConcert('festival')" ${player.popularity < 2500 || isPlayerBusy() ? 'disabled' : ''}>🎪 Festival<br><small>25000-60000€</small><br><small>90s</small></button>
        </div>
        <div id="concertResult"></div>`;
}

// Exécution d'un concert
function doConcert(type) {
    if (isPlayerBusy()) {
        alert('Tu es déjà occupé ! Termine ton activité en cours avant de faire un concert.');
        return;
    }
    
    const avgSkill = (player.skills.technique + player.skills.scene + player.skills.composition + player.skills.charisme) / 4;
    const equipBonus = getTotalEquipmentBonus();
    const venue = venues[type];
    
    player.concertCooldown = venue.cooldown;
    
    const skillMultiplier = (avgSkill + equipBonus) / 100;
    const successThreshold = venue.difficulty;
    const success = skillMultiplier > successThreshold && Math.random() < (skillMultiplier - successThreshold + 0.3);
    
    let quality = Math.min(1, skillMultiplier * (0.7 + Math.random() * 0.3));
    
    // Malus santé et addiction
    if (player.health < 50) quality *= 0.7;
    if (player.addiction > 50) quality *= 0.8;
    
    let revenue = Math.max(50, Math.floor(venue.revenue * quality));
    let newFans = Math.floor(venue.fans * quality);
    
    // Bonus de groupe
    if (player.group) {
        revenue = Math.floor(revenue * player.group.bonus);
        newFans = Math.floor(newFans * player.group.bonus);
    }
    
    // Bonus marketing
    const marketingBonus = 1 + (player.skills.marketing / 200);
    player.popularity += Math.floor(newFans / 10 * marketingBonus);
    
    // Pénalité en cas d'échec
    if (!success) {
        revenue = Math.max(50, Math.floor(revenue * 0.3));
        newFans = Math.floor(newFans * 0.2);
        player.popularity = Math.max(0, player.popularity - Math.floor(newFans / 5));
    }
    
    // Application des gains
    player.money += revenue;
    player.fans += newFans;
    player.concertsPlayed++;
    
    // Coût en santé (réduit par l'endurance)
    const enduranceReduction = 1 - (player.skills.endurance / 200);
    const healthCost = Math.floor((Math.floor(Math.random() * 3) + 1 + Math.floor(venue.difficulty * 5)) * enduranceReduction);
    player.health -= healthCost;
    player.health = Math.max(0, player.health);
    
    // Affichage du résultat
    document.getElementById('concertResult').innerHTML = `
        <div class="concert-result">
            <h3 style="color: ${success ? '#00ff00' : '#ffa500'}; margin-bottom: 15px;">
                ${success ? '🎸 CONCERT RÉUSSI ! 🎸' : '😕 Concert moyen...'}
            </h3>
            <p><strong>Lieu:</strong> ${venue.name}</p>
            <p><strong>Performance:</strong> ${Math.floor(quality * 100)}%</p>
            <p class="positive"><strong>💰 Gains:</strong> +${revenue} €</p>
            <p class="positive"><strong>👥 Nouveaux fans:</strong> +${newFans}</p>
            <p class="negative"><strong>❤️ Santé:</strong> -${healthCost}%</p>
            ${!success ? '<p class="negative"><strong>⭐ Popularité:</strong> Baisse !</p>' : ''}
            <p style="color: #ffa500; margin-top: 10px;">⏳ Prochain concert dans ${venue.cooldown} secondes</p>
        </div>`;
    
    updateDisplay();
    showView('concert');
}