// Démarrage du jeu
function startGame() {
    const name = document.getElementById('playerName').value.trim();
    const instrument = document.getElementById('instrument').value;
    if (!name) { alert('Entre un nom de scène !'); return; }
    
    player.name = name;
    player.instrument = instrument;
    player.isDead = false;
    
    // Code secret : stats infinies
    if (name === 'Konami Code') {
        player.infiniteMoney = true;
        player.infiniteStats = true;
    }
    
    document.getElementById('creationScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    updateDisplay();
    showView('concert');
    
    setInterval(() => {
        gameTime++;
        if (gameTime % 30 === 0) passTime();
        updateCooldowns();
        updateAlbums();
    }, 1000);
}

// Gestion du temps
function passTime() {
    player.age += 0.15;
    
    // Code secret : stats infinies
    if (player.infiniteStats) {
        player.money = 999999;
        player.fans = 999999;
        player.popularity = 999999;
    }
    
    // Gestion de l'addiction
    if (player.addiction > 0) {
        player.health -= player.addiction / 15;
        player.daysWithoutDrugs = 0;
        if (Math.random() < 0.1) player.addiction = Math.max(0, player.addiction - 0.5);
    } else {
        // 0.15 an = environ 55 jours, donc on incrémente proportionnellement
        player.daysWithoutDrugs += 55;
        if (player.health < 100) player.health += 0.5;
    }
    
    // Coûts de maintenance
    if (gameTime % 90 === 0 && hasAnyEquipment()) {
        let maintenanceCost = calculateMaintenance();
        player.money -= maintenanceCost;
        if (player.money < 0) {
            player.health -= 5;
        }
    }
    
    // Perte de popularité
    if (gameTime % 120 === 0 && player.popularity > 0) {
        player.popularity = Math.max(0, player.popularity - Math.floor(player.popularity * 0.02));
    }
    
    // Effets du vieillissement
    if (player.age > 50 && Math.random() < 0.02) player.health -= Math.random() * 5;
    if (player.age > 60 && Math.random() < 0.05) player.health -= Math.random() * 10;
    if (player.age > 70 && Math.random() < 0.08) player.health -= Math.random() * 15;
    if (player.age > 80) player.health -= 0.5;
    
    player.health = Math.max(0, player.health);
    
    if (player.health <= 0 || player.money < 0) gameOver();
    
    if (gameTime % 30 === 0) saveGame();
    
    updateDisplay();
}

// Gestion des cooldowns
function updateCooldowns() {
    for (let skill in player.trainingCooldowns) {
        if (player.trainingCooldowns[skill] > 0) {
            player.trainingCooldowns[skill]--;
        }
    }
    if (player.concertCooldown > 0) {
        player.concertCooldown--;
    }
    if (player.albumCooldown > 0) {
        player.albumCooldown--;
    }
    if (player.restCooldown > 0) {
        player.restCooldown--;
    }
    if (player.partyCooldown > 0) {
        player.partyCooldown--;
    }
    if (currentView === 'training' || currentView === 'concert' || currentView === 'albums' || currentView === 'lifestyle') {
        showView(currentView);
    }
}

// Mise à jour des revenus des albums
function updateAlbums() {
    player.albums.forEach(album => {
        // Revenus par minute pour les albums populaires (sauf démos)
        if (album.isPopular && album.albumTypeKey !== 'demo' && gameTime % 60 === 0) {
            const revenue = album.revenuePerMinute;
            const newFans = album.fansPerMinute;
            player.money += revenue;
            player.fans += newFans;
        }
    });
}

// Vérifier si le joueur est occupé
function isPlayerBusy() {
    return player.concertCooldown > 0 || player.albumCooldown > 0 || player.restCooldown > 0 || player.partyCooldown > 0 || hasTrainingCooldown();
}

// Vérifier si un entraînement est en cours
function hasTrainingCooldown() {
    for (let skill in player.trainingCooldowns) {
        if (player.trainingCooldowns[skill] > 0) return true;
    }
    return false;
}

// Obtenir le message d'activité en cours
function getCurrentActivityMessage() {
    if (player.concertCooldown > 0) {
        return `⏳ Concert en cours... ${player.concertCooldown}s restantes`;
    }
    if (player.albumCooldown > 0) {
        return `⏳ Enregistrement en cours... ${player.albumCooldown}s restantes`;
    }
    if (player.restCooldown > 0) {
        return `⏳ Repos en cours... ${player.restCooldown}s restantes`;
    }
    if (player.partyCooldown > 0) {
        return `⏳ Fête en cours... ${player.partyCooldown}s restantes`;
    }
    for (let skill in player.trainingCooldowns) {
        if (player.trainingCooldowns[skill] > 0) {
            const skillName = skills.find(s => s.key === skill)?.name || skill;
            return `⏳ Entraînement ${skillName} en cours... ${player.trainingCooldowns[skill]}s restantes`;
        }
    }
    return null;
}

// Fin de partie
function gameOver() {
    player.isDead = true;
    
    let cause = '';
    if (player.money < 0) {
        cause = 'Faillite... Tu es dans le négatif et ruiné.';
    } else if (player.addiction > 70) {
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
        albums: player.albums.length,
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
            <p>💿 Albums sortis: ${player.albums.length}</p>
            <p>⭐ Popularité maximale: ${player.popularity}</p>
            ${player.group ? `<p>🎸 Dernier groupe: ${player.group.name}</p>` : ''}
        </div>`;
    
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('deathScreen').classList.add('active');
}

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    loadGame();
});