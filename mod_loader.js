// ============================================================
// ROCK STAR CAREER — MOD LOADER
// ============================================================
// Permet d'importer des fichiers .js de mod pendant la partie.
// Chaque mod est un fichier JS qui appelle les fonctions de
// l'API RSC_MOD exposées ci-dessous.
// ============================================================

const RSC_MOD = (() => {

    // Registre des mods chargés
    const loadedMods = [];

    // ─── UTILITAIRES INTERNES ────────────────────────────────

    function log(modName, msg, type = 'info') {
        const colors = { info: '#00aaff', success: '#00cc00', warn: '#ffa500', error: '#ff4444' };
        console.log(`%c[MOD:${modName}] ${msg}`, `color:${colors[type]}`);
    }

    function refreshCurrentView() {
        if (typeof showView === 'function' && typeof currentView !== 'undefined') {
            showView(currentView);
        }
    }

    // ─── API PUBLIQUE POUR LES MODS ─────────────────────────

    return {

        // ── Infos ──────────────────────────────────────────

        /** Retourne la version de l'API mod */
        version: '1.0.0',

        /** Liste les mods actuellement chargés */
        listMods() {
            return [...loadedMods];
        },

        // ── Joueur ────────────────────────────────────────

        /** Modifie directement une stat du joueur
         *  @param {string} stat  - 'money' | 'fans' | 'popularity' | 'health' | 'addiction' | 'age'
         *  @param {number} value - nouvelle valeur
         */
        setPlayerStat(stat, value) {
            const allowed = ['money', 'fans', 'popularity', 'health', 'addiction', 'age'];
            if (!allowed.includes(stat)) throw new Error(`Stat inconnue : ${stat}. Autorisées : ${allowed.join(', ')}`);
            player[stat] = value;
            if (typeof updateDisplay === 'function') updateDisplay();
        },

        /** Modifie une compétence du joueur
         *  @param {string} skill - 'technique' | 'scene' | 'composition' | 'charisme' | 'marketing' | 'endurance'
         *  @param {number} value - 0 à 100
         */
        setSkill(skill, value) {
            if (!(skill in player.skills)) throw new Error(`Skill inconnu : ${skill}`);
            player.skills[skill] = Math.max(0, Math.min(100, value));
            if (typeof updateDisplay === 'function') updateDisplay();
        },

        // ── Groupes ───────────────────────────────────────

        /** Ajoute un groupe personnalisé
         *  @param {{ name: string, minPop: number, bonus: number, members: number }} groupDef
         */
        addGroup(groupDef) {
            const required = ['name', 'minPop', 'bonus', 'members'];
            required.forEach(k => { if (groupDef[k] === undefined) throw new Error(`Champ manquant dans addGroup : ${k}`); });
            if (groups.some(g => g.name === groupDef.name)) throw new Error(`Un groupe "${groupDef.name}" existe déjà.`);
            groups.push(groupDef);
            refreshCurrentView();
        },

        /** Supprime un groupe par son nom */
        removeGroup(name) {
            const idx = groups.findIndex(g => g.name === name);
            if (idx === -1) throw new Error(`Groupe "${name}" introuvable.`);
            groups.splice(idx, 1);
            refreshCurrentView();
        },

        // ── Lieux de concert ──────────────────────────────

        /** Ajoute ou remplace un lieu de concert
         *  @param {string} id  - identifiant unique (ex: 'stade')
         *  @param {{ name, revenue, fans, difficulty, cooldown }} venueDef
         *  @param {number} minPop - popularité requise
         */
        addVenue(id, venueDef, minPop = 0) {
            const required = ['name', 'revenue', 'fans', 'difficulty', 'cooldown'];
            required.forEach(k => { if (venueDef[k] === undefined) throw new Error(`Champ manquant dans addVenue : ${k}`); });
            venues[id] = venueDef;
            venuePop[id] = minPop;
            refreshCurrentView();
        },

        /** Modifie un paramètre d'un lieu existant */
        patchVenue(id, patch) {
            if (!venues[id]) throw new Error(`Lieu "${id}" introuvable.`);
            Object.assign(venues[id], patch);
            if (patch.minPop !== undefined) venuePop[id] = patch.minPop;
            refreshCurrentView();
        },

        // ── Albums ────────────────────────────────────────

        /** Ajoute un nouveau type d'album
         *  @param {{ type, name, cost, duration, minStudio, tracks }} albumDef
         */
        addAlbumType(albumDef) {
            const required = ['type', 'name', 'cost', 'duration', 'minStudio', 'tracks'];
            required.forEach(k => { if (albumDef[k] === undefined) throw new Error(`Champ manquant dans addAlbumType : ${k}`); });
            if (albumTypes.some(a => a.type === albumDef.type)) throw new Error(`Type d'album "${albumDef.type}" existe déjà.`);
            albumTypes.push(albumDef);
            refreshCurrentView();
        },

        // ── Équipement ────────────────────────────────────

        /** Ajoute une nouvelle catégorie d'équipement complète
         *  @param {string} categoryId  - identifiant unique (ex: 'drone')
         *  @param {string} label       - label affiché dans la boutique
         *  @param {Array}  items       - tableau de { level, name, cost, bonus, desc? }
         */
        addEquipmentCategory(categoryId, label, items) {
            if (shopItems[categoryId]) throw new Error(`Catégorie "${categoryId}" existe déjà.`);
            shopItems[categoryId] = items;
            shopCategories[categoryId] = label;
            player.equipment[categoryId] = 0;
            refreshCurrentView();
        },

        /** Ajoute un niveau à une catégorie existante */
        addEquipmentLevel(categoryId, itemDef) {
            if (!shopItems[categoryId]) throw new Error(`Catégorie "${categoryId}" introuvable.`);
            shopItems[categoryId].push({ ...itemDef, level: shopItems[categoryId].length + 1 });
            refreshCurrentView();
        },

        // ── Achievements ──────────────────────────────────

        /** Ajoute un achievement personnalisé
         *  @param {{ id, name, desc, icon, check: Function, reward: Object }} achDef
         *  reward peut contenir : money, fans, popularity, health
         */
        addAchievement(achDef) {
            const required = ['id', 'name', 'desc', 'icon', 'check', 'reward'];
            required.forEach(k => { if (achDef[k] === undefined) throw new Error(`Champ manquant dans addAchievement : ${k}`); });
            if (achievements.some(a => a.id === achDef.id)) throw new Error(`Achievement "${achDef.id}" existe déjà.`);
            if (typeof achDef.check !== 'function') throw new Error(`achievement.check doit être une fonction`);
            achievements.push(achDef);
        },

        // ── Événements de concert ─────────────────────────

        /** Ajoute un événement aléatoire de concert
         *  @param {{ chance, type, name, revenueBonus, fanBonus, msg }} eventDef
         *  type : 'good' | 'bad' | 'neutral'
         */
        addConcertEvent(eventDef) {
            const required = ['chance', 'type', 'name', 'revenueBonus', 'fanBonus', 'msg'];
            required.forEach(k => { if (eventDef[k] === undefined) throw new Error(`Champ manquant dans addConcertEvent : ${k}`); });
            if (typeof concertEvents !== 'undefined') concertEvents.push(eventDef);
            else throw new Error('concertEvents introuvable. Charge le mod après concerts.js.');
        },

        // ── Plateformes sociales ──────────────────────────

        /** Ajoute une plateforme sociale personnalisée
         *  @param {{ id, name, icon, minPop, fanMultiplier, desc }} platformDef
         */
        addSocialPlatform(platformDef) {
            const required = ['id', 'name', 'icon', 'minPop', 'fanMultiplier', 'desc'];
            required.forEach(k => { if (platformDef[k] === undefined) throw new Error(`Champ manquant : ${k}`); });
            if (typeof socialPlatforms !== 'undefined') {
                if (socialPlatforms.some(p => p.id === platformDef.id)) throw new Error(`Plateforme "${platformDef.id}" existe déjà.`);
                socialPlatforms.push(platformDef);
                refreshCurrentView();
            }
        },

        // ── Hooks de jeu ─────────────────────────────────

        /** Injecte du code à exécuter à chaque tick de jeu (toutes les secondes)
         *  @param {string}   modName  - nom du mod (pour les logs)
         *  @param {Function} fn       - callback(gameTime, player)
         */
        onTick(modName, fn) {
            if (typeof fn !== 'function') throw new Error('onTick attend une fonction');
            const orig = window._modTicks || [];
            orig.push({ modName, fn });
            window._modTicks = orig;
        },

        /** Injecte du code après chaque concert
         *  @param {string}   modName
         *  @param {Function} fn  - callback({ type, revenue, fans, success, quality })
         */
        onConcertEnd(modName, fn) {
            if (typeof fn !== 'function') throw new Error('onConcertEnd attend une fonction');
            const orig = window._modConcertHooks || [];
            orig.push({ modName, fn });
            window._modConcertHooks = orig;
        },

        // ── Toast & UI ───────────────────────────────────

        /** Affiche un toast personnalisé depuis un mod */
        toast(msg, duration = 3000) {
            if (typeof showToast === 'function') showToast(`📦 ${msg}`, duration);
        },

        // ── Registre interne ─────────────────────────────

        _register(meta) {
            loadedMods.push({ ...meta, loadedAt: new Date().toLocaleTimeString() });
            log(meta.name, `v${meta.version || '?'} chargé avec succès ✓`, 'success');
            if (typeof showToast === 'function') showToast(`📦 Mod chargé : ${meta.name} v${meta.version || '?'}`, 3000);
        }
    };
})();

// ─── Intégration des hooks dans la boucle de jeu ────────────
// Patch de updateCooldowns pour exécuter les _modTicks
const _origUpdateCooldowns = typeof updateCooldowns === 'function' ? updateCooldowns : null;

// ─── VUE MOD LOADER ─────────────────────────────────────────

function showModView(content) {
    const loaded = RSC_MOD.listMods();

    content.innerHTML = `
        <h2 style="color:#ff0000; margin-bottom:5px;">🔧 Mod Loader</h2>
        <p style="color:#888; font-size:0.85em; margin-bottom:20px;">
            Importe des fichiers <code style="color:#ffa500;">.js</code> de mod pendant la partie. 
            <a href="MOD_DOCUMENTATION.html" target="_blank" style="color:#ff6b6b;">📄 Documentation modding</a>
        </p>

        <!-- Zone d'import -->
        <div style="background:rgba(0,0,0,0.5); border:2px dashed #8b0000; border-radius:8px; padding:25px; text-align:center; margin-bottom:20px;" 
             id="modDropZone"
             ondragover="event.preventDefault(); this.style.borderColor='#ff0000';"
             ondragleave="this.style.borderColor='#8b0000';"
             ondrop="handleModDrop(event)">
            <div style="font-size:2.5em; margin-bottom:10px;">📦</div>
            <p style="color:#ff6b6b; margin-bottom:15px;">Glisse-dépose un fichier <strong>.js</strong> ici</p>
            <p style="color:#555; font-size:0.8em; margin-bottom:15px;">— ou —</p>
            <label style="cursor:pointer; background:linear-gradient(135deg,#5a0000,#9b0000); border:1px solid #cc0000; color:#fff; padding:10px 20px; border-radius:6px; font-family:Courier New; font-weight:bold; font-size:13px; text-transform:uppercase; letter-spacing:1px;">
                📂 Choisir un fichier
                <input type="file" accept=".js" style="display:none;" onchange="loadModFile(this.files[0])">
            </label>
        </div>

        <!-- Éditeur de code inline -->
        <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h3 style="color:#ff6b6b;">✏️ Éditeur de code direct</h3>
                <div style="display:flex; gap:8px;">
                    <button onclick="clearModEditor()" style="padding:6px 14px; font-size:12px; background:linear-gradient(135deg,#333,#555); border-color:#666;">🗑️ Vider</button>
                    <button onclick="runModCode()" style="padding:6px 14px; font-size:12px;">▶️ Exécuter</button>
                </div>
            </div>
            <textarea id="modCodeEditor" 
                placeholder="// Colle ou écris ton code de mod ici\n// Exemple :\nRSC_MOD._register({ name: 'Mon Mod', version: '1.0' });\nRSC_MOD.setPlayerStat('money', 50000);"
                style="width:100%; height:200px; background:#0d0d0d; border:2px solid #5a0000; color:#e0e0e0; font-family:'Courier New',monospace; font-size:13px; padding:14px; border-radius:6px; resize:vertical; box-sizing:border-box; outline:none; line-height:1.6;"
                spellcheck="false"
                onkeydown="handleEditorTab(event)"></textarea>
        </div>

        <!-- Mods chargés -->
        <div style="margin-bottom:20px;">
            <h3 style="color:#ff6b6b; margin-bottom:12px;">📋 Mods actifs (${loaded.length})</h3>
            ${loaded.length === 0 
                ? '<p style="color:#555; font-style:italic;">Aucun mod chargé.</p>'
                : loaded.map(m => `
                    <div style="background:rgba(0,80,0,0.3); border:1px solid #00aa00; border-radius:6px; padding:12px 16px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="color:#00ff00; font-weight:bold;">📦 ${m.name}</span>
                            ${m.version ? `<span style="color:#888; font-size:0.8em; margin-left:8px;">v${m.version}</span>` : ''}
                            ${m.author ? `<span style="color:#888; font-size:0.8em; margin-left:8px;">par ${m.author}</span>` : ''}
                        </div>
                        <span style="color:#555; font-size:0.75em;">chargé à ${m.loadedAt}</span>
                    </div>`).join('')
            }
        </div>

        <!-- Log d'erreurs -->
        <div id="modLog"></div>
    `;
}

function handleModDrop(event) {
    event.preventDefault();
    document.getElementById('modDropZone').style.borderColor = '#8b0000';
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.js')) {
        loadModFile(file);
    } else {
        showModError('Fichier invalide. Seuls les fichiers .js sont acceptés.');
    }
}

function loadModFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('modCodeEditor').value = e.target.result;
        runModCode();
    };
    reader.readAsText(file);
}

function runModCode() {
    const code = document.getElementById('modCodeEditor').value.trim();
    if (!code) return;
    clearModLog();
    try {
        const fn = new Function(code);
        fn();
        showView('mods');
    } catch (err) {
        showModError(`Erreur d'exécution : ${err.message}`);
        console.error('[MOD ERROR]', err);
    }
}

function clearModEditor() {
    document.getElementById('modCodeEditor').value = '';
}

function showModError(msg) {
    const log = document.getElementById('modLog');
    if (!log) return;
    log.innerHTML = `
        <div style="background:rgba(139,0,0,0.4); border:2px solid #ff0000; border-radius:6px; padding:14px; color:#ff6b6b;">
            <strong>❌ Erreur :</strong> ${msg}
        </div>`;
}

function clearModLog() {
    const log = document.getElementById('modLog');
    if (log) log.innerHTML = '';
}

function handleEditorTab(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const ta = e.target;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        ta.value = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
        ta.selectionStart = ta.selectionEnd = start + 4;
    }
}
