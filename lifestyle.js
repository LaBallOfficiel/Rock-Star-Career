// Affichage de la vue style de vie
function showLifestyleView(content) {
    const activityMsg = getCurrentActivityMessage();
    
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">💊 Style de vie Rock'n'Roll</h2>
        ${activityMsg ? `<div style="background: rgba(255, 165, 0, 0.3); border: 2px solid #ffa500; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: #ffa500;">
            ${activityMsg}
        </div>` : ''}
        <div style="background: rgba(255, 0, 0, 0.2); border: 2px solid #ff0000; padding: 20px; margin-bottom: 20px; border-radius: 5px;">
            <h3 style="color: #ff0000; margin-bottom: 15px;">⚠️ ATTENTION</h3>
            <p style="color: #ff6b6b;">Les drogues peuvent donner un boost temporaire, mais augmentent l'addiction et détruisent ta santé !</p>
            <p style="color: #ffa500; margin-top: 10px;">Addiction actuelle: ${Math.floor(player.addiction)}%</p>
            ${player.daysWithoutDrugs > 0 ? `<p style="color: #00ff00;">Jours sans drogue: ${player.daysWithoutDrugs}</p>` : ''}
        </div>
        <div class="action-grid">
            <button onclick="takeDrug('weed')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #2d5016 0%, #4a7c29 100%);">
                🌿 Cannabis<br>
                <small>+10 Charisme temporaire</small><br>
                <small>+5% Addiction</small><br>
                <small>-5% Santé</small><br>
                <small>500 €</small>
            </button>
            <button onclick="takeDrug('cocaine')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #444 0%, #888 100%);">
                ❄️ Cocaïne<br>
                <small>+20 Scène temporaire</small><br>
                <small>+15% Addiction</small><br>
                <small>-15% Santé</small><br>
                <small>2000 €</small>
            </button>
            <button onclick="takeDrug('heroin')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 100%);">
                💉 Héroïne<br>
                <small>+30 Technique temporaire</small><br>
                <small>+30% Addiction</small><br>
                <small>-25% Santé</small><br>
                <small>5000 €</small>
            </button>
            <button onclick="goRehab()" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #0a5c8b 0%, #00aaff 100%);">
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
                <button onclick="rest()" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #0a3d5c 0%, #0077bb 100%);">
                    😴 Se Reposer<br>
                    <small>+10% Santé</small><br>
                    <small>Repos 15s</small><br>
                    <small>Gratuit</small>
                </button>
                <button onclick="party()" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #5c0a5c 0%, #9900ff 100%);">
                    🎉 Faire la Fête<br>
                    <small>+50 Fans</small><br>
                    <small>+5% Addiction</small><br>
                    <small>-10% Santé</small><br>
                    <small>1000 €</small><br>
                    <small>30s cooldown</small>
                </button>
            </div>
        </div>
        <div id="lifestyleResult"></div>
    `;
}

// Prendre de la drogue
function takeDrug(type) {
    if (isPlayerBusy()) {
        alert('Tu es déjà occupé ! Termine ton activité en cours.');
        return;
    }
    
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

// Cure de désintoxication
function goRehab() {
    if (isPlayerBusy()) {
        alert('Tu es déjà occupé ! Termine ton activité en cours avant de faire une cure.');
        return;
    }
    
    if (player.money < 10000) {
        alert('Pas assez d\'argent pour la cure !');
        return;
    }
    
    player.money -= 10000;
    player.addiction = Math.max(0, player.addiction - 50);
    player.health = Math.min(100, player.health + 20);
    player.restCooldown = 120;
    
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

// Se reposer
function rest() {
    if (isPlayerBusy()) {
        alert('Tu es déjà occupé ! Termine ton activité en cours.');
        return;
    }
    
    player.health = Math.min(100, player.health + 10);
    player.restCooldown = 15;
    
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(0, 100, 139, 0.3); border: 2px solid #00aaff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #00aaff; margin-bottom: 10px;">😴 Repos bien mérité</h3>
            <p class="positive">+10% Santé</p>
            <p style="color: #ffa500;">⏳ 15 secondes de repos</p>
        </div>
    `;
    
    updateDisplay();
    showView('lifestyle');
}

// Faire la fête
function party() {
    if (isPlayerBusy()) {
        alert('Tu es déjà occupé ! Termine ton activité en cours.');
        return;
    }
    
    if (player.money < 1000) {
        alert('Pas assez d\'argent !');
        return;
    }
    
    player.money -= 1000;
    player.fans += 50;
    player.popularity += 5;
    player.health = Math.max(0, player.health - 10);
    player.addiction = Math.min(100, player.addiction + 5);
    player.partyCooldown = 30;
    
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(153, 0, 255, 0.3); border: 2px solid #9900ff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #9900ff; margin-bottom: 10px;">🎉 Soirée mémorable !</h3>
            <p class="positive">+50 Fans</p>
            <p class="positive">+5 Popularité</p>
            <p class="negative">-10% Santé</p>
            <p class="negative">+5% Addiction</p>
            <p style="color: #ffa500;">⏳ Prochaine fête dans 30 secondes</p>
        </div>
    `;
    
    updateDisplay();
    showView('lifestyle');
}