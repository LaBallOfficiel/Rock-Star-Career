// Configuration des groupes
const groups = [
    { name: 'Les Débutants', minPop: 0, bonus: 1.2, members: 3 },
    { name: 'Death Scream', minPop: 30, bonus: 1.5, members: 4 },
    { name: 'Iron Thunder', minPop: 100, bonus: 2, members: 5 },
    { name: 'Metal Gods', minPop: 350, bonus: 3, members: 5 },
    { name: 'Legends of Rock', minPop: 1000, bonus: 5, members: 6 },
    { name: 'Immortal Flames', minPop: 2000, bonus: 7, members: 7 }
];

// Configuration de la boutique d'équipement
const shopItems = {
    instrument: [
        { level: 1, name: 'Instrument Débutant', cost: 400, bonus: 5 },
        { level: 2, name: 'Instrument Intermédiaire', cost: 1500, bonus: 15 },
        { level: 3, name: 'Instrument Pro', cost: 6000, bonus: 30 },
        { level: 4, name: 'Instrument Légendaire', cost: 20000, bonus: 50 },
        { level: 5, name: 'Instrument de Collection', cost: 80000, bonus: 80 }
    ],
    amplifier: [
        { level: 1, name: 'Ampli Basic', cost: 300, bonus: 5 },
        { level: 2, name: 'Ampli Marshall', cost: 1200, bonus: 15 },
        { level: 3, name: 'Stack Complet', cost: 5000, bonus: 25 },
        { level: 4, name: 'Ampli Stadium', cost: 16000, bonus: 45 }
    ],
    lights: [
        { level: 1, name: 'Éclairages Basiques', cost: 800, bonus: 10 },
        { level: 2, name: 'Lasers & LED', cost: 4000, bonus: 25 },
        { level: 3, name: 'Show Laser Complet', cost: 12000, bonus: 50 },
        { level: 4, name: 'Production Holographique', cost: 40000, bonus: 80 }
    ],
    pyrotechnics: [
        { level: 1, name: 'Fumée & Étincelles', cost: 1500, bonus: 15 },
        { level: 2, name: 'Flammes & Explosions', cost: 6000, bonus: 35 },
        { level: 3, name: 'Pyrotechnie Complète', cost: 16000, bonus: 60 },
        { level: 4, name: 'Spectacle Pyrotechnique Épique', cost: 60000, bonus: 100 }
    ],
    soundSystem: [
        { level: 1, name: 'Sono Standard', cost: 600, bonus: 8 },
        { level: 2, name: 'Sono Pro', cost: 2500, bonus: 20 },
        { level: 3, name: 'Sono Stadium', cost: 10000, bonus: 40 },
        { level: 4, name: 'Système Audio Spatial', cost: 32000, bonus: 70 }
    ],
    transport: [
        { level: 1, name: 'Van d\'occasion', cost: 2000, bonus: 5, desc: 'Transport basique' },
        { level: 2, name: 'Tour Bus', cost: 12000, bonus: 15, desc: 'Confort en tournée' },
        { level: 3, name: 'Bus Customisé', cost: 40000, bonus: 30, desc: 'Voyage de luxe' },
        { level: 4, name: 'Jet Privé', cost: 400000, bonus: 100, desc: 'Style de rockstar' }
    ],
    studio: [
        { level: 1, name: 'Home Studio', cost: 3000, bonus: 10, desc: 'Enregistrement maison' },
        { level: 2, name: 'Studio Pro', cost: 18000, bonus: 30, desc: 'Qualité professionnelle' },
        { level: 3, name: 'Studio Légendaire', cost: 80000, bonus: 60, desc: 'Production de classe mondiale' }
    ]
};

// Configuration des types d'albums
const albumTypes = [
    { type: 'demo', name: 'Démo', cost: 300, duration: 20, minStudio: 0, tracks: 3 },
    { type: 'ep', name: 'EP', cost: 1500, duration: 35, minStudio: 1, tracks: 5 },
    { type: 'album', name: 'Album Studio', cost: 7000, duration: 50, minStudio: 2, tracks: 10 },
    { type: 'live', name: 'Album Live', cost: 3500, duration: 40, minStudio: 1, tracks: 8 },
    { type: 'double', name: 'Double Album', cost: 18000, duration: 75, minStudio: 3, tracks: 20 }
];

// Configuration des drogues
const drugs = {
    weed: { name: 'Cannabis', cost: 500, addiction: 5, health: 5, skill: 'charisme', boost: 10 },
    cocaine: { name: 'Cocaïne', cost: 2000, addiction: 15, health: 15, skill: 'scene', boost: 20 },
    heroin: { name: 'Héroïne', cost: 5000, addiction: 30, health: 25, skill: 'technique', boost: 30 }
};

// Configuration des lieux de concerts
const venues = {
    bar:      { name: 'Bar Local',    revenue: 100,   fans: 20,   difficulty: 0.25, cooldown: 14 },
    club:     { name: 'Club',         revenue: 350,   fans: 100,  difficulty: 0.45, cooldown: 20 },
    salle:    { name: 'Grande Salle', revenue: 1800,  fans: 400,  difficulty: 0.60, cooldown: 28 },
    theatre:  { name: 'Théâtre',      revenue: 4500,  fans: 800,  difficulty: 0.68, cooldown: 42 },
    arena:    { name: 'Arena',        revenue: 12000, fans: 2000, difficulty: 0.76, cooldown: 58 },
    festival: { name: 'Festival',     revenue: 45000, fans: 6500, difficulty: 0.86, cooldown: 85 }
};

// Seuils de popularité pour les concerts
const venuePop = {
    bar:     0,
    club:    40,
    salle:   140,
    theatre: 400,
    arena:   900,
    festival: 2200
};

// Configuration des compétences
const skills = [
    { key: 'technique', name: 'Technique', icon: '🎸', effect: 'Améliore la qualité des concerts' },
    { key: 'scene', name: 'Présence Scénique', icon: '🔥', effect: 'Augmente l\'impact sur les fans' },
    { key: 'composition', name: 'Composition', icon: '🎵', effect: 'Permet de meilleures performances' },
    { key: 'charisme', name: 'Charisme', icon: '⭐', effect: 'Facilite l\'entrée dans les groupes' },
    { key: 'marketing', name: 'Marketing', icon: '📢', effect: 'Augmente la popularité' },
    { key: 'endurance', name: 'Endurance', icon: '💪', effect: 'Réduit la perte de santé' }
];

// Catégories de la boutique
const shopCategories = {
    instrument: 'Instruments', 
    amplifier: 'Amplificateurs', 
    lights: 'Éclairages',
    pyrotechnics: 'Pyrotechnie', 
    soundSystem: 'Sonorisation', 
    transport: 'Transport', 
    studio: 'Studio'
};

// =====================
// SYSTÈME D'ACHIEVEMENTS
// =====================
const achievements = [
    // Concerts
    { id: 'first_concert', name: 'Premier Pas', desc: 'Joue ton premier concert', icon: '🎤', check: () => player.concertsPlayed >= 1, reward: { money: 200 } },
    { id: 'concerts_10', name: 'Habitué de la Scène', desc: '10 concerts joués', icon: '🎸', check: () => player.concertsPlayed >= 10, reward: { money: 500 } },
    { id: 'concerts_50', name: 'Vétéran des Planches', desc: '50 concerts joués', icon: '🏆', check: () => player.concertsPlayed >= 50, reward: { money: 2000 } },
    { id: 'concerts_100', name: 'Légende Scénique', desc: '100 concerts joués', icon: '👑', check: () => player.concertsPlayed >= 100, reward: { money: 5000, popularity: 50 } },
    // Fans
    { id: 'fans_100', name: 'Fan Base', desc: 'Atteins 100 fans', icon: '👥', check: () => player.fans >= 100, reward: { money: 300 } },
    { id: 'fans_1000', name: 'Culte Grandissant', desc: 'Atteins 1 000 fans', icon: '🔥', check: () => player.fans >= 1000, reward: { money: 1500 } },
    { id: 'fans_10000', name: 'Star Confirmée', desc: 'Atteins 10 000 fans', icon: '⭐', check: () => player.fans >= 10000, reward: { money: 8000 } },
    { id: 'fans_100000', name: 'Icône Mondiale', desc: 'Atteins 100 000 fans', icon: '🌍', check: () => player.fans >= 100000, reward: { money: 50000, popularity: 200 } },
    // Argent
    { id: 'money_5000', name: 'Premier Cachets', desc: 'Accumule 5 000 €', icon: '💰', check: () => player.money >= 5000, reward: { fans: 100 } },
    { id: 'money_50000', name: 'Riche et Famous', desc: 'Accumule 50 000 €', icon: '💎', check: () => player.money >= 50000, reward: { fans: 500 } },
    { id: 'money_500000', name: 'Millionnaire du Rock', desc: 'Accumule 500 000 €', icon: '🤑', check: () => player.money >= 500000, reward: { fans: 5000 } },
    // Albums
    { id: 'first_album', name: 'Premier Disque', desc: 'Sors ton premier album', icon: '💿', check: () => player.albums.length >= 1, reward: { money: 400 } },
    { id: 'albums_5', name: 'Discographie', desc: 'Sors 5 albums', icon: '🎵', check: () => player.albums.length >= 5, reward: { money: 3000 } },
    { id: 'popular_album', name: 'Disque d\'Or', desc: 'Crée un album populaire', icon: '🥇', check: () => player.albums.some(a => a.isPopular), reward: { money: 2000, fans: 500 } },
    // Skills
    { id: 'skill_50', name: 'Demi-Dieu', desc: 'Une compétence à 50', icon: '📈', check: () => Object.values(player.skills).some(v => v >= 50), reward: { money: 1000 } },
    { id: 'skill_100', name: 'Maître Absolu', desc: 'Une compétence à 100', icon: '🎓', check: () => Object.values(player.skills).some(v => v >= 100), reward: { money: 5000 } },
    // Survie
    { id: 'survive_30', name: 'Résistant', desc: 'Survive jusqu\'à 30 ans', icon: '💪', check: () => player.age >= 30, reward: { health: 10 } },
    { id: 'survive_50', name: 'Ancêtre du Rock', desc: 'Survive jusqu\'à 50 ans', icon: '🧓', check: () => player.age >= 50, reward: { health: 20, money: 5000 } },
    // Groupes
    { id: 'join_group', name: 'Esprit d\'Équipe', desc: 'Rejoins un groupe', icon: '🎸', check: () => player.group !== null, reward: { fans: 200 } },
    { id: 'top_group', name: 'Au Sommet', desc: 'Rejoins Immortal Flames', icon: '🔥', check: () => player.group?.name === 'Immortal Flames', reward: { money: 10000, fans: 2000 } },
    // Festival
    { id: 'first_festival', name: 'Headliner', desc: 'Joue dans un festival', icon: '🎪', check: () => (player.festivalPlayed || 0) >= 1, reward: { money: 5000, fans: 1000 } },
];
