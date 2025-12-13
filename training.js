// Affichage de la vue entraînement
function showTrainingView(content) {
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

// Entraînement d'une compétence
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