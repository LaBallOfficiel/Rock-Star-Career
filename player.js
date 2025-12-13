// État du joueur
let player = {
    name: '', 
    instrument: '', 
    age: 18, 
    health: 100, 
    addiction: 0,
    money: 300, 
    fans: 0, 
    popularity: 0, 
    concertsPlayed: 0, 
    group: null,
    skills: { technique: 10, scene: 10, composition: 10, charisme: 10, marketing: 10, endurance: 10 },
    equipment: { instrument: 0, amplifier: 0, lights: 0, pyrotechnics: 0, soundSystem: 0, transport: 0, studio: 0 },
    trainingCooldowns: { technique: 0, scene: 0, composition: 0, charisme: 0, marketing: 0, endurance: 0 },
    daysWithoutDrugs: 0,
    concertCooldown: 0,
    albums: [],
    albumCooldown: 0,
    restCooldown: 0,
    isDead: false
};

// Variables globales
let gameTime = 0;
let currentView = 'concert';
let careerHistory = JSON.parse(localStorage.getItem('careerHistory') || '[]');

// Fonctions de gestion du joueur
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

function getTotalEquipmentBonus() {
    let total = 0;
    for (let eq in player.equipment) {
        const level = player.equipment[eq];
        if (level > 0 && shopItems[eq]) total += shopItems[eq][level - 1].bonus;
    }
    return total;
}

function hasAnyEquipment() {
    for (let eq in player.equipment) {
        if (player.equipment[eq] > 0) return true;
    }
    return false;
}

function calculateMaintenance() {
    let cost = 0;
    for (let eq in player.equipment) {
        if (player.equipment[eq] > 0) cost += player.equipment[eq] * 50;
    }
    if (player.group) cost += 200;
    return cost;
}

// Sauvegarde et chargement
function saveGame() {
    if (!player.isDead) {
        localStorage.setItem('currentGame', JSON.stringify(player));
    }
}

function loadGame() {
    const saved = localStorage.getItem('currentGame');
    if (saved) {
        const savedPlayer = JSON.parse(saved);
        
        // Vérifier si le joueur sauvegardé est mort
        if (savedPlayer.isDead || savedPlayer.health <= 0 || savedPlayer.money < 0) {
            localStorage.removeItem('currentGame');
            return false;
        }
        
        const confirmation = confirm('Une sauvegarde existe. Voulez-vous la charger ?');
        if (confirmation) {
            player = savedPlayer;
            player.isDead = false;
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
            return true;
        }
    }
    return false;
}