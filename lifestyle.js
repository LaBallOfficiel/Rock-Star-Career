// Affichage de la vue style de vie
function showLifestyleView(content) {
    const activityMsg = getCurrentActivityMessage();
    
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">💊 Style de vie Rock'n'Roll</h2>
        ${activityMsg ? `<div style="background: rgba(255, 165, 0, 0.3); border: 2px solid #ffa500; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: #ffa500;">
            ${activityMsg}
        </div>` : ''}

        <!-- BIEN-ÊTRE & SANTÉ -->
        <div style="background: rgba(0,80,0,0.2); border: 2px solid #00aa00; padding: 20px; margin-bottom: 20px; border-radius: 5px;">
            <h3 style="color: #00cc00; margin-bottom: 15px;">🌿 Bien-être & Santé</h3>
            <p style="color: #aaffaa; margin-bottom: 15px; font-size:0.9em;">Récupère de la santé et réduis le stress de la vie de rockstar.</p>
            <div class="action-grid">
                <button onclick="doWellness('spa')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #0d4d4d 0%, #00aaaa 100%);">
                    🛁 Spa de Luxe<br>
                    <small>+25% Santé</small><br>
                    <small>-5% Addiction</small><br>
                    <small>⏳ 30s repos</small><br>
                    <small>3 000 €</small>
                </button>
                <button onclick="doWellness('coach')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #1a3a00 0%, #44aa00 100%);">
                    🏋️ Coach Personnel<br>
                    <small>+15% Santé</small><br>
                    <small>+5 Endurance</small><br>
                    <small>⏳ 20s</small><br>
                    <small>1 500 €</small>
                </button>
                <button onclick="doWellness('nutritionist')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #2a1a00 0%, #aa7700 100%);">
                    🥗 Nutritionniste<br>
                    <small>+20% Santé</small><br>
                    <small>Effet durable</small><br>
                    <small>⏳ 15s</small><br>
                    <small>2 000 €</small>
                </button>
                <button onclick="doWellness('vacation')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #001a4d 0%, #0055ff 100%);">
                    ✈️ Vacances à Ibiza<br>
                    <small>+50% Santé</small><br>
                    <small>-20% Addiction</small><br>
                    <small>+100 Fans</small><br>
                    <small>⏳ 60s</small><br>
                    <small>15 000 €</small>
                </button>
            </div>
        </div>

        <!-- TRAVAIL ALIMENTAIRE -->
        <div style="background: rgba(30,30,0,0.3); border: 2px solid #aaaa00; padding: 20px; margin-bottom: 20px; border-radius: 5px;">
            <h3 style="color: #ffff00; margin-bottom: 10px;">💼 Jobs Alimentaires</h3>
            <p style="color: #ffffaa; margin-bottom: 15px; font-size:0.9em;">Quand l'argent manque, un vrai boulot peut dépanner... mais ça prend du temps.</p>
            <div class="action-grid">
                <button onclick="doJob('barman')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #3a2000 0%, #aa6600 100%);">
                    🍺 Barman<br>
                    <small>+400 €</small><br>
                    <small>⏳ 3 minutes</small><br>
                    <small>Gratuit</small>
                </button>
                <button onclick="doJob('guitar_teacher')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #1a001a 0%, #880088 100%);">
                    🎸 Prof de Guitare<br>
                    <small>+900 €</small><br>
                    <small>+3 Technique</small><br>
                    <small>⏳ 3 minutes</small><br>
                    <small>Gratuit</small>
                </button>
                <button onclick="doJob('security')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #1a1a1a 0%, #555555 100%);">
                    🛡️ Videur<br>
                    <small>+600 €</small><br>
                    <small>+2 Endurance</small><br>
                    <small>⏳ 3 minutes</small><br>
                    <small>Gratuit</small>
                </button>
                <button onclick="doJob('studio_tech')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #001a3a 0%, #003388 100%);">
                    🎛️ Technicien Studio<br>
                    <small>+1 200 €</small><br>
                    <small>+3 Composition</small><br>
                    <small>⏳ 3 minutes</small><br>
                    <small>Popularité ≥ 50</small>
                </button>
            </div>
            ${player.jobCooldown > 0 ? `<p style="color:#ffa500; margin-top:10px;">⏳ Prochain job disponible dans ${player.jobCooldown}s</p>` : ''}
        </div>

        <!-- DROGUES -->
        <div style="background: rgba(255, 0, 0, 0.15); border: 2px solid #ff0000; padding: 20px; margin-bottom: 20px; border-radius: 5px;">
            <h3 style="color: #ff0000; margin-bottom: 10px;">⚠️ Substances</h3>
            <p style="color: #ff6b6b; font-size:0.9em;">Boost temporaire, mais attention à l'addiction et à ta santé.</p>
            <p style="color: #ffa500; margin: 8px 0;">Addiction actuelle: ${Math.floor(player.addiction)}%
            ${player.daysWithoutDrugs > 0 ? ` | <span style="color:#00ff00">Jours sans drogue: ${player.daysWithoutDrugs}</span>` : ''}</p>
            <div class="action-grid">
                <button onclick="takeDrug('weed')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #2d5016 0%, #4a7c29 100%);">
                    🌿 Cannabis<br><small>+10 Charisme</small><br><small>+5% Addiction</small><br><small>500 €</small>
                </button>
                <button onclick="takeDrug('cocaine')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #444 0%, #888 100%);">
                    ❄️ Cocaïne<br><small>+20 Scène</small><br><small>+15% Addiction</small><br><small>2 000 €</small>
                </button>
                <button onclick="takeDrug('heroin')" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 100%);">
                    💉 Héroïne<br><small>+30 Technique</small><br><small>+30% Addiction</small><br><small>5 000 €</small>
                </button>
                <button onclick="goRehab()" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #0a5c8b 0%, #00aaff 100%);">
                    🏥 Désintox<br><small>-50% Addiction</small><br><small>+20% Santé</small><br><small>⏳ 120s</small><br><small>10 000 €</small>
                </button>
            </div>
        </div>

        <!-- REPOS & FÊTE -->
        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #ff6b6b; margin-bottom: 15px;">🎉 Repos & Fête</h3>
            <div class="action-grid">
                <button onclick="rest()" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #0a3d5c 0%, #0077bb 100%);">
                    😴 Se Reposer<br><small>+10% Santé</small><br><small>⏳ 15s</small><br><small>Gratuit</small>
                </button>
                <button onclick="party()" ${isPlayerBusy() ? 'disabled' : ''} style="background: linear-gradient(135deg, #5c0a5c 0%, #9900ff 100%);">
                    🎉 Faire la Fête<br><small>+50 Fans</small><br><small>+5% Addiction</small><br><small>-10% Santé</small><br><small>⏳ 30s</small><br><small>1 000 €</small>
                </button>
            </div>
        </div>

        <div id="lifestyleResult"></div>
    `;
}

// =====================
// BIEN-ÊTRE
// =====================
function doWellness(type) {
    if (isPlayerBusy()) {
        showToast('⏳ Tu es déjà occupé ! Termine ton activité en cours.', 2000);
        return;
    }

    const options = {
        spa:          { name: 'Spa de Luxe',        cost: 3000,  health: 25, addiction: -5,  endurance: 0,  composition: 0, fans: 0,   cooldown: 30 },
        coach:        { name: 'Coach Personnel',    cost: 1500,  health: 15, addiction: 0,   endurance: 5,  composition: 0, fans: 0,   cooldown: 20 },
        nutritionist: { name: 'Nutritionniste',     cost: 2000,  health: 20, addiction: 0,   endurance: 0,  composition: 0, fans: 0,   cooldown: 15 },
        vacation:     { name: 'Vacances à Ibiza',   cost: 15000, health: 50, addiction: -20, endurance: 0,  composition: 0, fans: 100, cooldown: 60 },
    };

    const opt = options[type];
    if (!opt) return;
    if (player.money < opt.cost) { showToast('💸 Pas assez d\'argent !', 2000); return; }

    player.money -= opt.cost;
    player.health = Math.min(100, player.health + opt.health);
    if (opt.addiction) player.addiction = Math.max(0, player.addiction + opt.addiction);
    if (opt.endurance) player.skills.endurance = Math.min(100, player.skills.endurance + opt.endurance);
    if (opt.composition) player.skills.composition = Math.min(100, player.skills.composition + opt.composition);
    if (opt.fans) player.fans += opt.fans;
    player.restCooldown = opt.cooldown;

    const lines = [
        `<p class="positive">+${opt.health}% Santé</p>`,
        opt.addiction < 0 ? `<p class="positive">${opt.addiction}% Addiction</p>` : '',
        opt.endurance ? `<p class="positive">+${opt.endurance} Endurance</p>` : '',
        opt.fans ? `<p class="positive">+${opt.fans} Fans</p>` : '',
    ].filter(Boolean).join('');

    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(0,100,0,0.3); border: 2px solid #00cc00; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #00cc00; margin-bottom: 10px;">🌿 ${opt.name}</h3>
            ${lines}
            <p style="color: #ffa500;">⏳ ${opt.cooldown} secondes de récupération</p>
        </div>`;

    updateDisplay();
    showView('lifestyle');
}

// =====================
// JOBS
// =====================
function doJob(type) {
    if (isPlayerBusy()) {
        showToast('⏳ Tu es déjà occupé !', 2000);
        return;
    }
    if ((player.jobCooldown || 0) > 0) {
        showToast(`⏳ Prends une pause ! Prochain job dans ${player.jobCooldown}s`, 2000);
        return;
    }

    const jobs = {
        barman:        { name: 'Barman',             pay: 400,  skillKey: null,        skillGain: 0, popRequired: 0  },
        guitar_teacher:{ name: 'Prof de Guitare',    pay: 900,  skillKey: 'technique', skillGain: 3, popRequired: 0  },
        security:      { name: 'Videur',             pay: 600,  skillKey: 'endurance', skillGain: 2, popRequired: 0  },
        studio_tech:   { name: 'Technicien Studio',  pay: 1200, skillKey: 'composition',skillGain: 3, popRequired: 50 },
    };

    const job = jobs[type];
    if (!job) return;
    if (player.popularity < job.popRequired) {
        showToast(`⭐ Popularité insuffisante (${job.popRequired} requise)`, 2000);
        return;
    }

    // Le job prend 3 minutes = 180 secondes de cooldown
    player.restCooldown = 180;
    player.jobCooldown = 300; // cooldown avant de retravailler (5 min)

    const pay = job.pay + Math.floor(Math.random() * job.pay * 0.2); // ±20% aléatoire
    player.money += pay;
    if (job.skillKey) player.skills[job.skillKey] = Math.min(100, player.skills[job.skillKey] + job.skillGain);
    player.health = Math.max(0, player.health - 3); // Un peu fatigant

    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(100,100,0,0.3); border: 2px solid #aaaa00; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #ffff00; margin-bottom: 10px;">💼 ${job.name}</h3>
            <p class="positive">+${pay} €</p>
            ${job.skillKey ? `<p class="positive">+${job.skillGain} ${job.skillKey}</p>` : ''}
            <p class="negative">-3% Santé</p>
            <p style="color: #ffa500;">⏳ 3 minutes de travail…</p>
        </div>`;

    showToast(`💼 Tu travailles comme ${job.name}... +${pay} € !`, 4000);
    updateDisplay();
    showView('lifestyle');
}

// =====================
// DROGUES (inchangé)
// =====================
function takeDrug(type) {
    if (isPlayerBusy()) {
        showToast('⏳ Tu es déjà occupé ! Termine ton activité en cours.', 2000);
        return;
    }
    const drug = drugs[type];
    if (player.money < drug.cost) { showToast('💸 Pas assez d\'argent !', 2000); return; }
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
        </div>`;
    updateDisplay();
    showView('lifestyle');
}

function goRehab() {
    if (isPlayerBusy()) { showToast('⏳ Tu es déjà occupé !', 2000); return; }
    if (player.money < 10000) { showToast('💸 Pas assez d\'argent pour la cure !', 2000); return; }
    player.money -= 10000;
    player.addiction = Math.max(0, player.addiction - 50);
    player.health = Math.min(100, player.health + 20);
    player.restCooldown = 120;
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(0,139,139,0.3); border: 2px solid #00ffff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #00ffff; margin-bottom: 10px;">🏥 Cure de Désintoxication</h3>
            <p class="positive">-50% Addiction</p><p class="positive">+20% Santé</p>
            <p style="color: #ffa500;">⏳ 120 secondes de repos</p>
        </div>`;
    updateDisplay();
    showView('lifestyle');
}

function rest() {
    if (isPlayerBusy()) { showToast('⏳ Tu es déjà occupé !', 2000); return; }
    player.health = Math.min(100, player.health + 10);
    player.restCooldown = 15;
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(0,100,139,0.3); border: 2px solid #00aaff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #00aaff; margin-bottom: 10px;">😴 Repos bien mérité</h3>
            <p class="positive">+10% Santé</p><p style="color: #ffa500;">⏳ 15 secondes</p>
        </div>`;
    updateDisplay();
    showView('lifestyle');
}

function party() {
    if (isPlayerBusy()) { showToast('⏳ Tu es déjà occupé !', 2000); return; }
    if (player.money < 1000) { showToast('💸 Pas assez d\'argent !', 2000); return; }
    player.money -= 1000;
    player.fans += 50;
    player.popularity += 5;
    player.health = Math.max(0, player.health - 10);
    player.addiction = Math.min(100, player.addiction + 5);
    player.partyCooldown = 30;
    document.getElementById('lifestyleResult').innerHTML = `
        <div style="background: rgba(153,0,255,0.3); border: 2px solid #9900ff; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #9900ff; margin-bottom: 10px;">🎉 Soirée mémorable !</h3>
            <p class="positive">+50 Fans</p><p class="positive">+5 Popularité</p>
            <p class="negative">-10% Santé</p><p class="negative">+5% Addiction</p>
            <p style="color: #ffa500;">⏳ 30 secondes</p>
        </div>`;
    updateDisplay();
    showView('lifestyle');
}
