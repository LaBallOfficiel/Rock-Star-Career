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
        albums: showAlbumsView,
        achievements: showAchievementsView,
        social: showSocialView,
        mods: showModView,
        textures: showTextureView
    };
    if (views[view]) views[view](content);

    // Highlight bouton actif
    document.querySelectorAll('.sidebar button[id^="btn-"]').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + view);
    if (activeBtn) activeBtn.classList.add('active');
}

// =====================
// VUE ACHIEVEMENTS
// =====================
function showAchievementsView(content) {
    const unlocked = player.unlockedAchievements || [];
    const total = achievements.length;
    const count = unlocked.length;
    
    let html = `
        <h2 style="color: #ff0000; margin-bottom: 10px;">🏆 Achievements</h2>
        <p style="color: #ff6b6b; margin-bottom: 20px;">${count} / ${total} débloqués</p>
        <div class="health-bar" style="height: 16px; margin-bottom: 25px;">
            <div class="health-fill health-good" style="width: ${Math.round(count/total*100)}%">${Math.round(count/total*100)}%</div>
        </div>
        <div class="achievements-grid">
    `;
    
    achievements.forEach(ach => {
        const done = unlocked.includes(ach.id);
        let rewardText = [];
        if (ach.reward.money) rewardText.push(`+${ach.reward.money.toLocaleString()} €`);
        if (ach.reward.fans) rewardText.push(`+${ach.reward.fans.toLocaleString()} fans`);
        if (ach.reward.popularity) rewardText.push(`+${ach.reward.popularity} pop.`);
        if (ach.reward.health) rewardText.push(`+${ach.reward.health}% santé`);

        html += `
            <div class="achievement-card ${done ? 'achievement-done' : 'achievement-locked'}">
                <div class="achievement-icon">${done ? ach.icon : '🔒'}</div>
                <div class="achievement-name">${done ? ach.name : '???'}</div>
                <div class="achievement-desc">${done ? ach.desc : 'Achievement secret'}</div>
                ${done ? `<div class="achievement-reward">🎁 ${rewardText.join(' · ')}</div>` : ''}
            </div>`;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

// Variable pour le mode d'affichage des stats
let statsDisplayMode = 'numbers';

// Affichage de la vue statistiques
function showStatsView(content) {
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">📊 Statistiques Complètes</h2>
        <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
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

function setStatsMode(mode) {
    statsDisplayMode = mode;
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const container = document.getElementById('statsContent');
    if (!container) return;
    if (statsDisplayMode === 'numbers') showNumbersView(container);
    else showChartView(container);
}

function showNumbersView(container) {
    const passivePerMin = getPassiveIncomePerMinute();
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
                <div class="stat-row"><span class="stat-label">💰 Argent</span><span class="stat-value">${player.money.toLocaleString()} €</span></div>
                <div class="stat-row"><span class="stat-label">👥 Fans</span><span class="stat-value">${player.fans.toLocaleString()}</span></div>
                <div class="stat-row"><span class="stat-label">⭐ Popularité</span><span class="stat-value">${player.popularity}</span></div>
                <div class="stat-row"><span class="stat-label">🎵 Concerts</span><span class="stat-value">${player.concertsPlayed}</span></div>
                <div class="stat-row"><span class="stat-label">💿 Albums</span><span class="stat-value">${player.albums.length}</span></div>
                ${passivePerMin > 0 ? `<div class="stat-row"><span class="stat-label">📀 Passif</span><span class="stat-value" style="color:#00ff00;">${passivePerMin.toLocaleString()} €/min</span></div>` : ''}
                <div class="stat-row"><span class="stat-label">🏆 Achievements</span><span class="stat-value">${(player.unlockedAchievements||[]).length}/${achievements.length}</span></div>
            </div>
        </div>
        <div style="margin-top: 30px;">
            <h3 style="color: #ff6b6b; margin-bottom: 15px;">Compétences</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                ${skills.map(s => `
                <div>
                    <div style="color: #fff; margin-bottom: 5px;">${s.icon} ${s.name}: ${player.skills[s.key]}/100</div>
                    <div class="health-bar" style="height: 20px;"><div class="health-fill health-good" style="width: ${player.skills[s.key]}%">${player.skills[s.key]}%</div></div>
                </div>`).join('')}
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
    setTimeout(() => {
        drawSkillsChart();
        drawEquipmentChart();
        drawMainStatsChart();
        drawHealthChart();
    }, 100);
}

function drawSkillsChart() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
    ctx.clearRect(0, 0, rect.width, rect.height);
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
    ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)';
    for (let i = 0; i < skillsData.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        ctx.stroke();
    }
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
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = 'center';
    for (let i = 0; i < skillsData.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 30;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        ctx.fillStyle = '#ff6b6b';
        ctx.fillText(skillsData[i].name, x, y);
        ctx.fillStyle = '#ffa500';
        ctx.fillText(skillsData[i].value, x, y + 15);
    }
}

function drawEquipmentChart() {
    const canvas = document.getElementById('equipmentChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(item.name, 10, y + barHeight / 2 + 5);
        ctx.fillStyle = 'rgba(139, 0, 0, 0.3)';
        ctx.fillRect(120, y, maxBarWidth, barHeight);
        const barWidth = (maxBarWidth * item.value) / item.max;
        const gradient = ctx.createLinearGradient(120, y, 120 + barWidth, y);
        gradient.addColorStop(0, '#8b0000');
        gradient.addColorStop(1, '#ff0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(120, y, barWidth, barHeight);
        ctx.fillStyle = '#ffa500';
        ctx.font = 'bold 14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.value}/${item.max}`, 120 + maxBarWidth / 2, y + barHeight / 2 + 5);
    });
}

function drawMainStatsChart() {
    const canvas = document.getElementById('mainStatsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const stats = [
        { name: '💰 Argent', value: player.money, max: Math.max(100000, player.money), color: '#ffd700' },
        { name: '👥 Fans', value: player.fans, max: Math.max(10000, player.fans), color: '#ff6b6b' },
        { name: '⭐ Popularité', value: player.popularity, max: Math.max(3000, player.popularity), color: '#ff0000' },
        { name: '🎵 Concerts', value: player.concertsPlayed, max: Math.max(100, player.concertsPlayed), color: '#ff00ff' },
        { name: '💿 Albums', value: player.albums.length, max: Math.max(20, player.albums.length), color: '#00ffff' }
    ];
    const barHeight = 40;
    const barSpacing = 15;
    const startY = 20;
    const maxBarWidth = rect.width - 150;
    stats.forEach((stat, index) => {
        const y = startY + index * (barHeight + barSpacing);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(stat.name, 10, y + barHeight / 2 + 5);
        ctx.fillStyle = 'rgba(139, 0, 0, 0.3)';
        ctx.fillRect(120, y, maxBarWidth, barHeight);
        const barWidth = (maxBarWidth * stat.value) / stat.max;
        ctx.fillStyle = stat.color;
        ctx.fillRect(120, y, barWidth, barHeight);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(stat.value.toLocaleString(), 120 + barWidth + 10, y + barHeight / 2 + 5);
    });
}

function drawHealthChart() {
    const canvas = document.getElementById('healthChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) / 6;
    drawCircularProgress(ctx, rect.width / 3, centerY, radius, player.health, '❤️ Santé', '#00ff00', '#ff0000');
    drawCircularProgress(ctx, (rect.width * 2) / 3, centerY, radius, player.addiction, '💊 Addiction', '#ff0000', '#8b0000');
}

function drawCircularProgress(ctx, x, y, radius, value, label, colorStart, colorEnd) {
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * value) / 100;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)';
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    const gradient = ctx.createLinearGradient(x - radius, y, x + radius, y);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(Math.floor(value) + '%', x, y + 8);
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
    
    let html = `<h2 style="color: #ff0000; margin-bottom: 20px;">📜 Historique des Carrières</h2><div style="display: grid; gap: 15px;">`;
    
    careerHistory.forEach((career) => {
        html += `
            <div style="background: rgba(139, 0, 0, 0.2); border: 2px solid #8b0000; padding: 15px; border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <h3 style="color: #ff0000;">${career.name}</h3>
                    <span style="color: #ff6b6b;">☠️ ${career.age} ans</span>
                </div>
                <div style="color: #ff6b6b; margin: 5px 0;">${career.instrument} | ${career.group}</div>
                <div style="color: #ffa500; margin: 5px 0; font-style: italic;">${career.cause}</div>
                <div class="stats-compact" style="margin-top: 10px;">
                    <div class="stat-row"><span class="stat-label">💰 Argent</span><span class="stat-value">${(career.money||0).toLocaleString()} €</span></div>
                    <div class="stat-row"><span class="stat-label">👥 Fans</span><span class="stat-value">${(career.fans||0).toLocaleString()}</span></div>
                    <div class="stat-row"><span class="stat-label">⭐ Popularité</span><span class="stat-value">${career.popularity}</span></div>
                    <div class="stat-row"><span class="stat-label">🎵 Concerts</span><span class="stat-value">${career.concerts}</span></div>
                    ${career.albums !== undefined ? `<div class="stat-row"><span class="stat-label">💿 Albums</span><span class="stat-value">${career.albums}</span></div>` : ''}
                    ${career.achievements !== undefined ? `<div class="stat-row"><span class="stat-label">🏆 Achievements</span><span class="stat-value">${career.achievements}/${achievements.length}</span></div>` : ''}
                </div>
                <div style="color: #888; font-size: 0.85em; margin-top: 10px; text-align: right;">${career.date}</div>
            </div>`;
    });
    
    html += '</div>';
    content.innerHTML = html;
}
