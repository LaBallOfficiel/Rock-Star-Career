// Événements aléatoires pendant les concerts
const concertEvents = [
    { chance: 0.08, type: 'good', name: 'Rappel Triomphal !', revenueBonus: 1.5, fanBonus: 1.5, msg: '🎶 Le public réclame un rappel ! Revenus et fans x1.5 !' },
    { chance: 0.06, type: 'good', name: 'Standing Ovation', revenueBonus: 1.3, fanBonus: 2.0, msg: '👏 Standing ovation ! Fans x2 !' },
    { chance: 0.05, type: 'good', name: 'Journaliste Présent', revenueBonus: 1.0, fanBonus: 1.8, msg: '📰 Un journaliste dans la salle ! Ta popularité explose !' },
    { chance: 0.07, type: 'good', name: 'Record de Billeterie', revenueBonus: 2.0, fanBonus: 1.0, msg: '💵 Record de ventes ce soir ! Revenus doublés !' },
    { chance: 0.06, type: 'bad', name: 'Panne de Son', revenueBonus: 0.5, fanBonus: 0.3, msg: '🔇 Panne de sono ! Performance réduite...' },
    { chance: 0.04, type: 'bad', name: 'Bagarre dans la Fosse', revenueBonus: 0.7, fanBonus: 0.5, msg: '🥊 Bagarre dans le public ! Ambiance gâchée...' },
    { chance: 0.05, type: 'neutral', name: 'Caméraman sur Scène', revenueBonus: 1.0, fanBonus: 1.3, msg: '🎥 Un caméraman filme le concert pour les réseaux !' },
];

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
            <div class="stat-row"><span class="stat-label">💰 Argent</span><span class="stat-value">${player.money.toLocaleString()} €</span></div>
            <div class="stat-row"><span class="stat-label">👥 Fans</span><span class="stat-value">${player.fans.toLocaleString()}</span></div>
            <div class="stat-row"><span class="stat-label">⭐ Popularité</span><span class="stat-value">${player.popularity}</span></div>
            <div class="stat-row"><span class="stat-label">🎵 Concerts</span><span class="stat-value">${player.concertsPlayed}</span></div>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #ff6b6b;">Performance moyenne: ${Math.floor(avgSkill)}% | Bonus équipement: +${equipBonus}%</p>
            ${player.group ? `<p style="color: #ff6b6b;">Bonus groupe: x${player.group.bonus}</p>` : ''}
        </div>
        <div class="venues-grid">
            ${buildVenueCard('bar', '🍺', 'Bar Local', [50, 180], 12, venuePop.bar)}
            ${buildVenueCard('club', '🎵', 'Club', [200, 600], 18, venuePop.club)}
            ${buildVenueCard('salle', '🏛️', 'Grande Salle', [1000, 3000], 25, venuePop.salle)}
            ${buildVenueCard('theatre', '🎭', 'Théâtre', [3000, 7000], 40, venuePop.theatre)}
            ${buildVenueCard('arena', '🏟️', 'Arena', [8000, 18000], 55, venuePop.arena)}
            ${buildVenueCard('festival', '🎪', 'Festival', [25000, 70000], 80, venuePop.festival)}
        </div>
        <div id="concertResult"></div>`;
}

function buildVenueCard(type, emoji, name, revenueRange, cooldown, minPop) {
    const locked = player.popularity < minPop;
    const busy = isPlayerBusy();
    const disabled = locked || busy;
    
    const groupMult = player.group ? player.group.bonus : 1;
    const minR = Math.floor(revenueRange[0] * groupMult);
    const maxR = Math.floor(revenueRange[1] * groupMult);

    return `
        <div class="venue-card ${locked ? 'venue-locked' : ''}">
            <div class="venue-emoji">${emoji}</div>
            <div class="venue-name">${name}</div>
            <div class="venue-info">💰 ${minR.toLocaleString()} – ${maxR.toLocaleString()} €</div>
            <div class="venue-info">⏳ ${cooldown}s cooldown</div>
            ${locked ? `<div class="venue-lock">🔒 Pop. ${minPop} requise</div>` : ''}
            <button onclick="doConcert('${type}')" ${disabled ? 'disabled' : ''} style="${locked ? 'display:none' : ''}">Jouer !</button>
        </div>`;
}

// Exécution d'un concert
function doConcert(type) {
    if (isPlayerBusy()) {
        showToast('⏳ Tu es déjà occupé ! Termine ton activité en cours.', 2000);
        return;
    }
    
    const avgSkill = (player.skills.technique + player.skills.scene + player.skills.composition + player.skills.charisme) / 4;
    const equipBonus = getTotalEquipmentBonus();
    const venue = venues[type];
    
    player.concertCooldown = venue.cooldown;
    
    // Formule de succès plus généreuse
    const skillMultiplier = (avgSkill + equipBonus) / 100;
    const successThreshold = venue.difficulty;
    const success = skillMultiplier > successThreshold * 0.8 && Math.random() < (skillMultiplier - successThreshold * 0.8 + 0.35);
    
    let quality = Math.min(1, skillMultiplier * (0.75 + Math.random() * 0.25));
    
    if (player.health < 50) quality *= 0.75;
    if (player.addiction > 50) quality *= 0.85;
    
    let revenue = Math.max(60, Math.floor(venue.revenue * quality));
    // Plancher de fans garanti même avec des skills bas
    let newFans = Math.max(
        Math.floor(venue.fans * 0.15),          // minimum 15% des fans du lieu
        Math.floor(venue.fans * quality)
    );
    
    if (player.group) {
        revenue = Math.floor(revenue * player.group.bonus);
        newFans = Math.floor(newFans * player.group.bonus);
    }
    
    // Événement aléatoire
    let eventMsg = '';
    for (const event of concertEvents) {
        if (Math.random() < event.chance) {
            revenue = Math.floor(revenue * event.revenueBonus);
            newFans = Math.floor(newFans * event.fanBonus);
            if (event.type === 'good' && event.name === 'Journaliste Présent') {
                player.popularity += 20;
            }
            eventMsg = `<div style="background: rgba(${event.type === 'good' ? '0,139,0' : event.type === 'bad' ? '139,0,0' : '0,0,139'}, 0.3); border: 1px solid ${event.type === 'good' ? '#00ff00' : event.type === 'bad' ? '#ff0000' : '#0088ff'}; padding: 10px; border-radius: 5px; margin: 8px 0; color: ${event.type === 'good' ? '#00ff00' : event.type === 'bad' ? '#ff6666' : '#88aaff'};">
                🎲 ÉVÉNEMENT : ${event.msg}
            </div>`;
            break;
        }
    }
    
    // Popularité : bonus marketing + gain de base par lieu
    const marketingBonus = 1 + (player.skills.marketing / 200);
    const venuePopBonus = { bar: 2, club: 5, salle: 12, theatre: 25, arena: 50, festival: 120 };
    const popGain = Math.floor(newFans / 5 * marketingBonus) + (venuePopBonus[type] || 2);
    player.popularity += popGain;
    
    if (!success) {
        revenue = Math.max(60, Math.floor(revenue * 0.4));
        newFans = Math.floor(newFans * 0.3);
        player.popularity = Math.max(0, player.popularity - Math.floor(newFans / 5));
    }
    
    // Festival tracker pour achievement
    if (type === 'festival') {
        player.festivalPlayed = (player.festivalPlayed || 0) + 1;
    }

    player.money += revenue;
    player.fans += newFans;
    player.concertsPlayed++;
    
    const enduranceReduction = 1 - (player.skills.endurance / 200);
    const healthCost = Math.floor((Math.floor(Math.random() * 3) + 1 + Math.floor(venue.difficulty * 4)) * enduranceReduction);
    player.health -= healthCost;
    player.health = Math.max(0, player.health);
    
    document.getElementById('concertResult').innerHTML = `
        <div class="concert-result">
            <h3 style="color: ${success ? '#00ff00' : '#ffa500'}; margin-bottom: 10px;">
                ${success ? '🎸 CONCERT RÉUSSI ! 🎸' : '😕 Concert moyen...'}
            </h3>
            ${eventMsg}
            <p><strong>Lieu:</strong> ${venue.name} | <strong>Performance:</strong> ${Math.floor(quality * 100)}%</p>
            <p class="positive"><strong>💰 Gains:</strong> +${revenue.toLocaleString()} €</p>
            <p class="positive"><strong>👥 Nouveaux fans:</strong> +${newFans.toLocaleString()}</p>
            <p class="positive"><strong>⭐ Popularité:</strong> ${success ? '+' + popGain : '-' + Math.floor(newFans / 5)}</p>
            <p class="negative"><strong>❤️ Santé:</strong> -${healthCost}%</p>
            <p style="color: #ffa500; margin-top: 8px;">⏳ Prochain concert dans ${venue.cooldown}s</p>
        </div>`;
    
    updateDisplay();
    showView('concert');
}
