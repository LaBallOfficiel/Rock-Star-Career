// Affichage de la vue entraînement
function showTrainingView(content) {
    const activityMsg = getCurrentActivityMessage();
    
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">📚 Entraînement</h2>
        ${activityMsg ? `<div style="background: rgba(255, 165, 0, 0.3); border: 2px solid #ffa500; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: #ffa500;">
            ${activityMsg}
        </div>` : ''}
        <p style="color: #ff6b6b; margin-bottom: 20px;">Améliore tes compétences pour devenir une légende ! Cooldown: 10 secondes</p>
        <div class="training-grid">
            ${skills.map(skill => {
                const cost = Math.floor(50 + player.skills[skill.key] * 3); // Moins cher
                const canTrain = !isPlayerBusy() && player.money >= cost && player.skills[skill.key] < 100;
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
                            `<div style="color: #ffa500; font-size: 0.9em; margin-top: 8px;">⏳ ${player.trainingCooldowns[skill.key]}s</div>` :
                            player.skills[skill.key] >= 100 ?
                            `<div style="color: #00ff00; font-size: 0.9em; margin-top: 8px;">✅ MAX</div>` :
                            `<button onclick="trainSkill('${skill.key}')" ${!canTrain ? 'disabled' : ''}>S'entraîner (${cost} €)</button>`
                        }
                    </div>`;
            }).join('')}
        </div>`;
}

// Entraînement d'une compétence
function trainSkill(skill) {
    if (isPlayerBusy()) {
        showToast('⏳ Tu es déjà occupé ! Termine ton activité en cours avant de t\'entraîner.', 2000);
        return;
    }
    
    const cost = Math.floor(50 + player.skills[skill] * 3);
    if (player.money < cost) return;
    
    player.money -= cost;
    const gain = Math.floor(Math.random() * 8) + 6; // Un peu plus généreux (5-12 -> 6-13)
    player.skills[skill] = Math.min(100, player.skills[skill] + gain);
    player.trainingCooldowns[skill] = 10;
    player.health -= 1; // Moins pénalisant (2 -> 1)
    
    showToast(`${skills.find(s=>s.key===skill)?.icon || '📈'} +${gain} en ${skills.find(s=>s.key===skill)?.name || skill} !`, 2000);
    
    updateDisplay();
    showView('training');
}
