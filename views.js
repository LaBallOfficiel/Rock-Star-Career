// Navigation entre les vues
function showView(view) {
    currentView = view;
    const content = document.getElementById('contentArea');
    const views = { 
        concert: showConcertView, 
        training: showTrainingView, 
        shop: showShopView, 
        groups: showGroupsView, 
        stats: showStatsView, 
        lifestyle: showLifestyleView, 
        history: showHistoryView,
        albums: showAlbumsView
    };
    views[view](content);
}

// Affichage de la vue statistiques
function showStatsView(content) {
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">📊 Statistiques Complètes</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h3 style="color: #ff6b6b; margin-bottom: 15px;">Informations Générales</h3>
                <div class="stat-row"><span class="stat-label">Nom</span><span class="stat-value">${player.name}</span></div>
                <div class="stat-row"><span class="stat-label">Instrument</span><span class="stat-value">${player.instrument}</span></div>
                <div class="stat-row"><span class="stat-label">Âge</span><span class="stat-value">${Math.floor(player.age)} ans</span></div>
                <div class="stat-row"><span class="stat-label">Santé</span><span class="stat-value">${Math.floor(player.health)}%</span></div>
                <div class="stat-row"><span class="stat-label">Addiction</span><span class="stat-value">${Math.floor(player.addiction)}%</span></div>
                <div class="stat-row"><span class="stat-label">Groupe</span><span class="stat-value">${player.group ? player.group.name : 'Solo'}</span></div>
            </div>
            <div>
                <h3 style="color: #ff6b6b; margin-bottom: 15px;">Carrière</h3>
                <div class="stat-row"><span class="stat-label">💰 Argent</span><span class="stat-value">${player.money} €</span></div>
                <div class="stat-row"><span class="stat-label">👥 Fans</span><span class="stat-value">${player.fans}</span></div>
                <div class="stat-row"><span class="stat-label">⭐ Popularité</span><span class="stat-value">${player.popularity}</span></div>
                <div class="stat-row"><span class="stat-label">🎵 Concerts</span><span class="stat-value">${player.concertsPlayed}</span></div>
                <div class="stat-row"><span class="stat-label">💿 Albums</span><span class="stat-value">${player.albums.length}</span></div>
            </div>
        </div>
        <div style="margin-top: 30px;">
            <h3 style="color: #ff6b6b; margin-bottom: 15px;">Compétences</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <div style="color: #fff; margin-bottom: 5px;">🎸 Technique: ${player.skills.technique}/100</div>
                    <div class="health-bar" style="height: 20px;"><div class="health-fill health-good" style="width: ${player.skills.technique}%">${player.skills.technique}%</div></div>
                </div>
                <div>
                    <div style="color: #fff; margin-bottom: 5px;">🔥 Présence: ${player.skills.scene}/100</div>
                    <div class="health-bar" style="height: 20px;"><div class="health-fill health-good" style="width: ${player.skills.scene}%">${player.skills.scene}%</div></div>
                </div>
                <div>
                    <div style="color: #fff; margin-bottom: 5px;">🎵 Composition: ${player.skills.composition}/100</div>
                    <div class="health-bar" style="height: 20px;"><div class="health-fill health-good" style="width: ${player.skills.composition}%">${player.skills.composition}%</div></div>
                </div>
                <div>
                    <div style="color: #fff; margin-bottom: 5px;">⭐ Charisme: ${player.skills.charisme}/100</div>
                    <div class="health-bar" style="height: 20px;"><div class="health-fill health-good" style="width: ${player.skills.charisme}%">${player.skills.charisme}%</div></div>
                </div>
            </div>
        </div>
        <div style="margin-top: 30px;">
            <h3 style="color: #ff6b6b; margin-bottom: 15px;">Équipement</h3>
            <div class="stats-compact">
                <div class="stat-row"><span class="stat-label">🎸 Instrument</span><span class="stat-value">Niveau ${player.equipment.instrument}</span></div>
                <div class="stat-row"><span class="stat-label">🔊 Ampli</span><span class="stat-value">Niveau ${player.equipment.amplifier}</span></div>
                <div class="stat-row"><span class="stat-label">💡 Éclairage</span><span class="stat-value">Niveau ${player.equipment.lights}</span></div>
                <div class="stat-row"><span class="stat-label">🔥 Pyro</span><span class="stat-value">Niveau ${player.equipment.pyrotechnics}</span></div>
                <div class="stat-row"><span class="stat-label">🔉 Sono</span><span class="stat-value">Niveau ${player.equipment.soundSystem}</span></div>
                <div class="stat-row"><span class="stat-label">🚐 Transport</span><span class="stat-value">Niveau ${player.equipment.transport}</span></div>
                <div class="stat-row"><span class="stat-label">🎙️ Studio</span><span class="stat-value">Niveau ${player.equipment.studio}</span></div>
                <div class="stat-row"><span class="stat-label">📊 Bonus Total</span><span class="stat-value">+${getTotalEquipmentBonus()}%</span></div>
            </div>
        </div>
    `;
}

// Affichage de l'historique des carrières
function showHistoryView(content) {
    if (careerHistory.length === 0) {
        content.innerHTML = `
            <h2 style="color: #ff0000; margin-bottom: 20px;">📜 Historique des Carrières</h2>
            <p style="color: #ff6b6b;">Aucune carrière terminée pour le moment...</p>
        `;
        return;
    }
    
    let html = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">📜 Historique des Carrières</h2>
        <div style="display: grid; gap: 15px;">
    `;
    
    careerHistory.forEach((career, index) => {
        html += `
            <div style="background: rgba(139, 0, 0, 0.2); border: 2px solid #8b0000; padding: 15px; border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <h3 style="color: #ff0000;">${career.name}</h3>
                    <span style="color: #ff6b6b;">☠️ ${career.age} ans</span>
                </div>
                <div style="color: #ff6b6b; margin: 5px 0;">${career.instrument} | ${career.group}</div>
                <div style="color: #ffa500; margin: 5px 0; font-style: italic;">${career.cause}</div>
                <div class="stats-compact" style="margin-top: 10px;">
                    <div class="stat-row"><span class="stat-label">💰 Argent</span><span class="stat-value">${career.money} €</span></div>
                    <div class="stat-row"><span class="stat-label">👥 Fans</span><span class="stat-value">${career.fans}</span></div>
                    <div class="stat-row"><span class="stat-label">⭐ Popularité</span><span class="stat-value">${career.popularity}</span></div>
                    <div class="stat-row"><span class="stat-label">🎵 Concerts</span><span class="stat-value">${career.concerts}</span></div>
                    ${career.albums !== undefined ? `<div class="stat-row"><span class="stat-label">💿 Albums</span><span class="stat-value">${career.albums}</span></div>` : ''}
                </div>
                <div style="color: #888; font-size: 0.85em; margin-top: 10px; text-align: right;">${career.date}</div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}