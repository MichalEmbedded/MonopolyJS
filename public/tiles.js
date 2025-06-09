export const TILE_TYPES = Object.freeze({
    START: "start",
    PROPERTY: "property",
    DEEDS: "deeds",
    UNEXPECTED: "unexpected",
    ORTHANC: "orthanc",
    PUB: "pub",
    RING: "ring",
    REST: "rest",
    GO_ORTHANC: "go_orthanc",
    TAX: "tax"
});

export const tiles = [

    //--------Linia 1----------

    {
        id: 0,
        name: "Start",
        type: TILE_TYPES.START,
        owner: null
    },
    {
        id: 1,
        name: "Shire",
        type: TILE_TYPES.PROPERTY,
        price: 60,
        rent: [4, 20, 60, 180, 320, 450],
        group: "brown",
        owner: null,
        buildings: 0
    },
    {
        id: 2,
        name: "Deeds of middle earth",
        type: TILE_TYPES.DEEDS,
        deck: "deeds",
        owner: null
    },
    {
        id: 3,
        name: "Bree",
        type: TILE_TYPES.PROPERTY,
        price: 60,
        rent: [4, 20, 60, 180, 320, 450],
        group: "brown",
        owner: null,
        buildings: 0
    },
    {
        id: 4,
        name: "Trolls Demand Payment for Passage",
        type: TILE_TYPES.TAX,
        amount: 200,
        owner: null
    },
    {
        id: 5,
        name: "3 Elf Rings",
        type: TILE_TYPES.RING,
        price: 200,
        rent: [50,100,200,400],
        owner: null
    },
    {
        id: 6,
        name: "Rivendell",
        type: TILE_TYPES.PROPERTY,
        price: 100,
        rent: [6, 30, 90, 270, 400, 550],
        group: "red",
        owner: null,
        buildings: 0
    },
    {
        id: 7,
        name: "Unexpected Journey",
        type: TILE_TYPES.UNEXPECTED,
        deck: "unexpected",
        owner: null
    },
    {
        id: 8,
        name: "Lothlórien",
        type: TILE_TYPES.PROPERTY,
        price: 100,
        rent: [6, 30, 90, 270, 400, 550],
        group: "red",
        owner: null,
        buildings: 0
    },
    {
        id: 9,
        name: "Grey Havens",
        type: TILE_TYPES.PROPERTY,
        price: 120,
        rent: [8, 40, 100, 300, 450, 600],
        group: "red",
        owner: null,
        buildings: 0
    },

    //--------Linia 2----------

    {
        id: 10,
        name: "Orthanc Tower",
        type: TILE_TYPES.ORTHANC,
        isJail: true,
        owner: null
    },
    {
        id: 11,
        name: "Mirkwood",
        type: TILE_TYPES.PROPERTY,
        price: 140,
        rent: [10, 50, 150, 450, 625, 750],
        group: "orange",
        owner: null,
        buildings: 0
    },
    {
        id: 12,
        name: "The Prancing Pony",
        type: TILE_TYPES.PUB,
        price: 150,
        rent: [25, 50, 150, 450, 625, 750],
        owner: null
    },
    {
        id: 13,
        name: "Old Forest",
        type: TILE_TYPES.PROPERTY,
        price: 140,
        rent: [10, 50, 150, 450, 625, 750],
        group: "orange",
        owner: null,
        buildings: 0
    },
    {
        id: 14,
        name: "Fangorn Forest",
        type: TILE_TYPES.PROPERTY,
        price: 160,
        rent: [12, 60, 180, 500, 700, 900],
        group: "orange",
        owner: null,
        buildings: 0
    },
    {
        id: 15,
        name: "7 Dwarf Rings",
        type: TILE_TYPES.RING,
        price: 200,
        rent: [50, 100, 200, 400],
        owner: null
    },
    {
        id: 16,
        name: "Misty Mountains",
        type: TILE_TYPES.PROPERTY,
        price: 180,
        rent: [14, 70, 200, 550, 750, 950],
        group: "grey",
        owner: null,
        buildings: 0
    },
    {
        id: 17,
        name: "Deeds of Middle Earth",
        type: TILE_TYPES.DEEDS,
        deck: "deeds",
        owner: null
    },
    {
        id: 18,
        name: "Ephel Dúath",
        type: TILE_TYPES.PROPERTY,
        price: 180,
        rent: [14, 70, 200, 550, 750, 950],
        group: "grey",
        owner: null,
        buildings: 0
    },
    {
        id: 19,
        name: "Ered Nimrais",
        type: TILE_TYPES.PROPERTY,
        price: 200,
        rent: [16, 80, 220, 600, 800, 1000],
        group: "grey",
        owner: null,
        buildings: 0
    },

    //--------Linia 3----------

    {
        id: 20,
        name: "Rest",
        type: TILE_TYPES.REST,
        owner: null
    },
    {
        id: 21,
        name: "The Paths of the Dead",
        type: TILE_TYPES.PROPERTY,
        price: 220,
        rent: [18, 90, 250, 700, 875, 1050],
        group: "yellow",
        owner: null,
        buildings: 0
    },
    {
        id: 22,
        name: "Unexpected Journey",
        type: TILE_TYPES.UNEXPECTED,
        deck: "unexpected",
        owner: null
    },
    {
        id: 23,
        name: "Edoras",
        type: TILE_TYPES.PROPERTY,
        price: 220,
        rent: [18, 90, 250, 700, 875, 1050],
        group: "yellow",
        owner: null,
        buildings: 0
    },
    {
        id: 24,
        name: "Helm's Deep",
        type: TILE_TYPES.PROPERTY,
        price: 240,
        rent: [20, 100, 300, 750, 925, 1100],
        group: "yellow",
        owner: null,
        buildings: 0
    },
    {
        id: 25,
        name: "9 Human Rings",
        type: TILE_TYPES.RING,
        price: 200,
        rent: [50, 100, 200, 400],
        owner: null
    },
    {
        id: 26,
        name: "Pellenor Fields",
        type: TILE_TYPES.PROPERTY,
        price: 260,
        rent: [22, 110, 330, 800, 975, 1150],
        group: "orange",
        owner: null,
        buildings: 0
    },
    {
        id: 27,
        name: "Osgiliath",
        type: TILE_TYPES.PROPERTY,
        price: 260,
        rent: [22, 110, 330, 800, 975, 1150],
        group: "orange",
        owner: null,
        buildings: 0
    },
    {
        id: 28,
        name: "The Green Dragon",
        type: TILE_TYPES.PUB,
        price: 150,
        rent: [25, 50, 150, 450, 625, 750],
        owner: null
    },
    {
        id: 29,
        name: "Minas Tirith",
        type: TILE_TYPES.PROPERTY,
        price: 280,
        rent: [24, 120, 360, 850, 1025, 1200],
        group: "orange",
        owner: null,
        buildings: 0
    },

    //--------Linia 4----------

    {
        id: 30,
        name: "Go to Orthanc",
        type: TILE_TYPES.GO_ORTHANC,
        sendsTo: 10,
        owner: null
    },
    {
        id: 31,
        name: "Barad Dûr",
        type: TILE_TYPES.PROPERTY,
        price: 300,
        rent: [26, 130, 390, 900, 1100, 1275],
        group: "darkred",
        owner: null,
        buildings: 0
    },
    {
        id: 32,
        name: "Black Gate",
        type: TILE_TYPES.PROPERTY,
        price: 300,
        rent: [26, 130, 390, 900, 1100, 1275],
        group: "darkred",
        owner: null,
        buildings: 0
    },
    {
        id: 33,
        name: "Deeds of Middle Earth",
        type: TILE_TYPES.DEEDS,
        deck: "deeds",
        owner: null
    },
    {
        id: 34,
        name: "Mount Doom",
        type: TILE_TYPES.PROPERTY,
        price: 320,
        rent: [28, 150, 450, 1000, 1200, 1400],
        group: "darkred",
        owner: null,
        buildings: 0
    },
    {
        id: 35,
        name: "The One Ring",
        type: TILE_TYPES.RING,
        price: 200,
        rent: [50, 100, 200, 400],
        owner: null
    },
    {
        id: 36,
        name: "Unexpected Journey",
        type: TILE_TYPES.UNEXPECTED,
        deck: "unexpected",
        owner: null
    },
    {
        id: 37,
        name: "Erebor",
        type: TILE_TYPES.PROPERTY,
        price: 350,
        rent: [35, 175, 500, 1100, 1300, 1500],
        group: "black",
        owner: null,
        buildings: 0
    },
    {
        id: 38,
        name: "Dwarf Luxury Tax",
        type: TILE_TYPES.TAX,
        amount: 100,
        owner: null
    },
    {
        id: 39,
        name: "Moria",
        type: TILE_TYPES.PROPERTY,
        price: 400,
        rent: [50, 200, 600, 1400, 1700, 2000],
        group: "black",
        owner: null,
        buildings: 0
    }
];
