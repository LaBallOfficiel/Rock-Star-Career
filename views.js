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

// Variable pour le mode d'affichage des stats
let statsDisplayMode = 'numbers'; // 'numbers' ou 'chart'

// Affichage de la vue statistiques
function showStatsView(content) {
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">📊 Statistiques Complètes</h2>
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
            <button onclick="setStatsMode('numbers')" style="background: ${statsDisplayMode === 'numbers' ? 'linear-gradient(135deg, #8b0000 0%, #ff0000 100%)' : 'linear-gradient(135deg, #444 0%, #666 100%)'}">
                📋 Vue Détaillée
            </button>
            <button onclick="setStatsMode('chart')" style="background: ${statsDisplayMode === 'chart' ? 'linear-gradient(135deg, #8b0000 0%, #ff0000 100%)' : 'linear-gradient(135deg, #444 0%, #666 100%)'}">
                📊 Vue Graphique
            </button>
        </div>
        <div id="statsContent"></div>
    `;
    
    updateStatsDisplay();
}

// Changer le mode d'affichage
function setStatsMode(mode) {
    statsDisplayMode = mode;
    updateStatsDisplay();
}

// Mise à jour de l'affichage des stats
function updateStatsDisplay() {
    const container = document.getElementById('statsContent');
    if (!container) return;
    
    if (statsDisplayMode === 'numbers') {
        showNumbersView(container);
    } else {
        showChartView(container);
    }
}

// Vue avec nombres et barres
function showNumbersView(container) {
    container.innerHTML = `
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
                <div>
                    <div style="color: #fff; margin-bottom: 5px;">📢 Marketing: ${player.skills.marketing}/100</div>
                    <div class="health-bar" style="height: 20px;"><div class="health-fill health-good" style="width: ${player.skills.marketing}%">${player.skills.marketing}%</div></div>
                </div>
                <div>
                    <div style="color: #fff; margin-bottom: 5px;">💪 Endurance: ${player.skills.endurance}/100</div>
                    <div class="health-bar" style="height: 20px;"><div class="health-fill health-good" style="width: ${player.skills.endurance}%">${player.skills.endurance}%</div></div>
                </div>
            </div>
        </div>
        <div style="margin-top: 30px;">
            <h3 style="color: #ff6b6b; margin-bottom: 15px;">Équipement</h3>
            <div class="stats-compact">
                <div class="stat-row"><span class="stat-label">🎸 Instrument</span><span class="stat-value">Niveau ${player.equipment.instrument}</span></div>
                <div class="stat-row"><span class="stat-label">📊 Ampli</span><span class="stat-value">Niveau ${player.equipment.amplifier}</span></div>
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

// Vue graphique
function showChartView(container) {
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; border: 2px solid #8b0000;">
                <h3 style="color: #ff6b6b; margin-bottom: 20px; text-align: center;">📊 Compétences</h3>
                <canvas id="skillsChart" width="400" height="300"></canvas>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; border: 2px solid #8b0000;">
                <h3 style="color: #ff6b6b; margin-bottom: 20px; text-align: center;">⚙️ Équipement</h3>
                <canvas id="equipmentChart" width="400" height="300"></canvas>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; border: 2px solid #8b0000;">
                <h3 style="color: #ff6b6b; margin-bottom: 20px; text-align: center;">📈 Statistiques Principales</h3>
                <canvas id="mainStatsChart" width="400" height="300"></canvas>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; border: 2px solid #8b0000;">
                <h3 style="color: #ff6b6b; margin-bottom: 20px; text-align: center;">❤️ Santé & Addiction</h3>
                <canvas id="healthChart" width="400" height="300"></canvas>
            </div>
        </div>
    `;
    
    // Dessiner les graphiques
    setTimeout(() => {
        drawSkillsChart();
        drawEquipmentChart();
        drawMainStatsChart();
        drawHealthChart();
    }, 100);
}

// Graphique des compétences (radar)
function drawSkillsChart() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Ajuster la taille du canvas pour la résolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) / 3;
    
    const skillsData = [
        { name: 'Technique', value: player.skills.technique },
        { name: 'Scène', value: player.skills.scene },
        { name: 'Composition', value: player.skills.composition },
        { name: 'Charisme', value: player.skills.charisme },
        { name: 'Marketing', value: player.skills.marketing },
        { name: 'Endurance', value: player.skills.endurance }
    ];
    
    const angleStep = (Math.PI * 2) / skillsData.length;
    
    // Fond et grilles
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Grilles de référence
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        
        for (let j = 0; j <= skillsData.length; j++) {
            const angle = j * angleStep - Math.PI / 2;
            const r = (radius * i) / 5;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // Lignes radiales
    ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)';
    for (let i = 0; i < skillsData.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        ctx.stroke();
    }
    
    // Données du joueur
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    ctx.lineWidth = 3;
    
    for (let i = 0; i <= skillsData.length; i++) {
        const skill = skillsData[i % skillsData.length];
        const angle = i * angleStep - Math.PI / 2;
        const r = (radius * skill.value) / 100;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < skillsData.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 30;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        
        ctx.fillText(skillsData[i].name, x, y);
        ctx.fillStyle = '#ffa500';
        ctx.fillText(skillsData[i].value, x, y + 15);
        ctx.fillStyle = '#ff6b6b';
    }
}

// Graphique de l'équipement (barres)
function drawEquipmentChart() {
    const canvas = document.getElementById('equipmentChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Ajuster la taille du canvas pour la résolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    const equipmentData = [
        { name: 'Instrument', value: player.equipment.instrument, max: 5 },
        { name: 'Ampli', value: player.equipment.amplifier, max: 4 },
        { name: 'Lumières', value: player.equipment.lights, max: 4 },
        { name: 'Pyro', value: player.equipment.pyrotechnics, max: 4 },
        { name: 'Sono', value: player.equipment.soundSystem, max: 4 },
        { name: 'Transport', value: player.equipment.transport, max: 4 },
        { name: 'Studio', value: player.equipment.studio, max: 3 }
    ];
    
    const barHeight = 30;
    const barSpacing = 10;
    const startY = 20;
    const maxBarWidth = rect.width - 150;
    
    equipmentData.forEach((item, index) => {
        const y = startY + index * (barHeight + barSpacing);
        
        // Label
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(item.name, 10, y + barHeight / 2 + 5);
        
        // Barre de fond
        ctx.fillStyle = 'rgba(139, 0, 0, 0.3)';
        ctx.fillRect(120, y, maxBarWidth, barHeight);
        
        // Barre de progression
        const barWidth = (maxBarWidth * item.value) / item.max;
        const gradient = ctx.createLinearGradient(120, y, 120 + barWidth, y);
        gradient.addColorStop(0, '#8b0000');
        gradient.addColorStop(1, '#ff0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(120, y, barWidth, barHeight);
        
        // Valeur
        ctx.fillStyle = '#ffa500';
        ctx.font = 'bold 14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.value}/${item.max}`, 120 + maxBarWidth / 2, y + barHeight / 2 + 5);
    });
}

// Graphique des stats principales (barres horizontales)
function drawMainStatsChart() {
    const canvas = document.getElementById('mainStatsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Ajuster la taille du canvas pour la résolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    const maxMoney = Math.max(100000, player.money);
    const maxFans = Math.max(10000, player.fans);
    const maxPop = Math.max(3000, player.popularity);
    
    const stats = [
        { name: '💰 Argent', value: player.money, max: maxMoney, color: '#ffd700' },
        { name: '👥 Fans', value: player.fans, max: maxFans, color: '#ff6b6b' },
        { name: '⭐ Popularité', value: player.popularity, max: maxPop, color: '#ff0000' },
        { name: '🎵 Concerts', value: player.concertsPlayed, max: Math.max(100, player.concertsPlayed), color: '#ff00ff' },
        { name: '💿 Albums', value: player.albums.length, max: Math.max(20, player.albums.length), color: '#00ffff' }
    ];
    
    const barHeight = 40;
    const barSpacing = 15;
    const startY = 20;
    const maxBarWidth = rect.width - 150;
    
    stats.forEach((stat, index) => {
        const y = startY + index * (barHeight + barSpacing);
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(stat.name, 10, y + barHeight / 2 + 5);
        
        // Barre de fond
        ctx.fillStyle = 'rgba(139, 0, 0, 0.3)';
        ctx.fillRect(120, y, maxBarWidth, barHeight);
        
        // Barre de progression
        const barWidth = (maxBarWidth * stat.value) / stat.max;
        ctx.fillStyle = stat.color;
        ctx.fillRect(120, y, barWidth, barHeight);
        
        // Valeur
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(stat.value.toLocaleString(), 120 + barWidth + 10, y + barHeight / 2 + 5);
    });
}

// Graphique santé et addiction (cercles)
function drawHealthChart() {
    const canvas = document.getElementById('healthChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Ajuster la taille du canvas pour la résolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) / 6;
    
    // Santé
    drawCircularProgress(ctx, rect.width / 3, centerY, radius, player.health, '❤️ Santé', '#00ff00', '#ff0000');
    
    // Addiction
    drawCircularProgress(ctx, (rect.width * 2) / 3, centerY, radius, player.addiction, '💊 Addiction', '#ff0000', '#8b0000');
}

function drawCircularProgress(ctx, x, y, radius, value, label, colorStart, colorEnd) {
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * value) / 100;
    
    // Cercle de fond
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)';
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Arc de progression
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    const gradient = ctx.createLinearGradient(x - radius, y, x + radius, y);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Valeur au centre
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(Math.floor(value) + '%', x, y + 8);
    
    // Label
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(label, x, y + radius + 25);
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