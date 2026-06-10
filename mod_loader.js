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
            loadedMods.push({ ...meta, loadedAt: new Date().toLocaleTimeString(), _id: loadedMods.length });
            log(meta.name, `v${meta.version || '?'} chargé avec succès ✓`, 'success');
            if (typeof showToast === 'function') showToast(`📦 Mod chargé : ${meta.name} v${meta.version || '?'}`, 3000);
        },

        /** Désactive un mod (le retire des hooks sans le supprimer) */
        toggleMod(idx) {
            if (_disabledMods.has(idx)) _disabledMods.delete(idx);
            else _disabledMods.add(idx);
            if (typeof showView === 'function') showView('mods');
        },

        /** Supprime un mod par index */
        deleteMod(idx) {
            loadedMods.splice(idx, 1);
            _disabledMods.delete(idx);
            if (typeof showView === 'function') showView('mods');
        }
    };
})();

// ─── Intégration des hooks dans la boucle de jeu ────────────
// Patch de updateCooldowns pour exécuter les _modTicks
const _origUpdateCooldowns = typeof updateCooldowns === 'function' ? updateCooldowns : null;

// ============================================================
// SYSTÈME DE TEXTURES CSS
// ============================================================
// Registre des texture packs chargés
const _loadedTexturePacks = [];
// Registre des mods désactivés (par index dans loadedMods)
const _disabledMods = new Set();

/** Applique un CSS de texture au jeu */
function applyTextureCss(css, packName) {
    const styleEl = document.getElementById('rsc-texture-style');
    if (!styleEl) { console.error('[TEXTURE] Balise #rsc-texture-style introuvable.'); return false; }
    styleEl.textContent += '\n/* === ' + packName + ' === */\n' + css;
    return true;
}

/** Supprime toutes les textures d'un pack donné (par nom) */
function removeTexturePack(packName) {
    const idx = _loadedTexturePacks.findIndex(p => p.name === packName);
    if (idx === -1) return false;
    _loadedTexturePacks.splice(idx, 1);
    rebuildTextureStyle();
    return true;
}



/** Réinitialise toutes les textures */
function resetAllTextures() {
    _loadedTexturePacks.length = 0;
    const styleEl = document.getElementById('rsc-texture-style');
    if (styleEl) styleEl.textContent = '';
}

// Expose dans RSC_MOD
Object.assign(RSC_MOD, {
    /** Charge un texture pack CSS
     *  @param {string} name  - nom du pack (pour les logs et la suppression)
     *  @param {string} css   - contenu CSS complet
     */
    loadTexturePack(name, css) {
        if (_loadedTexturePacks.some(p => p.name === name)) {
            // Mise à jour si le pack existe déjà
            const p = _loadedTexturePacks.find(p => p.name === name);
            p.css = css;
            rebuildTextureStyle();
        } else {
            _loadedTexturePacks.push({ name, css, loadedAt: new Date().toLocaleTimeString() });
            applyTextureCss(css, name);
        }
        RSC_MOD.toast(`🎨 Texture Pack "${name}" appliqué !`, 3000);
    },

    /** Supprime un texture pack par son nom */
    removeTexturePack(name) {
        if (removeTexturePack(name)) RSC_MOD.toast(`🗑️ Texture Pack "${name}" supprimé.`);
        else throw new Error(`Texture Pack "${name}" introuvable.`);
    },

    /** Réinitialise toutes les textures */
    resetTextures() {
        resetAllTextures();
        RSC_MOD.toast('🔄 Toutes les textures réinitialisées.', 2500);
    },

    /** Liste les texture packs chargés */
    listTexturePacks() {
        return [..._loadedTexturePacks];
    }
});

// ─── VUE TEXTURE LOADER ──────────────────────────────────────

function showTextureView(content) {
    const loaded = _loadedTexturePacks;

    content.innerHTML = `
        <h2 style="color:#ff0000; margin-bottom:5px;">🎨 Texture Loader</h2>
        <p style="color:#888; font-size:0.85em; margin-bottom:20px;">
            Importe des fichiers <code style="color:#ffa500;">.css</code> pour personnaliser l'apparence du jeu.
            <a href="TEXTURE_DOCUMENTATION.html" target="_blank" style="color:#ff6b6b;">📄 Documentation textures</a>
        </p>

        <!-- Zone d'import fichier -->
        <div style="background:rgba(0,0,0,0.5); border:2px dashed #8b0000; border-radius:8px; padding:25px; text-align:center; margin-bottom:20px;"
             id="textureDropZone"
             ondragover="event.preventDefault(); this.style.borderColor='#ff0000';"
             ondragleave="this.style.borderColor='#8b0000';"
             ondrop="handleTextureDrop(event)">
            <div style="font-size:2.5em; margin-bottom:10px;">🎨</div>
            <p style="color:#ff6b6b; margin-bottom:12px;">Glisse-dépose un fichier <strong>.css</strong> ici</p>
            <p style="color:#555; font-size:0.8em; margin-bottom:14px;">— ou —</p>
            <label style="cursor:pointer; background:linear-gradient(135deg,#5a0000,#9b0000); border:1px solid #cc0000; color:#fff; padding:10px 20px; border-radius:6px; font-family:Courier New; font-weight:bold; font-size:13px; text-transform:uppercase; letter-spacing:1px;">
                📂 Choisir un fichier .css
                <input type="file" accept=".css" style="display:none;" onchange="loadTextureFile(this.files[0])">
            </label>
        </div>

        <!-- Nom du pack -->
        <div style="margin-bottom:15px; display:flex; gap:10px; align-items:center;">
            <label style="color:#ff6b6b; font-size:0.9em; white-space:nowrap;">Nom du pack :</label>
            <input type="text" id="texturePackName" placeholder="Mon Texture Pack" value="Texture Pack ${loaded.length + 1}"
                style="flex:1; background:#0d0d0d; border:2px solid #5a0000; color:#fff; padding:8px 12px; border-radius:6px; font-family:Courier New; font-size:13px;">
        </div>

        <!-- Éditeur CSS direct -->
        <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h3 style="color:#ff6b6b;">✏️ Éditeur CSS direct</h3>
                <div style="display:flex; gap:8px;">
                    <button onclick="clearTextureEditor()" style="padding:6px 14px; font-size:12px; background:linear-gradient(135deg,#333,#555); border-color:#666;">🗑️ Vider</button>
                    <button onclick="previewTextureCss()" style="padding:6px 14px; font-size:12px; background:linear-gradient(135deg,#003a1a,#007733); border-color:#00aa55;">👁️ Aperçu</button>
                    <button onclick="applyTextureFromEditor()" style="padding:6px 14px; font-size:12px;">✅ Appliquer</button>
                </div>
            </div>
            <textarea id="textureCssEditor"
                placeholder="/* Exemple de texture pack */\nbody {\n    background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2d 100%) !important;\n}\n.container {\n    border-color: #6600cc !important;\n    box-shadow: 0 0 40px rgba(102, 0, 204, 0.6) !important;\n}\nh1 {\n    color: #cc66ff !important;\n    text-shadow: 0 0 15px #cc66ff !important;\n}"
                style="width:100%; height:220px; background:#0d0d0d; border:2px solid #5a0000; color:#e0e0e0; font-family:'Courier New',monospace; font-size:13px; padding:14px; border-radius:6px; resize:vertical; box-sizing:border-box; outline:none; line-height:1.6;"
                spellcheck="false"
                onkeydown="handleEditorTab(event)"></textarea>
        </div>

        <!-- Texture packs chargés -->
        <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h3 style="color:#ff6b6b;">🖼️ Texture Packs chargés (${loaded.length})</h3>
                ${loaded.length > 0 ? `<button onclick="resetAllTextures(); showView('textures');" style="padding:6px 14px; font-size:12px; background:linear-gradient(135deg,#3a0000,#880000); border-color:#ff4444;">🔄 Tout réinitialiser</button>` : ''}
            </div>
            ${loaded.length === 0
                ? '<p style="color:#555; font-style:italic;">Aucun texture pack chargé.</p>'
                : loaded.map((p, i) => {
                    const isDisabled = p.disabled || false;
                    return `
                    <div style="background:rgba(${isDisabled ? '40,40,40' : '0,60,0'},0.4); border:1px solid ${isDisabled ? '#555' : '#00aa00'}; border-radius:6px; padding:12px 16px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; opacity:${isDisabled ? '0.6' : '1'};">
                        <div>
                            <span style="color:${isDisabled ? '#888' : '#00ff00'}; font-weight:bold;">🎨 ${p.name}</span>
                            <span style="color:#888; font-size:0.8em; margin-left:8px;">${p.css.length} car. CSS</span>
                            ${isDisabled ? '<span style="color:#888; font-size:0.75em; margin-left:8px; font-style:italic;">— désactivé</span>' : ''}
                        </div>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <span style="color:#555; font-size:0.75em;">chargé à ${p.loadedAt}</span>
                            <button onclick="toggleTexturePack('${p.name}')" style="padding:4px 10px; font-size:11px; background:linear-gradient(135deg,${isDisabled ? '#1a4400,#336600' : '#442200,#885500'}); border-color:${isDisabled ? '#44aa00' : '#cc7700'}; margin:0;">${isDisabled ? '▶️ Act.' : '⏸ Désact.'}</button>
                            <button onclick="removeTexturePack('${p.name}'); showView('textures');" style="padding:4px 10px; font-size:11px; background:linear-gradient(135deg,#3a0000,#880000); border-color:#ff4444; margin:0;">🗑️</button>
                        </div>
                    </div>`;
                }).join('')
            }
        </div>

        <div id="textureLog"></div>
    `;
}

// ─── Fonctions utilitaires de la vue texture ─────────────────

/** Active ou désactive un texture pack (sans le supprimer) */
function toggleTexturePack(name) {
    const pack = _loadedTexturePacks.find(p => p.name === name);
    if (!pack) return;
    pack.disabled = !pack.disabled;
    rebuildTextureStyle();
    showView('textures');
}

/** Reconstruit la balise style en ignorant les packs désactivés */
function rebuildTextureStyle() {
    const styleEl = document.getElementById('rsc-texture-style');
    if (!styleEl) return;
    styleEl.textContent = _loadedTexturePacks
        .filter(p => !p.disabled)
        .map(p => '/* === ' + p.name + ' === */\n' + p.css)
        .join('\n\n');
}

function handleTextureDrop(event) {
    event.preventDefault();
    document.getElementById('textureDropZone').style.borderColor = '#8b0000';
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.css')) {
        loadTextureFile(file);
    } else {
        showTextureError('Fichier invalide. Seuls les fichiers .css sont acceptés.');
    }
}

function loadTextureFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('textureCssEditor').value = e.target.result;
        // Pré-remplir le nom avec le nom du fichier
        const nameInput = document.getElementById('texturePackName');
        if (nameInput) nameInput.value = file.name.replace('.css', '');
        showToast(`📂 Fichier "${file.name}" chargé dans l'éditeur. Clique sur Appliquer !`, 3500);
    };
    reader.readAsText(file);
}

function clearTextureEditor() {
    const el = document.getElementById('textureCssEditor');
    if (el) el.value = '';
}

function previewTextureCss() {
    const css = document.getElementById('textureCssEditor')?.value?.trim();
    if (!css) { showTextureError('Éditeur vide, rien à prévisualiser.'); return; }
    // Aperçu temporaire (5 secondes puis revert)
    const styleEl = document.getElementById('rsc-texture-style');
    const backup = styleEl ? styleEl.textContent : '';
    if (styleEl) styleEl.textContent = backup + '\n/* PREVIEW */\n' + css;
    showToast('👁️ Aperçu actif 5 secondes...', 5000);
    setTimeout(() => {
        if (styleEl) styleEl.textContent = backup;
        showToast('👁️ Aperçu terminé.', 2000);
    }, 5000);
}

function applyTextureFromEditor() {
    const css = document.getElementById('textureCssEditor')?.value?.trim();
    const name = document.getElementById('texturePackName')?.value?.trim() || ('Pack ' + (_loadedTexturePacks.length + 1));
    if (!css) { showTextureError('Éditeur CSS vide, rien à appliquer.'); return; }
    RSC_MOD.loadTexturePack(name, css);
    showView('textures');
}

function showTextureError(msg) {
    const log = document.getElementById('textureLog');
    if (!log) return;
    log.innerHTML = `
        <div style="background:rgba(139,0,0,0.4); border:2px solid #ff0000; border-radius:6px; padding:14px; color:#ff6b6b;">
            <strong>❌ Erreur :</strong> ${msg}
        </div>`;
}

// ─── Presets intégrés ────────────────────────────────────────

const _texturePresets = {
    neon_purple: `
/* === Neon Purple Texture Pack === */
body { background: linear-gradient(135deg, #0a0014 0%, #1a0030 100%) !important; }
.container { border-color: #7700cc !important; box-shadow: 0 0 40px rgba(119,0,204,0.6) !important; }
h1 { color: #cc66ff !important; text-shadow: 0 0 15px #cc66ff, 0 0 30px #9900ff !important; }
button:not(:disabled) { background: linear-gradient(135deg, #4a0088 0%, #9900cc 100%) !important; }
button:hover:not(:disabled) { box-shadow: 0 5px 20px rgba(153,0,204,0.6) !important; }
.content-area { background: rgba(80,0,150,0.15) !important; border-color: #7700cc !important; }
.header-info { background: rgba(80,0,150,0.3) !important; border-color: #7700cc !important; }
.sidebar { background: rgba(20,0,40,0.8) !important; border-color: #5500aa !important; }
.sidebar button { background: linear-gradient(135deg, #2a005a 0%, #5a0099 100%) !important; border-color: #8800cc !important; }
.sidebar button:hover { background: linear-gradient(135deg, #3a0077 0%, #7700bb !important); box-shadow: 3px 0 12px rgba(150,0,255,0.4) !important; }
.health-good { background: linear-gradient(90deg, #5500aa, #cc66ff) !important; }
.shop-item { border-color: #5500aa !important; }
.toast { border-color: #9900cc !important; box-shadow: 0 0 20px rgba(153,0,204,0.5) !important; }
`,
    ocean_blue: `
/* === Ocean Blue Texture Pack === */
body { background: linear-gradient(135deg, #000d1a 0%, #001a33 100%) !important; }
.container { border-color: #004488 !important; box-shadow: 0 0 40px rgba(0,68,136,0.7) !important; }
h1 { color: #00aaff !important; text-shadow: 0 0 15px #00aaff, 0 0 30px #0055cc !important; }
button:not(:disabled) { background: linear-gradient(135deg, #002244 0%, #0055aa 100%) !important; }
button:hover:not(:disabled) { box-shadow: 0 5px 20px rgba(0,85,170,0.6) !important; }
.content-area { background: rgba(0,50,100,0.2) !important; border-color: #004488 !important; }
.header-info { background: rgba(0,50,100,0.35) !important; border-color: #004488 !important; }
.sidebar { background: rgba(0,10,30,0.85) !important; border-color: #003366 !important; }
.sidebar button { background: linear-gradient(135deg, #001a44 0%, #003388 100%) !important; border-color: #0055bb !important; }
.sidebar button:hover { background: linear-gradient(135deg, #002255 0%, #0066cc 100%) !important; box-shadow: 3px 0 12px rgba(0,100,200,0.4) !important; }
.health-good { background: linear-gradient(90deg, #0044aa, #00ccff) !important; }
.shop-item { border-color: #003388 !important; }
.toast { border-color: #0055aa !important; box-shadow: 0 0 20px rgba(0,85,170,0.5) !important; }
.player-name { color: #00aaff !important; text-shadow: 0 0 10px #00aaff !important; }
`,
    forest_dark: `
/* === Forest Dark Texture Pack === */
body { background: linear-gradient(135deg, #050d00 0%, #0a1a05 100%) !important; }
.container { border-color: #1a5500 !important; box-shadow: 0 0 40px rgba(26,85,0,0.7) !important; }
h1 { color: #44cc00 !important; text-shadow: 0 0 15px #44cc00, 0 0 30px #226600 !important; }
button:not(:disabled) { background: linear-gradient(135deg, #0d2200 0%, #226600 100%) !important; }
button:hover:not(:disabled) { box-shadow: 0 5px 20px rgba(34,102,0,0.6) !important; }
.content-area { background: rgba(20,60,0,0.2) !important; border-color: #1a5500 !important; }
.header-info { background: rgba(20,60,0,0.35) !important; border-color: #1a5500 !important; }
.sidebar { background: rgba(5,15,0,0.85) !important; border-color: #124400 !important; }
.sidebar button { background: linear-gradient(135deg, #0a1a00 0%, #1a4400 100%) !important; border-color: #2a6600 !important; }
.sidebar button:hover { background: linear-gradient(135deg, #122200 0%, #2a5500 100%) !important; box-shadow: 3px 0 12px rgba(40,100,0,0.4) !important; }
.health-good { background: linear-gradient(90deg, #1a5500, #66ff00) !important; }
.shop-item { border-color: #1a5500 !important; }
.toast { border-color: #2a7700 !important; box-shadow: 0 0 20px rgba(40,100,0,0.5) !important; }
.player-name { color: #55ee00 !important; text-shadow: 0 0 10px #55ee00 !important; }
`,
    gold_rush: `
/* === Gold Rush Texture Pack === */
body { background: linear-gradient(135deg, #0d0800 0%, #1a1000 100%) !important; }
.container { border-color: #8b6914 !important; box-shadow: 0 0 40px rgba(139,105,20,0.7) !important; }
h1 { color: #ffd700 !important; text-shadow: 0 0 15px #ffd700, 0 0 30px #cc9900 !important; }
button:not(:disabled) { background: linear-gradient(135deg, #3a2800 0%, #886600 100%) !important; }
button:hover:not(:disabled) { box-shadow: 0 5px 20px rgba(200,150,0,0.6) !important; }
.content-area { background: rgba(80,55,0,0.15) !important; border-color: #8b6914 !important; }
.header-info { background: rgba(80,55,0,0.3) !important; border-color: #8b6914 !important; }
.sidebar { background: rgba(20,12,0,0.85) !important; border-color: #664d00 !important; }
.sidebar button { background: linear-gradient(135deg, #2a1a00 0%, #664400 100%) !important; border-color: #aa7700 !important; }
.sidebar button:hover { background: linear-gradient(135deg, #3a2500 0%, #886600 100%) !important; box-shadow: 3px 0 12px rgba(180,130,0,0.4) !important; }
.health-good { background: linear-gradient(90deg, #886600, #ffd700) !important; }
.shop-item { border-color: #664400 !important; }
.toast { border-color: #aa8800 !important; box-shadow: 0 0 20px rgba(170,136,0,0.5) !important; }
.player-name { color: #ffd700 !important; text-shadow: 0 0 10px #ffd700 !important; }
`
};

function loadPresetTexture(presetId) {
    const css = _texturePresets[presetId];
    if (!css) { showToast('❌ Preset introuvable.', 2000); return; }
    const names = { neon_purple: 'Neon Purple', ocean_blue: 'Ocean Blue', forest_dark: 'Forest Dark', gold_rush: 'Gold Rush' };
    RSC_MOD.loadTexturePack(names[presetId] || presetId, css);
    showView('textures');
}



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
            <h3 style="color:#ff6b6b; margin-bottom:12px;">📋 Mods chargés (${loaded.length})</h3>
            ${loaded.length === 0 
                ? '<p style="color:#555; font-style:italic;">Aucun mod chargé.</p>'
                : loaded.map((m, i) => {
                    const disabled = _disabledMods.has(i);
                    return `
                    <div style="background:rgba(${disabled ? '40,40,40' : '0,80,0'},0.3); border:1px solid ${disabled ? '#555' : '#00aa00'}; border-radius:6px; padding:12px 16px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; opacity:${disabled ? '0.6' : '1'};">
                        <div>
                            <span style="color:${disabled ? '#888' : '#00ff00'}; font-weight:bold;">📦 ${m.name}</span>
                            ${m.version ? `<span style="color:#888; font-size:0.8em; margin-left:8px;">v${m.version}</span>` : ''}
                            ${m.author ? `<span style="color:#888; font-size:0.8em; margin-left:8px;">par ${m.author}</span>` : ''}
                            ${disabled ? '<span style="color:#888; font-size:0.75em; margin-left:8px; font-style:italic;">— désactivé</span>' : ''}
                        </div>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <span style="color:#555; font-size:0.75em;">chargé à ${m.loadedAt}</span>
                            <button onclick="RSC_MOD.toggleMod(${i})" style="padding:4px 10px; font-size:11px; background:linear-gradient(135deg,${disabled ? '#1a4400,#336600' : '#442200,#885500'}); border-color:${disabled ? '#44aa00' : '#cc7700'}; margin:0;">${disabled ? '▶️ Act.' : '⏸ Désact.'}</button>
                            <button onclick="RSC_MOD.deleteMod(${i})" style="padding:4px 10px; font-size:11px; background:linear-gradient(135deg,#3a0000,#880000); border-color:#ff4444; margin:0;">🗑️</button>
                        </div>
                    </div>`;
                }).join('')
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
