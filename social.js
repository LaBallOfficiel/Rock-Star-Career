// =====================
// RÉSEAUX SOCIAUX
// =====================

// Plateformes disponibles (débloquées selon la popularité)
const socialPlatforms = [
    { id: 'tiktok',    name: 'TikTok',     icon: '🎵', minPop: 0,    fanMultiplier: 1.0, desc: 'Vidéos courtes virales' },
    { id: 'instagram', name: 'Instagram',  icon: '📸', minPop: 20,   fanMultiplier: 1.2, desc: 'Photos & stories' },
    { id: 'twitter',   name: 'Twitter/X',  icon: '🐦', minPop: 50,   fanMultiplier: 0.8, desc: 'Tweets & buzz' },
    { id: 'youtube',   name: 'YouTube',    icon: '▶️', minPop: 100,  fanMultiplier: 2.0, desc: 'Clips & vlogs' },
    { id: 'spotify',   name: 'Spotify',    icon: '🟢', minPop: 200,  fanMultiplier: 1.5, desc: 'Promotion musicale' },
];

// Types de publications
const postTypes = [
    { id: 'selfie',      name: 'Selfie coulisses',    icon: '🤳', cost: 0,    qualityBase: 0.40, cooldown: 20, desc: 'Simple et rapide' },
    { id: 'clip',        name: 'Clip live',           icon: '🎬', cost: 500,  qualityBase: 0.60, cooldown: 35, desc: 'Extrait de concert' },
    { id: 'collab',      name: 'Collab artiste',      icon: '🤝', cost: 2000, qualityBase: 0.75, cooldown: 50, desc: 'Feat avec un autre artiste' },
    { id: 'documentary', name: 'Mini-documentaire',   icon: '🎥', cost: 5000, qualityBase: 0.85, cooldown: 70, desc: 'Coulisses de la tournée', minPop: 150 },
    { id: 'live_stream', name: 'Live Streaming',      icon: '📡', cost: 1000, qualityBase: 0.65, cooldown: 45, desc: 'Concert en direct', minPop: 50 },
];

function showSocialView(content) {
    const socialCooldown = player.socialCooldown || 0;
    const activityMsg = getCurrentActivityMessage();
    const unlockedPlatforms = socialPlatforms.filter(p => player.popularity >= p.minPop);

    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 5px;">📱 Réseaux Sociaux</h2>
        <p style="color: #888; margin-bottom: 20px; font-size:0.9em;">Gère ta présence en ligne pour gagner des fans !</p>

        ${activityMsg ? `<div style="background: rgba(255,165,0,0.3); border: 2px solid #ffa500; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: #ffa500;">${activityMsg}</div>` : ''}
        ${socialCooldown > 0 ? `<div style="background: rgba(255,165,0,0.2); border: 2px solid #ffa500; padding: 12px; margin-bottom: 20px; border-radius: 5px; color: #ffa500;">📱 Prochaine publication dans ${socialCooldown}s</div>` : ''}

        <!-- STATS RÉSEAUX -->
        <div style="background: rgba(0,0,0,0.4); border: 2px solid #333; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: center;">
                <div style="text-align:center;">
                    <div style="color: #ff6b6b; font-size: 0.8em;">Publications</div>
                    <div style="color: #fff; font-weight: bold; font-size: 1.3em;">${player.totalPosts || 0}</div>
                </div>
                <div style="text-align:center;">
                    <div style="color: #ff6b6b; font-size: 0.8em;">Fans gagnés</div>
                    <div style="color: #00ff00; font-weight: bold; font-size: 1.3em;">+${(player.fansFromSocial || 0).toLocaleString()}</div>
                </div>
                <div style="text-align:center;">
                    <div style="color: #ff6b6b; font-size: 0.8em;">Meilleure qualité</div>
                    <div style="color: #ffd700; font-weight: bold; font-size: 1.3em;">${player.bestPostQuality || 0}%</div>
                </div>
            </div>
        </div>

        <!-- PLATEFORMES -->
        <h3 style="color: #ff6b6b; margin-bottom: 10px;">📲 Plateformes actives</h3>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 25px;">
            ${socialPlatforms.map(p => {
                const unlocked = player.popularity >= p.minPop;
                const selected = (player.activePlatform || 'tiktok') === p.id;
                return `<div onclick="${unlocked ? `selectPlatform('${p.id}')` : ''}" 
                    style="padding: 10px 15px; border-radius: 8px; cursor: ${unlocked ? 'pointer' : 'not-allowed'};
                    border: 2px solid ${selected ? '#ff0000' : unlocked ? '#8b0000' : '#333'};
                    background: ${selected ? 'rgba(139,0,0,0.5)' : unlocked ? 'rgba(80,0,0,0.2)' : 'rgba(30,30,30,0.5)'};
                    opacity: ${unlocked ? 1 : 0.4}; text-align: center; min-width: 80px; transition: all 0.2s;">
                    <div style="font-size: 1.5em;">${p.icon}</div>
                    <div style="color: ${unlocked ? '#fff' : '#888'}; font-size: 0.8em; font-weight: bold;">${p.name}</div>
                    ${selected ? '<div style="color:#ff0000; font-size:0.7em;">✓ ACTIF</div>' : ''}
                    ${!unlocked ? `<div style="color:#555; font-size:0.65em;">Pop. ${p.minPop}</div>` : ''}
                </div>`;
            }).join('')}
        </div>

        <!-- TYPES DE PUBLICATION -->
        <h3 style="color: #ff6b6b; margin-bottom: 10px;">✏️ Type de publication</h3>
        <div class="shop-grid">
            ${postTypes.map(pt => {
                const locked = pt.minPop && player.popularity < pt.minPop;
                const canPost = !socialCooldown && !isPlayerBusy() && player.money >= pt.cost && !locked;
                
                // Calcul qualité estimée pour ce type
                const platform = socialPlatforms.find(p => p.id === (player.activePlatform || 'tiktok'));
                const skillBonus = (player.skills.charisme + player.skills.marketing) / 200;
                const estimatedQuality = Math.floor((pt.qualityBase + skillBonus * 0.4) * 100);
                const estimatedFans = Math.floor(estimatedQuality * 2 * (platform?.fanMultiplier || 1));

                return `
                    <div class="shop-item" style="${!canPost ? 'opacity:0.6;' : ''}; position: relative;">
                        ${locked ? `<div style="position:absolute;top:8px;right:8px;background:#333;padding:2px 6px;border-radius:4px;font-size:0.7em;color:#888;">🔒 Pop. ${pt.minPop}</div>` : ''}
                        <div style="font-size: 1.8em; margin-bottom: 6px;">${pt.icon}</div>
                        <div style="color: #ff0000; font-weight: bold; margin-bottom: 4px;">${pt.name}</div>
                        <div style="color: #888; font-size: 0.8em; margin-bottom: 8px;">${pt.desc}</div>
                        <div style="color: #ffa500; font-size: 0.85em;">💰 ${pt.cost > 0 ? pt.cost.toLocaleString() + ' €' : 'Gratuit'}</div>
                        <div style="color: #ff9999; font-size: 0.8em;">⏳ ${pt.cooldown}s cooldown</div>
                        <div style="margin: 8px 0;">
                            <div style="color: #aaa; font-size: 0.75em; margin-bottom: 3px;">Qualité estimée :</div>
                            <div style="background: #1a1a1a; border-radius: 4px; height: 8px; overflow: hidden;">
                                <div style="height:100%; width: ${Math.min(estimatedQuality, 100)}%; background: ${estimatedQuality > 70 ? '#00cc00' : estimatedQuality > 40 ? '#ffa500' : '#cc0000'}; transition: width 0.3s;"></div>
                            </div>
                            <div style="color: #ccc; font-size: 0.75em; margin-top: 2px;">~${estimatedQuality}% → ~${estimatedFans} fans</div>
                        </div>
                        <button onclick="makePost('${pt.id}')" ${!canPost ? 'disabled' : ''}>Publier</button>
                    </div>`;
            }).join('')}
        </div>

        <!-- HISTORIQUE DES POSTS -->
        ${player.postHistory && player.postHistory.length > 0 ? `
        <h3 style="color: #ff6b6b; margin: 25px 0 10px 0;">📊 Dernières publications</h3>
        <div style="display: grid; gap: 8px;">
            ${player.postHistory.slice(-5).reverse().map(post => `
                <div style="background: rgba(0,0,0,0.3); border-left: 3px solid ${post.quality >= 70 ? '#00cc00' : post.quality >= 40 ? '#ffa500' : '#cc0000'}; padding: 10px 15px; border-radius: 0 8px 8px 0; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: #fff; font-weight: bold;">${post.icon} ${post.name}</span>
                        <span style="color: #888; font-size: 0.8em; margin-left: 8px;">sur ${post.platform}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: ${post.quality >= 70 ? '#00cc00' : post.quality >= 40 ? '#ffa500' : '#cc0000'}; font-weight: bold;">${post.quality}% qualité</div>
                        <div style="color: #00ff00; font-size: 0.85em;">+${post.fans.toLocaleString()} fans</div>
                    </div>
                </div>
            `).join('')}
        </div>` : ''}

        <div id="socialResult"></div>
    `;
}

function selectPlatform(id) {
    if (player.popularity < (socialPlatforms.find(p => p.id === id)?.minPop || 0)) return;
    player.activePlatform = id;
    showView('social');
}

function makePost(postTypeId) {
    if (isPlayerBusy()) { showToast('⏳ Tu es déjà occupé !', 2000); return; }
    if ((player.socialCooldown || 0) > 0) { showToast(`📱 Attends encore ${player.socialCooldown}s avant de reposter !`, 2000); return; }

    const pt = postTypes.find(p => p.id === postTypeId);
    if (!pt) return;
    if (pt.minPop && player.popularity < pt.minPop) { showToast('⭐ Popularité insuffisante !', 2000); return; }
    if (player.money < pt.cost) { showToast('💸 Pas assez d\'argent !', 2000); return; }

    const platform = socialPlatforms.find(p => p.id === (player.activePlatform || 'tiktok')) || socialPlatforms[0];

    player.money -= pt.cost;
    player.socialCooldown = pt.cooldown;

    // Calcul de qualité : base type + skills charisme/marketing + aléatoire
    const skillBonus = (player.skills.charisme + player.skills.marketing) / 200; // 0 à 1
    const rawQuality = pt.qualityBase + skillBonus * 0.4 + (Math.random() * 0.3 - 0.15); // ±15% variance
    const quality = Math.max(1, Math.min(100, Math.round(rawQuality * 100)));

    // Fans gagnés selon qualité et plateforme
    let fans = Math.floor(quality * 2.5 * platform.fanMultiplier);

    // Bonus viral : 8% de chance d'exploser
    let viral = false;
    if (quality >= 60 && Math.random() < 0.08) {
        fans *= 5;
        viral = true;
    }

    // Bonus popularité
    const popGain = Math.floor(fans / 20) + 1;

    player.fans += fans;
    player.popularity += popGain;
    player.totalPosts = (player.totalPosts || 0) + 1;
    player.fansFromSocial = (player.fansFromSocial || 0) + fans;
    if (quality > (player.bestPostQuality || 0)) player.bestPostQuality = quality;

    // Historique
    if (!player.postHistory) player.postHistory = [];
    player.postHistory.push({ icon: pt.icon, name: pt.name, platform: platform.name, quality, fans });
    if (player.postHistory.length > 20) player.postHistory.shift();

    // Résultat affiché
    const qualityColor = quality >= 70 ? '#00cc00' : quality >= 40 ? '#ffa500' : '#cc3300';
    const qualityLabel = quality >= 80 ? 'VIRAL ! 🔥' : quality >= 60 ? 'Excellent 👏' : quality >= 40 ? 'Correct 👍' : quality >= 20 ? 'Moyen 😐' : 'Flop 😬';

    document.getElementById('socialResult').innerHTML = `
        <div class="concert-result" style="border-color: ${qualityColor};">
            <h3 style="color: ${qualityColor}; margin-bottom: 12px;">
                ${pt.icon} ${pt.name} sur ${platform.icon} ${platform.name}
                ${viral ? '<span style="color:#ff0000; animation: pulse 1s infinite;"> 🚀 VIRAL !</span>' : ''}
            </h3>
            <div style="margin: 10px 0;">
                <div style="color: #aaa; font-size: 0.85em; margin-bottom: 4px;">Qualité de la publication :</div>
                <div style="background: #1a1a1a; border-radius: 8px; height: 20px; overflow: hidden; position: relative;">
                    <div style="height:100%; width: ${quality}%; background: ${qualityColor}; transition: width 1s; display: flex; align-items: center; justify-content: center;">
                    </div>
                </div>
                <div style="color: ${qualityColor}; font-weight: bold; margin-top: 4px; font-size: 1.1em;">${quality}% — ${qualityLabel}</div>
            </div>
            <p class="positive"><strong>👥 Fans gagnés :</strong> +${fans.toLocaleString()}</p>
            <p class="positive"><strong>⭐ Popularité :</strong> +${popGain}</p>
            ${viral ? `<p style="color: #ff6600; font-weight: bold;">🚀 Post viral ! x5 fans !</p>` : ''}
            <p style="color: #ffa500; margin-top: 8px; font-size: 0.9em;">⏳ Prochain post dans ${pt.cooldown}s</p>
        </div>`;

    if (viral) showToast(`🚀 POST VIRAL sur ${platform.name} ! +${fans.toLocaleString()} fans !`, 5000);
    else showToast(`${pt.icon} Publication sur ${platform.name} — ${quality}% qualité, +${fans} fans`, 3000);

    updateDisplay();
    showView('social');
}
