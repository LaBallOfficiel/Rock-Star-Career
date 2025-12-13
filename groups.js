// Affichage de la vue groupes
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

// Rejoindre un groupe
function joinGroup(index) {
    const group = groups[index];
    if (player.popularity < group.minPop) return;
    player.group = group;
    updateDisplay();
    showView('groups');
}

// Quitter un groupe
function leaveGroup() {
    player.group = null;
    updateDisplay();
    showView('groups');
}