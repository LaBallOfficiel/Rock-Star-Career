let player = {
    name: '', instrument: '', age: 18, health: 100, addiction: 0,
    money: 300, fans: 0, popularity: 0, concertsPlayed: 0, group: null,
    skills: { technique: 10, scene: 10, composition: 10, charisme: 10 },
    equipment: { instrument: 0, amplifier: 0, lights: 0, pyrotechnics: 0, soundSystem: 0, transport: 0, studio: 0 },
    trainingCooldowns: { technique: 0, scene: 0, composition: 0, charisme: 0 },
    daysWithoutDrugs: 0,
    concertCooldown: 0
};

let gameTime = 0;
let currentView = 'concert';
let careerHistory = JSON.parse(localStorage.getItem('careerHistory') || '[]');

const groups = [
    { name: 'Les Débutants', minPop: 0, bonus: 1.2, members: 3 },
    { name: 'Death Scream', minPop: 50, bonus: 1.5, members: 4 },
    { name: 'Iron Thunder', minPop: 150, bonus: 2, members: 5 },
    { name: 'Metal Gods', minPop: 500, bonus: 3, members: 5 },
    { name: 'Legends of Rock', minPop: 1500, bonus: 5, members: 6 },
    { name: 'Immortal Flames', minPop: 3000, bonus: 7, members: 7 }
];

const shopItems = {
    instrument: [
        { level: 1, name: 'Instrument Débutant', cost: 500, bonus: 5 },
        { level: 2, name: 'Instrument Intermédiaire', cost: 2000, bonus: 15 },
        { level: 3, name: 'Instrument Pro', cost: 8000, bonus: 30 },
        { level: 4, name: 'Instrument Légendaire', cost: 25000, bonus: 50 },
        { level: 5, name: 'Instrument de Collection', cost: 100000, bonus: 80 }
    ],
    amplifier: [
        { level: 1, name: 'Ampli Basic', cost: 400, bonus: 5 },
        { level: 2, name: 'Ampli Marshall', cost: 1500, bonus: 15 },
        { level: 3, name: 'Stack Complet', cost: 6000, bonus: 25 },
        { level: 4, name: 'Ampli Stadium', cost: 20000, bonus: 45 }
    ],
    lights: [
        { level: 1, name: 'Éclairages Basiques', cost: 1000, bonus: 10 },
        { level: 2, name: 'Lasers & LED', cost: 5000, bonus: 25 },
        { level: 3, name: 'Show Laser Complet', cost: 15000, bonus: 50 },
        { level: 4, name: 'Production Holographique', cost: 50000, bonus: 80 }
    ],
    pyrotechnics: [
        { level: 1, name: 'Fumée & Étincelles', cost: 2000, bonus: 15 },
        { level: 2, name: 'Flammes & Explosions', cost: 8000, bonus: 35 },
        { level: 3, name: 'Pyrotechnie Complète', cost: 20000, bonus: 60 },
        { level: 4, name: 'Spectacle Pyrotechnique Épique', cost: 75000, bonus: 100 }
    ],
    soundSystem: [
        { level: 1, name: 'Sono Standard', cost: 800, bonus: 8 },
        { level: 2, name: 'Sono Pro', cost: 3000, bonus: 20 },
        { level: 3, name: 'Sono Stadium', cost: 12000, bonus: 40 },
        { level: 4, name: 'Système Audio Spatial', cost: 40000, bonus: 70 }
    ],
    transport: [
        { level: 1, name: 'Van d\'occasion', cost: 3000, bonus: 5, desc: 'Transport basique' },
        { level: 2, name: 'Tour Bus', cost: 15000, bonus: 15, desc: 'Confort en tournée' },
        { level: 3, name: 'Bus Customisé', cost: 50000, bonus: 30, desc: 'Voyage de luxe' },
        { level: 4, name: 'Jet Privé', cost: 500000, bonus: 100, desc: 'Style de rockstar' }
    ],
    studio: [
        { level: 1, name: 'Home Studio', cost: 5000, bonus: 10, desc: 'Enregistrement maison' },
        { level: 2, name: 'Studio Pro', cost: 25000, bonus: 30, desc: 'Qualité professionnelle' },
        { level: 3, name: 'Studio Légendaire', cost: 100000, bonus: 60, desc: 'Production de classe mondiale' }
    ]
};

function startGame() {
    const name = document.getElementById('playerName').value.trim();
    const instrument = document.getElementById('instrument').value;
    if (!name) { alert('Entre un nom de scène !'); return; }
    
    player.name = name;
    player.instrument = instrument;
    
    document.getElementById('creationScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    updateDisplay();
    showView('concert');
    
    setInterval(() => {
        gameTime++;
        if (gameTime % 30 === 0) passTime();
        updateCooldowns();
    }, 1000);
}

window.addEventListener('DOMContentLoaded', () => {
    loadGame();
});

function passTime() {
    player.age += 0.15;
    
    if (player.addiction > 0) {
        player.health -= player.addiction / 15;
        player.daysWithoutDrugs = 0;
        if (Math.random() < 0.1) player.addiction = Math.max(0, player.addiction - 0.5);
    } else {
        player.daysWithoutDrugs++;
        if (player.health < 100) player.health += 0.5;
    }
    
    if (gameTime % 90 === 0) {
        let maintenanceCost = 0;
        for (let eq in player.equipment) {
            if (player.equipment[eq] > 0) {
                maintenanceCost += player.equipment[eq] * 50;
            }
        }
        if (player.group) maintenanceCost += 200;
        player.money -= maintenanceCost;
        if (player.money < 0) {
            player.health -= 5;
        }
    }
    
    if (gameTime % 120 === 0 && player.popularity > 0) {
        player.popularity = Math.max(0, player.popularity - Math.floor(player.popularity * 0.02));
    }
    
    if (player.age > 50 && Math.random() < 0.02) player.health -= Math.random() * 5;
    if (player.age > 60 && Math.random() < 0.05) player.health -= Math.random() * 10;
    if (player.age > 70 && Math.random() < 0.08) player.health -= Math.random() * 15;
    if (player.age > 80) player.health -= 0.5;
    
    player.health = Math.max(0, player.health);
    
    if (player.health <= 0) gameOver();
    
    if (gameTime % 30 === 0) saveGame();
    
    updateDisplay();
}

function updateCooldowns() {
    for (let skill in player.trainingCooldowns) {
        if (player.trainingCooldowns[skill] > 0) {
            player.trainingCooldowns[skill]--;
        }
    }
    if (player.concertCooldown > 0) {
        player.concertCooldown--;
    }
    if (currentView === 'training' || currentView === 'concert') {
        showView(currentView);
    }
}

function gameOver() {
    let cause = '';
    if (player.addiction > 70) {
        cause = 'Overdose... La drogue a eu raison de toi.';
    } else if (player.age > 70) {
        cause = 'Vieillesse... Tu as vécu ta vie à fond.';
    } else {
        cause = 'Santé défaillante... Le rock n\'roll a épuisé ton corps.';
    }

    const careerRecord = {
        name: player.name,
        instrument: player.instrument,
        age: Math.floor(player.age),
        money: player.money,
        fans: player.fans,
        popularity: player.popularity,
        concerts: player.concertsPlayed,
        group: player.group?.name || 'Solo',
        cause: cause,
        date: new Date().toLocaleString('fr-FR')
    };
    
    careerHistory.unshift(careerRecord);
    if (careerHistory.length > 20) careerHistory = careerHistory.slice(0, 20);
    localStorage.setItem('careerHistory', JSON.stringify(careerHistory));
    localStorage.removeItem('currentGame');

    document.getElementById('deathMessage').innerHTML = `
        <div style="color: #ff0000;">${player.name} est mort à ${Math.floor(player.age)} ans</div>
        <div style="color: #ff6b6b; margin-top: 10px;">${cause}</div>`;
    
    document.getElementById('deathStats').innerHTML = `
        <div style="color: #fff;">
            <p>💰 Argent gagné: ${player.money} €</p>
            <p>👥 Fans totaux: ${player.fans}</p>
            <p>🎵 Concerts joués: ${player.concertsPlayed}</p>
            <p>⭐ Popularité maximale: ${player.popularity}</p>
            ${player.group ? `<p>🎸 Dernier groupe: ${player.group.name}</p>` : ''}
        </div>`;
    
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('deathScreen').classList.add('active');
}

function saveGame() {
    localStorage.setItem('currentGame', JSON.stringify(player));
}

function loadGame() {
    const saved = localStorage.getItem('currentGame');
    if (saved) {
        const confirmation = confirm('Une sauvegarde existe. Voulez-vous la charger ?');
        if (confirmation) {
            player = JSON.parse(saved);
            document.getElementById('creationScreen').classList.remove('active');
            document.getElementById('gameScreen').classList.add('active');
            updateDisplay();
            showView('concert');
            
            setInterval(() => {
                gameTime++;
                if (gameTime % 30 === 0) passTime();
                updateCooldowns();
            }, 1000);
            return true;
        }
    }
    return false;
}

function updateDisplay() {
    document.getElementById('displayName').textContent = player.name;
    document.getElementById('displayInstrument').textContent = `🎸 ${player.instrument.charAt(0).toUpperCase() + player.instrument.slice(1)}`;
    document.getElementById('displayGroup').textContent = player.group ? `🎸 Groupe: ${player.group.name}` : '🎤 Solo';
    document.getElementById('displayAge').textContent = Math.floor(player.age);
    document.getElementById('displayAddiction').textContent = Math.floor(player.addiction);
    
    const healthBar = document.getElementById('healthBar');
    const healthPercent = Math.max(0, Math.min(100, player.health));
    healthBar.style.width = healthPercent + '%';
    healthBar.textContent = Math.floor(player.health) + '%';
    healthBar.className = 'health-fill ' + (healthPercent > 60 ? 'health-good' : healthPercent > 30 ? 'health-medium' : 'health-bad');
}

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
        history: showHistoryView 
    };
    views[view](content);
}

function showConcertView(content) {
    const equipBonus = getTotalEquipmentBonus();
    const avgSkill = (player.skills.technique + player.skills.scene + player.skills.composition + player.skills.charisme) / 4;
    
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">🎤 Concerts</h2>
        ${player.concertCooldown > 0 ? `<div style="background: rgba(255, 165, 0, 0.3); border: 2px solid #ffa500; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: #ffa500;">
            ⏳ Concert en cours... ${player.concertCooldown}s restantes
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
            <button onclick="doConcert('bar')" ${player.concertCooldown > 0 ? 'disabled' : ''}>🍺 Bar Local<br><small>50-150€</small><br><small>60s</small></button>
            <button onclick="doConcert('club')" ${player.popularity < 50 || player.concertCooldown > 0 ? 'disabled' : ''}>🎵 Club<br><small>200-500€</small><br><small>60s</small></button>
            <button onclick="doConcert('salle')" ${player.popularity < 200 || player.concertCooldown > 0 ? 'disabled' : ''}>🏛️ Grande Salle<br><small>1000-2500€</small><br><small>60s</small></button>
            <button onclick="doConcert('theatre')" ${player.popularity < 500 || player.concertCooldown > 0 ? 'disabled' : ''}>🎭 Théâtre<br><small>3000-6000€</small><br><small>60s</small></button>
            <button onclick="doConcert('arena')" ${player.popularity < 1000 || player.concertCooldown > 0 ? 'disabled' : ''}>🏟️ Arena<br><small>8000-15000€</small><br><small>60s</small></button>
            <button onclick="doConcert('festival')" ${player.popularity < 2500 || player.concertCooldown > 0 ? 'disabled' : ''}>🎪 Festival<br><small>25000-60000€</small><br><small>60s</small></button>
        </div>
        <div id="concertResult"></div>`;
}

function getTotalEquipmentBonus() {
    let total = 0;
    for (let eq in player.equipment) {
        const level = player.equipment[eq];
        if (level > 0 && shopItems[eq]) total += shopItems[eq][level - 1].bonus;
    }
    return total;
}

function doConcert(type) {
    if (player.concertCooldown > 0) return;
    
    const avgSkill = (player.skills.technique + player.skills.scene + player.skills.composition + player.skills.charisme) / 4;
    const equipBonus = getTotalEquipmentBonus();
    
    const venues = {
        bar: { name: 'Bar Local', revenue: 100, fans: 20, difficulty: 0.3 },
        club: { name: 'Club', revenue: 350, fans: 100, difficulty: 0.5 },
        salle: { name: 'Grande Salle', revenue: 1750, fans: 400, difficulty: 0.65 },
        theatre: { name: 'Théâtre', revenue: 4500, fans: 800, difficulty: 0.7 },
        arena: { name: 'Arena', revenue: 11500, fans: 2000, difficulty: 0.75 },
        festival: { name: 'Festival', revenue: 42500, fans: 6000, difficulty: 0.85 }
    };
    
    const venue = venues[type];
    
    player.concertCooldown = 60;
    
    const skillMultiplier = (avgSkill + equipBonus) / 100;
    const successThreshold = venue.difficulty;
    const success = skillMultiplier > successThreshold && Math.random() < (skillMultiplier - successThreshold + 0.3);
    
    let quality = Math.min(1, skillMultiplier * (0.7 + Math.random() * 0.3));
    
    if (player.health < 50) quality *= 0.7;
    if (player.addiction > 50) quality *= 0.8;
    
    let revenue = Math.max(50, Math.floor(venue.revenue * quality));
    let newFans = Math.floor(venue.fans * quality);
    
    if (player.group) {
        revenue = Math.floor(revenue * player.group.bonus);
        newFans = Math.floor(newFans * player.group.bonus);
    }
    
    if (!success) {
        revenue = Math.max(50, Math.floor(revenue * 0.3));
        newFans = Math.floor(newFans * 0.2);
        player.popularity = Math.max(0, player.popularity - Math.floor(newFans / 5));
    }
    
    player.money += revenue;
    player.fans += newFans;
    player.popularity += Math.floor(newFans / 10);
    player.concertsPlayed++;
    
    const healthCost = Math.floor(Math.random() * 3) + 1 + Math.floor(venue.difficulty * 5);
    player.health -= healthCost;
    player.health = Math.max(0, player.health);
    
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
            <p style="color: #ffa500; margin-top: 10px;">⏳ Prochain concert dans 60 secondes</p>
        </div>`;
    
    updateDisplay();
    showView('concert');
}

function showTrainingView(content) {
    const skills = [
        { key: 'technique', name: 'Technique', icon: '🎸', effect: 'Améliore la qualité des concerts' },
        { key: 'scene', name: 'Présence Scénique', icon: '🔥', effect: 'Augmente l\'impact sur les fans' },
        { key: 'composition', name: 'Composition', icon: '🎵', effect: 'Permet de meilleures performances' },
        { key: 'charisme', name: 'Charisme', icon: '⭐', effect: 'Facilite l\'entrée dans les groupes' }
    ];
    
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">📚 Entraînement</h2>
        <p style="color: #ff6b6b; margin-bottom: 20px;">Améliore tes compétences pour devenir une légende ! Cooldown: 60 secondes</p>
        <div class="training-grid">
            ${skills.map(skill => {
                const cost = Math.floor(100 + player.skills[skill.key] * 5);
                const canTrain = player.trainingCooldowns[skill.key] === 0 && player.money >= cost && player.skills[skill.key] < 100;
                return `
                    <div style="background: rgba(139, 0, 0, 0.2); border: 2px solid #8b0000; padding: 15px; border-radius: 5px;">
                        <div style="font-size: 1.5em; margin-bottom: 10px;">${skill.icon}</div>
                        <div style="color: #ff0000; font-weight: bold; margin-bottom: 5px;">${skill.name}</div>
                        <div style="color: #ff6b6b; font-size: 0.9em; margin-bottom: 10px;">${skill.effect}</div>
                        <div style="color: #fff; margin-bottom: 10px;">Niveau: ${player.skills[skill.key]}/100</div>
                        <div class="health-bar" style="height: 10px;">
                            <div class="health-fill health-good" style="width: ${player.skills[skill.key]}%"></div>
                        </div>
                        ${player.trainingCooldowns[skill.key] > 0 ? 
                            `<div style="color: #ffa500; font-size: 0.9em; margin-top: 5px;">⏳ ${player.trainingCooldowns[skill.key]}s</div>` :
                            `<button onclick="trainSkill('${skill.key}')" ${!canTrain ? 'disabled' : ''}>S'entraîner (${cost} €)</button>`
                        }
                    </div>`;
            }).join('')}
        </div>`;
}

function trainSkill(skill) {
    const cost = Math.floor(100 + player.skills[skill] * 5);
    if (player.money < cost || player.trainingCooldowns[skill] > 0) return;
    
    player.money -= cost;
    const gain = Math.floor(Math.random() * 8) + 5;
    player.skills[skill] = Math.min(100, player.skills[skill] + gain);
    player.trainingCooldowns[skill] = 60;
    player.health -= 2;
    
    updateDisplay();
    showView('training');
}

function showShopView(content) {
    const categories = {
        instrument: 'Instruments', amplifier: 'Amplificateurs', lights: 'Éclairages',
        pyrotechnics: 'Pyrotechnie', soundSystem: 'Sonorisation', transport: 'Transport', studio: 'Studio'
    };
    
    let html = `<h2 style="color: #ff0000; margin-bottom: 20px;">🛒 Boutique d'Équipement</h2>
               <p style="color: #ff6b6b; margin-bottom: 20px;">💰 Argent: ${player.money} €</p>
               <p style="color: #ffa500; margin-bottom: 20px;">⚠️ Coûts de maintenance: ${calculateMaintenance()} € toutes les 90 secondes</p>`;
    
    for (let category in shopItems) {
        html += `<h3 style="color: #ff6b6b; margin: 20px 0 10px 0;">${categories[category]}</h3><div class="shop-grid">`;
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

function calculateMaintenance() {
    let cost = 0;
    for (let eq in player.equipment) {
        if (player.equipment[eq] > 0) cost += player.equipment[eq] * 50;
    }
    if (player.group) cost += 200;
    return cost;
}

function buyEquipment(category, level) {
    const item = shopItems[category][level - 1];
    if (player.money < item.cost || player.equipment[category] !== level - 1) return;
    
    player.money -= item.cost;
    player.equipment[category] = level;
    updateDisplay();
    showView('shop');
}

function showGroupsView(content) {
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">🎸 Groupes Disponibles</h2>
        <p style="color: #ff6b6b; margin-bottom: 20px;">Rejoins un groupe pour multiplier tes gains !</p>
        ${player.group ? `<div style="background: rgba(0, 139, 0, 0.3); border: 2px solid #00ff00; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
            <h3 style="color: #00ff00;">Groupe actuel: ${player.group.name}</h3>
            <p style="color: #fff;">Bonus: x${player.group.bonus} | Membres: ${player.group.members}</p>
            <button onclick="leaveGroup()">Quitter le groupe</button>
        </div>` : ''}
        <div class="shop-grid">
            ${groups.map(group => {
                const canJoin = player.popularity >= group.minPop && (!player.group || player.group.name !== group.name);
                return `
                    <div class="shop-item ${player.group?.name === group.name ? 'owned' : ''}">
                        <div style="color: #ff0000; font-weight: bold; font-size: 1.2em; margin-bottom: 10px;">${group.name}</div>
                        <div style="color: #ff6b6b; margin: 5px 0;">Membres: ${group.members}</div>
                        <div style="color: #ffa500; margin: 5px 0;">Bonus gains: x${group.bonus}</div>
                        <div style="color: #ff6b6b; margin: 5px 0; font-size: 0.9em;">Popularité requise: ${group.minPop}</div>
                        ${player.group?.name === group.name ? '<div style="color: #00ff00; font-weight: bold;">✓ MEMBRE ACTUEL</div>' :
                          `<button onclick="joinGroup(${groups.indexOf(group)})" ${!canJoin ? 'disabled' : ''}>Rejoindre</button>`}
                    </div>`;
            }).join('')}
        </div>`;
}

function joinGroup(index) {
    const group = groups[index];
    if (player.popularity < group.minPop) return;
    player.group = group;
    updateDisplay();
    showView('groups');
}

function leaveGroup() {
    player.group = null;
    updateDisplay();
    showView('groups');
}

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

function showLifestyleView(content) {
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">💊 Style de vie Rock'n'Roll</h2>
        <div style="background: rgba(255, 0, 0, 0.2); border: 2px solid #ff0000; padding: 20px; margin-bottom: 20px; border-radius: 5px;">
            <h3 style="color: #ff0000; margin-bottom: 15px;">⚠️ ATTENTION</h3>
            <p style="color: #ff6b6b;">Les drogues peuvent donner un boost temporaire, mais augmentent l'addiction et détruisent ta santé !</p>
            <p style="color: #ffa500; margin-top: 10px;">Addiction actuelle: ${Math.floor(player.addiction)}%</p>
            ${player.daysWithoutDrugs > 0 ? `<p style="color: #00ff00;">Jours sans drogue: ${player.daysWithoutDrugs}</p>` : ''}
        </div>
        <div class="action-grid">
            <button onclick="takeDrug('weed')" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c29 100%);">
                🌿 Cannabis<br>
                <small>+10 Charisme temporaire</small><br>
                <small>+5% Addiction</small><br>
                <small>-5% Santé</small><br>
                <small>500 €</small>
            </button>
            <button onclick="takeDrug('cocaine')" style="background: linear-gradient(135deg, #444 0%, #888 100%);">
                ❄️ Cocaïne<br>
                <small>+20 Scène temporaire</small><br>
                <small>+15% Addiction</small><br>
                <small>-15% Santé</small><br>
                <small>2000 €</small>
            </button>
            <button onclick="takeDrug('heroin')" style="background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 100%);">
                💉 Héroïne<br>
                <small>+30 Technique temporaire</small><br>
                <small>+30% Addiction</small><br>
                <small>-25% Santé</small><br>
                <small>5000 €</small>
            </button>
            <button onclick="goRehab()" style="background: linear-gradient(135deg, #0a5c8b 0%, #00aaff 100%);">
                🏥 Cure de Désintox<br>
                <small>-50% Addiction</small><br>
                <small>+20% Santé</small><br>
                <small>10000 €</small><br>
                <small>Repos pendant 120s</small>
            </button>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #ff6b6b; margin-bottom: 10px;">Autres activités</h3>
            <div class="action-grid">
                <button onclick="rest()" style="background: linear-gradient(135deg, #0a3d5c 0%, #0077bb 100%);">
                    😴 Se Reposer<br>
                    <small>+10% Santé</small><br>
                    <small>Repos 60s</small><br>
                    <small>Gratuit</small>
                </button>
                <button onclick="party()" style="background: linear-gradient(135deg, #5c0a5c 0%, #9900ff 100%);">
                    🎉 Faire la Fête<br>
                    <small>+50 Fans</small><br>
                    <small>-10% Santé</small><br>
                    <small>1000 €</small>
                </button>
            </div>
        </div>
        <div id="lifestyleResult"></div>
    `;
}

function takeDrug(type) {
    const drugs = {
        weed: { name: 'Cannabis', cost: 500, addiction: 5, health: 5, skill: 'charisme', boost: 10 },
        cocaine: { name: 'Cocaïne', cost: 2000, addiction: 15, health: 15, skill: 'scene', boost: 20 },
        heroin: { name: 'Héroïne', cost: 5000, addiction: 30, health: 25, skill: 'technique', boost: 30 }
    };
    
    const drug = drugs[type];
    if (player.money < drug.cost) {
        alert('Pas assez d\'argent !');
        return;
    }
    
    player.money -= drug.cost;
    player.addiction = Math.min(100, player.addiction + drug.addiction);
    player.health = Math.max(0, player.health - drug.health);
    player.skills[drug.skill] = Math.min(100, player.skills[drug.skill] + drug.boost);
    
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(139, 0, 139, 0.3); border: 2px solid #ff00ff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #ff00ff; margin-bottom: 10px;">💊 ${drug.name} consommée</h3>
            <p class="positive">+${drug.boost} ${drug.skill}</p>
            <p class="negative">+${drug.addiction}% Addiction</p>
            <p class="negative">-${drug.health}% Santé</p>
        </div>
    `;
    
    updateDisplay();
    showView('lifestyle');
}

function goRehab() {
    if (player.money < 10000) {
        alert('Pas assez d\'argent pour la cure !');
        return;
    }
    if (player.concertCooldown > 0) {
        alert('Tu ne peux pas faire de cure pendant un concert !');
        return;
    }
    
    player.money -= 10000;
    player.addiction = Math.max(0, player.addiction - 50);
    player.health = Math.min(100, player.health + 20);
    player.concertCooldown = 120;
    
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(0, 139, 139, 0.3); border: 2px solid #00ffff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #00ffff; margin-bottom: 10px;">🏥 Cure de Désintoxication</h3>
            <p class="positive">-50% Addiction</p>
            <p class="positive">+20% Santé</p>
            <p style="color: #ffa500;">⏳ Repos pendant 120 secondes</p>
        </div>
    `;
    
    updateDisplay();
    showView('lifestyle');
}

function rest() {
    if (player.concertCooldown > 0) {
        alert('Tu es déjà occupé !');
        return;
    }
    
    player.health = Math.min(100, player.health + 10);
    player.concertCooldown = 60;
    
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(0, 100, 139, 0.3); border: 2px solid #00aaff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #00aaff; margin-bottom: 10px;">😴 Repos bien mérité</h3>
            <p class="positive">+10% Santé</p>
            <p style="color: #ffa500;">⏳ 60 secondes de repos</p>
        </div>
    `;
    
    updateDisplay();
    showView('lifestyle');
}

function party() {
    if (player.money < 1000) {
        alert('Pas assez d\'argent !');
        return;
    }
    
    player.money -= 1000;
    player.fans += 50;
    player.popularity += 5;
    player.health = Math.max(0, player.health - 10);
    
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(153, 0, 255, 0.3); border: 2px solid #9900ff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #9900ff; margin-bottom: 10px;">🎉 Soirée mémorable !</h3>
            <p class="positive">+50 Fans</p>
            <p class="positive">+5 Popularité</p>
            <p class="negative">-10% Santé</p>
        </div>
    `;
    
    updateDisplay();
    showView('lifestyle');
}

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
                </div>
                <div style="color: #888; font-size: 0.85em; margin-top: 10px; text-align: right;">${career.date}</div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}