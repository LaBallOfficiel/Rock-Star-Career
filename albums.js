// Affichage de la vue albums
function showAlbumsView(content) {
    const studioLevel = player.equipment.studio;
    const instrumentLevel = player.equipment.instrument;
    const activityMsg = getCurrentActivityMessage();
    const passivePerMin = getPassiveIncomePerMinute();
    
    content.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 20px;">💿 Production d'Albums</h2>
        ${activityMsg ? `<div style="background: rgba(255, 165, 0, 0.3); border: 2px solid #ffa500; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: #ffa500;">
            ${activityMsg}
        </div>` : ''}
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="color: #ff6b6b;">🎙️ Studio: Niveau ${studioLevel} | 🎸 Instrument: Niveau ${instrumentLevel} | 🎵 Composition: ${player.skills.composition}/100</p>
            ${player.group ? `<p style="color: #ff6b6b;">🎸 Groupe: ${player.group.name} (x${player.group.bonus})</p>` : ''}
            ${passivePerMin > 0 ? `<p style="color: #00ff00; font-weight: bold; margin-top: 8px;">📀 Revenus passifs : ${passivePerMin.toLocaleString()} €/min</p>` : ''}
        </div>
        <h3 style="color: #ff6b6b; margin: 20px 0 10px 0;">Types d'Albums</h3>
        <div class="shop-grid">
            ${albumTypes.map(albumType => {
                const canRecord = !isPlayerBusy() && 
                                player.money >= albumType.cost && 
                                studioLevel >= albumType.minStudio;
                return `
                    <div class="shop-item" style="${!canRecord ? 'opacity: 0.6;' : ''}">
                        <div style="color: #ff0000; font-weight: bold; font-size: 1.2em; margin-bottom: 10px;">${albumType.name}</div>
                        <div style="color: #ff6b6b; margin: 5px 0; font-size: 0.9em;">${albumType.tracks} titres</div>
                        <div style="color: #ffa500; margin: 5px 0;">Coût: ${albumType.cost.toLocaleString()} €</div>
                        <div style="color: #ff9999; margin: 5px 0; font-size: 0.85em;">Durée: ${albumType.duration}s</div>
                        <div style="color: #ff6b6b; margin: 5px 0; font-size: 0.85em;">Studio requis: Niveau ${albumType.minStudio}</div>
                        <button onclick="recordAlbum('${albumType.type}')" ${!canRecord ? 'disabled' : ''}>Enregistrer</button>
                    </div>`;
            }).join('')}
        </div>
        ${player.albums.length > 0 ? `
            <h3 style="color: #ff6b6b; margin: 30px 0 10px 0;">Mes Albums (${player.albums.length})</h3>
            <div style="display: grid; gap: 10px;">
                ${player.albums.slice().reverse().map((album) => `
                    <div style="background: rgba(${album.isPopular ? '0, 139, 0' : '139, 0, 0'}, 0.2); border: 2px solid ${album.isPopular ? '#00ff00' : '#8b0000'}; padding: 15px; border-radius: 5px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="color: #ff0000; font-weight: bold; font-size: 1.1em;">${album.name}</div>
                                <div style="color: #ff6b6b; font-size: 0.9em; margin-top: 5px;">${album.type} • ${album.tracks} titres • Qualité: ${album.quality}%</div>
                            </div>
                            <div style="text-align: right;">
                                ${album.isPopular ? 
                                    `<div style="color: #00ff00; font-weight: bold;">🔥 POPULAIRE</div><div style="color: #00ff00; font-size: 0.85em;">+${album.revenuePerMinute.toLocaleString()}€/min & +${album.fansPerMinute} fans/min</div>` : 
                                    '<div style="color: #ffa500;">Album standard</div>'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        <div id="albumResult"></div>
    `;
}

// Enregistrement d'un album
function recordAlbum(type) {
    if (isPlayerBusy()) {
        showToast('⏳ Tu es déjà occupé ! Termine ton activité en cours avant d\'enregistrer un album.', 2500);
        return;
    }
    
    const albumType = albumTypes.find(a => a.type === type);
    if (!albumType || player.money < albumType.cost) return;
    
    if (player.equipment.studio < albumType.minStudio) {
        showToast(`🎙️ Tu as besoin d'un studio de niveau ${albumType.minStudio} minimum !`, 2500);
        return;
    }
    
    player.money -= albumType.cost;
    player.albumCooldown = albumType.duration;
    
    const avgSkill = (player.skills.technique + player.skills.composition) / 2;
    const equipBonus = (player.equipment.studio * 15) + (player.equipment.instrument * 8);
    const groupBonus = player.group ? player.group.bonus : 1;
    
    // Formule plus accessible (seuil réduit)
    let quality = Math.floor((avgSkill * 0.65 + equipBonus * 0.75) * groupBonus * (0.35 + Math.random() * 0.45));
    quality = Math.min(100, quality);
    
    const isPopular = quality >= 62; // Entre 55 (trop facile) et 70 (trop dur)
    const albumName = generateAlbumName();
    
    let maxRevenuePerMinute = 0;
    let immediateRevenue = 0;
    let revenuePerMinute = 0;
    let fansPerMinute = 0;
    
    switch(albumType.type) {
        case 'demo':
            immediateRevenue = Math.floor((quality / 100) * 700 * groupBonus);
            maxRevenuePerMinute = 0;
            break;
        case 'ep':
            maxRevenuePerMinute = 2500;
            break;
        case 'album':
            maxRevenuePerMinute = 18000;
            break;
        case 'live':
            maxRevenuePerMinute = 8500;
            break;
        case 'double':
            maxRevenuePerMinute = 60000;
            break;
    }
    
    if (isPopular && albumType.type !== 'demo') {
        revenuePerMinute = Math.floor((quality / 100) * maxRevenuePerMinute);
        fansPerMinute = Math.floor(revenuePerMinute / 50);
    }
    
    if (albumType.type === 'demo') {
        const immediateFans = Math.floor((quality / 100) * 120 * groupBonus);
        player.fans += immediateFans;
        player.money += immediateRevenue;
    } else {
        immediateRevenue = Math.floor(quality * 35 * groupBonus);
        const immediateFans = Math.floor(quality * 4 * groupBonus);
        player.fans += immediateFans;
        player.money += immediateRevenue;
    }
    
    player.popularity += Math.floor(quality / 7);
    
    const album = {
        name: albumName,
        type: albumType.name,
        tracks: albumType.tracks,
        quality: quality,
        isPopular: isPopular,
        albumTypeKey: albumType.type,
        revenuePerMinute: revenuePerMinute,
        fansPerMinute: fansPerMinute,
        date: new Date().toLocaleString('fr-FR')
    };
    
    player.albums.push(album);
    
    document.getElementById('albumResult').innerHTML = `
        <div class="concert-result">
            <h3 style="color: ${isPopular ? '#00ff00' : '#ffa500'}; margin-bottom: 15px;">
                ${isPopular ? '💿 ALBUM À SUCCÈS ! 💿' : '💿 Album sorti'}
            </h3>
            <p><strong>Album:</strong> ${albumName} | <strong>Type:</strong> ${albumType.name} (${albumType.tracks} titres)</p>
            <p><strong>Qualité:</strong> ${quality}%</p>
            <p class="positive"><strong>💰 Ventes immédiates:</strong> +${immediateRevenue.toLocaleString()} €</p>
            <p class="positive"><strong>👥 Nouveaux fans:</strong> +${albumType.type === 'demo' ? Math.floor((quality / 100) * 120 * (player.group?.bonus || 1)) : Math.floor(quality * 4 * (player.group?.bonus || 1))}</p>
            ${isPopular && albumType.type !== 'demo' ? 
                `<p class="positive"><strong>🔥 Album populaire:</strong> +${revenuePerMinute.toLocaleString()}€/min & +${fansPerMinute} fans/min</p>` : 
                albumType.type !== 'demo' ? '<p style="color:#ffa500;">Album standard : pas de revenus passifs (qualité < 55%)</p>' : ''}
            <p style="color: #ffa500; margin-top: 10px;">⏳ Prochain album dans ${albumType.duration} secondes</p>
        </div>`;
    
    updateDisplay();
    showView('albums');
}

// Génération de noms d'albums
function generateAlbumName() {
    const prefixes = ['The', 'Dark', 'Electric', 'Wild', 'Eternal', 'Sonic', 'Rebel', 'Burning', 'Thunder', 'Crimson', 'Neon', 'Iron', 'Midnight', 'Savage'];
    const middles = ['Night', 'Storm', 'Fire', 'Dreams', 'Chaos', 'Legends', 'Warriors', 'Souls', 'Hearts', 'Shadows', 'Empire', 'Sky', 'Blood', 'Machine'];
    const suffixes = ['Rising', 'Forever', 'Reborn', 'Unleashed', 'Returns', 'Lives On', 'Awakens', 'United', 'Strikes Back', 'Eternal', ''];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const middle = middles[Math.floor(Math.random() * middles.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return suffix ? `${prefix} ${middle} ${suffix}` : `${prefix} ${middle}`;
}
