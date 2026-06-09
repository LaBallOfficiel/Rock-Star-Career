// Démarrage du jeu
function startGame() {
    const name = document.getElementById('playerName').value.trim();
    const instrument = document.getElementById('instrument').value;
    if (!name) { alert('Entre un nom de scène !'); return; }
    
    player.name = name;
    player.instrument = instrument;
    player.isDead = false;
    player.money = 800; // Plus généreux au départ
    
    // Code secret : stats infinies
    if (name === 'Konami Code') {
        player.infiniteMoney = true;
        player.infiniteStats = true;
    }
    
    document.getElementById('creationScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    updateDisplay();
    showView('concert');
    
    // Toast de bienvenue
    showToast(`🎸 Bienvenue ${name} ! Lance-toi avec un concert au Bar Local pour commencer ta carrière !`, 5000);
    
    setInterval(() => {
        gameTime++;
        if (gameTime % 30 === 0) passTime();
        updateCooldowns();
        updateAlbums();
        if (gameTime % 5 === 0) checkAchievements();
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
        player.health -= player.addiction / 18; // Un peu plus lent
        player.daysWithoutDrugs = 0;
        if (Math.random() < 0.12) player.addiction = Math.max(0, player.addiction - 0.5);
    } else {
        player.daysWithoutDrugs += 55;
        if (player.health < 100) player.health += 0.8; // Récup un peu plus rapide
    }
    
    // Coûts de maintenance (toutes les 90s) — réduits de 20%
    if (gameTime % 90 === 0 && hasAnyEquipment()) {
        let maintenanceCost = calculateMaintenance();
        player.money -= maintenanceCost;
        if (player.money < 0) {
            player.health -= 5;
            showToast('⚠️ Tu n\'as plus assez d\'argent pour la maintenance ! Santé -5%', 3000);
        }
    }
    
    // Perte de popularité — plus lente (toutes les 180s au lieu de 120s, et seulement 1%)
    if (gameTime % 180 === 0 && player.popularity > 0) {
        player.popularity = Math.max(0, player.popularity - Math.floor(player.popularity * 0.01));
    }
    
    // Effets du vieillissement
    if (player.age > 50 && Math.random() < 0.02) player.health -= Math.random() * 4;
    if (player.age > 60 && Math.random() < 0.04) player.health -= Math.random() * 8;
    if (player.age > 70 && Math.random() < 0.07) player.health -= Math.random() * 12;
    if (player.age > 80) player.health -= 0.4;
    
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
    if (player.concertCooldown > 0) player.concertCooldown--;
    if (player.albumCooldown > 0) player.albumCooldown--;
    if (player.restCooldown > 0) player.restCooldown--;
    if (player.partyCooldown > 0) player.partyCooldown--;
    if (player.jobCooldown > 0) player.jobCooldown--;
    if (player.socialCooldown > 0) player.socialCooldown--;

    if (currentView === 'training' || currentView === 'concert' || currentView === 'albums' || currentView === 'lifestyle' || currentView === 'social') {
        showView(currentView);
    }
    // Mise à jour du revenu passif dans le header
    updatePassiveIncomeDisplay();
}

// Mise à jour des revenus des albums (toutes les 30s au lieu de 60s, divisé par 2)
function updateAlbums() {
    if (gameTime % 30 === 0) {
        let totalRevenue = 0;
        let totalFans = 0;
        player.albums.forEach(album => {
            if (album.isPopular && album.albumTypeKey !== 'demo') {
                const revenue = Math.floor(album.revenuePerMinute / 2);
                const newFans = Math.floor(album.fansPerMinute / 2);
                totalRevenue += revenue;
                totalFans += newFans;
            }
        });
        if (totalRevenue > 0) {
            player.money += totalRevenue;
            player.fans += totalFans;
            // Toast occasionnel
            if (gameTime % 120 === 0 && totalRevenue > 0) {
                showToast(`💿 Revenus passifs : +${totalRevenue} € et +${totalFans} fans !`, 2500);
            }
        }
    }
}

// Calcul du revenu passif par minute
function getPassiveIncomePerMinute() {
    let total = 0;
    player.albums.forEach(album => {
        if (album.isPopular && album.albumTypeKey !== 'demo') {
            total += album.revenuePerMinute;
        }
    });
    return total;
}

// Affichage du revenu passif dans le header
function updatePassiveIncomeDisplay() {
    const el = document.getElementById('passiveIncomeDisplay');
    if (!el) return;
    const passive = getPassiveIncomePerMinute();
    if (passive > 0) {
        el.style.display = 'inline';
        el.textContent = `📀 ${passive.toLocaleString()} €/min`;
    } else {
        el.style.display = 'none';
    }
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
    if (player.concertCooldown > 0) return `⏳ Concert en cours... ${player.concertCooldown}s restantes`;
    if (player.albumCooldown > 0) return `⏳ Enregistrement en cours... ${player.albumCooldown}s restantes`;
    if (player.restCooldown > 0) return `⏳ Repos en cours... ${player.restCooldown}s restantes`;
    if (player.partyCooldown > 0) return `⏳ Fête en cours... ${player.partyCooldown}s restantes`;
    for (let skill in player.trainingCooldowns) {
        if (player.trainingCooldowns[skill] > 0) {
            const skillName = skills.find(s => s.key === skill)?.name || skill;
            return `⏳ Entraînement ${skillName} en cours... ${player.trainingCooldowns[skill]}s restantes`;
        }
    }
    return null;
}

// =====================
// SYSTÈME D'ACHIEVEMENTS
// =====================
function checkAchievements() {
    if (!player.unlockedAchievements) player.unlockedAchievements = [];
    
    achievements.forEach(ach => {
        if (!player.unlockedAchievements.includes(ach.id) && ach.check()) {
            player.unlockedAchievements.push(ach.id);
            // Appliquer la récompense
            if (ach.reward.money) player.money += ach.reward.money;
            if (ach.reward.fans) player.fans += ach.reward.fans;
            if (ach.reward.popularity) player.popularity += ach.reward.popularity;
            if (ach.reward.health) player.health = Math.min(100, player.health + ach.reward.health);
            
            // Construire le message de récompense
            let rewardText = [];
            if (ach.reward.money) rewardText.push(`+${ach.reward.money.toLocaleString()} €`);
            if (ach.reward.fans) rewardText.push(`+${ach.reward.fans.toLocaleString()} fans`);
            if (ach.reward.popularity) rewardText.push(`+${ach.reward.popularity} popularité`);
            if (ach.reward.health) rewardText.push(`+${ach.reward.health}% santé`);
            
            showToast(`${ach.icon} ACHIEVEMENT : "${ach.name}" — ${ach.desc} ! Récompense : ${rewardText.join(', ')}`, 5000);
            updateDisplay();
        }
    });
}

// =====================
// SYSTÈME DE TOAST
// =====================
function showToast(message, duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    container.appendChild(toast);
    
    // Animation entrée
    setTimeout(() => toast.classList.add('toast-show'), 10);
    // Sortie
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
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
        achievements: (player.unlockedAchievements || []).length,
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
            <p>🏆 Achievements: ${(player.unlockedAchievements || []).length}/${achievements.length}</p>
            ${player.group ? `<p>🎸 Dernier groupe: ${player.group.name}</p>` : ''}
        </div>`;
    
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('deathScreen').classList.add('active');
}

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    loadGame();
});
