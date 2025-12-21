// Configuration des groupes
const groups = [
    { name: 'Les Débutants', minPop: 0, bonus: 1.2, members: 3 },
    { name: 'Death Scream', minPop: 50, bonus: 1.5, members: 4 },
    { name: 'Iron Thunder', minPop: 150, bonus: 2, members: 5 },
    { name: 'Metal Gods', minPop: 500, bonus: 3, members: 5 },
    { name: 'Legends of Rock', minPop: 1500, bonus: 5, members: 6 },
    { name: 'Immortal Flames', minPop: 3000, bonus: 7, members: 7 }
];

// Configuration de la boutique d'équipement
const shopItems = {
    instrument: [
        { level: 1, name: 'Instrument Débutant', cost: 500, bonus: 5 },
        { level: 2, name: 'Instrument Intermédiaire', cost: 2000, bonus: 15 },
        { level: 3, name: 'Instrument Pro', cost: 8000, bonus: 30 },
        { level: 4, name: 'Instrument Légendaire', cost: 25000, bonus: 50 },
        { level: 5, name: 'Instrument de Collection', cost: 100000, bonus: 80 }
    ],
    amplifier: [
        { level: 1, name: 'Ampli Basic', cost: 400, bonus: 5 },
        { level: 2, name: 'Ampli Marshall', cost: 1500, bonus: 15 },
        { level: 3, name: 'Stack Complet', cost: 6000, bonus: 25 },
        { level: 4, name: 'Ampli Stadium', cost: 20000, bonus: 45 }
    ],
    lights: [
        { level: 1, name: 'Éclairages Basiques', cost: 1000, bonus: 10 },
        { level: 2, name: 'Lasers & LED', cost: 5000, bonus: 25 },
        { level: 3, name: 'Show Laser Complet', cost: 15000, bonus: 50 },
        { level: 4, name: 'Production Holographique', cost: 50000, bonus: 80 }
    ],
    pyrotechnics: [
        { level: 1, name: 'Fumée & Étincelles', cost: 2000, bonus: 15 },
        { level: 2, name: 'Flammes & Explosions', cost: 8000, bonus: 35 },
        { level: 3, name: 'Pyrotechnie Complète', cost: 20000, bonus: 60 },
        { level: 4, name: 'Spectacle Pyrotechnique Épique', cost: 75000, bonus: 100 }
    ],
    soundSystem: [
        { level: 1, name: 'Sono Standard', cost: 800, bonus: 8 },
        { level: 2, name: 'Sono Pro', cost: 3000, bonus: 20 },
        { level: 3, name: 'Sono Stadium', cost: 12000, bonus: 40 },
        { level: 4, name: 'Système Audio Spatial', cost: 40000, bonus: 70 }
    ],
    transport: [
        { level: 1, name: 'Van d\'occasion', cost: 3000, bonus: 5, desc: 'Transport basique' },
        { level: 2, name: 'Tour Bus', cost: 15000, bonus: 15, desc: 'Confort en tournée' },
        { level: 3, name: 'Bus Customisé', cost: 50000, bonus: 30, desc: 'Voyage de luxe' },
        { level: 4, name: 'Jet Privé', cost: 500000, bonus: 100, desc: 'Style de rockstar' }
    ],
    studio: [
        { level: 1, name: 'Home Studio', cost: 5000, bonus: 10, desc: 'Enregistrement maison' },
        { level: 2, name: 'Studio Pro', cost: 25000, bonus: 30, desc: 'Qualité professionnelle' },
        { level: 3, name: 'Studio Légendaire', cost: 100000, bonus: 60, desc: 'Production de classe mondiale' }
    ]
};

// Configuration des types d'albums
const albumTypes = [
    { type: 'demo', name: 'Démo', cost: 500, duration: 30, minStudio: 0, tracks: 3 },
    { type: 'ep', name: 'EP', cost: 2000, duration: 45, minStudio: 1, tracks: 5 },
    { type: 'album', name: 'Album Studio', cost: 10000, duration: 60, minStudio: 2, tracks: 10 },
    { type: 'live', name: 'Album Live', cost: 5000, duration: 50, minStudio: 1, tracks: 8 },
    { type: 'double', name: 'Double Album', cost: 25000, duration: 90, minStudio: 3, tracks: 20 }
];

// Configuration des drogues
const drugs = {
    weed: { name: 'Cannabis', cost: 500, addiction: 5, health: 5, skill: 'charisme', boost: 10 },
    cocaine: { name: 'Cocaïne', cost: 2000, addiction: 15, health: 15, skill: 'scene', boost: 20 },
    heroin: { name: 'Héroïne', cost: 5000, addiction: 30, health: 25, skill: 'technique', boost: 30 }
};

// Configuration des lieux de concerts
const venues = {
    bar: { name: 'Bar Local', revenue: 100, fans: 20, difficulty: 0.3, cooldown: 15 },
    club: { name: 'Club', revenue: 350, fans: 100, difficulty: 0.5, cooldown: 20 },
    salle: { name: 'Grande Salle', revenue: 1750, fans: 400, difficulty: 0.65, cooldown: 30 },
    theatre: { name: 'Théâtre', revenue: 4500, fans: 800, difficulty: 0.7, cooldown: 45 },
    arena: { name: 'Arena', revenue: 11500, fans: 2000, difficulty: 0.75, cooldown: 60 },
    festival: { name: 'Festival', revenue: 42500, fans: 6000, difficulty: 0.85, cooldown: 90 }
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