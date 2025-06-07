// ------------------- IMPORT DANYCH PLANSZY -------------------
import {TILE_TYPES, tiles} from './tiles.js';

const socket = io(); // Połączenie z serwerem przez Socket.io
let currentPlayer = null; // Dane bieżącego gracza

// ------------------- POŁĄCZENIE Z SERWEREM -------------------
socket.on('connect', () => {
    console.log('Połączono z serwerem, ID:', socket.id);

    // Pokazuje popup do wpisania imienia i wyboru koloru
    showJoinPopup(({ name, color }) => {
        currentPlayer = {
            id: socket.id,
            name,
            color,
            position: 0,
            money: 1500,
            properties: [],
            inJail: false,
            turnsInJail: 0
        };
        socket.emit('new-player', currentPlayer); // Wysyłamy dane nowego gracza na serwer
    });
});

// ------------------- POKAZANIE PRZYCISKU "KUP" -------------------
function showBuyButton(tile, player) {
    const allTiles = document.querySelectorAll('.tile');
    const tileEl = allTiles[tile.id];

    if (tileEl.querySelector('.buy-button')) return; // Nie pokazuj drugi raz przycisku

    const priceEl = tileEl.querySelector('.tile-price');

    // Tworzenie znacznika właściciela
    let savedLogo = document.createElement('div');
    savedLogo.classList.add('owner');
    savedLogo.style.backgroundColor = player.color;
    savedLogo.title = player.name;

    // Usuwanie ceny i zachowanie jej do ewentualnego przywrócenia
    let savedPrice = null;
    if (priceEl) {
        savedPrice = priceEl.cloneNode(true);
        priceEl.remove();
    }

    // Tworzenie przycisku "Kup za..."
    const button = document.createElement('button');
    button.textContent = `Kup za ${tile.price}¤`;
    button.className = 'buy-button';
    button.style.marginTop = '4px';
    button.style.padding = '2px 6px';
    button.style.cursor = 'pointer';

    // Obsługa kliknięcia "Kup"
    button.addEventListener('click', () => {
        if (player.money >= tile.price) {
            player.money -= tile.price;
            tile.owner = player.id;
            player.properties.push(tile.id);

            socket.emit('property-bought', { tileId: tile.id, owner: currentPlayer });
            socket.emit('update-player', player);

            button.remove();
            tileEl.appendChild(savedLogo); // Dodanie oznaczenia właściciela
        } else {
            alert('Nie masz wystarczająco pieniędzy!');
        }
    });

    tileEl.appendChild(button);
}

// ------------------- SPRAWDZENIE POLECENIA NA POLU -------------------
function handleTileAction(player){
    const tile = tiles[player.position];

    if (tile.type === TILE_TYPES.PROPERTY || tile.type === TILE_TYPES.PUB || tile.type === TILE_TYPES.RING ){
        if(tile.owner === null) {
            showBuyButton(tile,player);
        } else if(tile.owner !== player.id){
            const rent = tile.rent[0]; // TODO: obsługa płacenia czynszu
        }
    }
}

let isBlocked = false;

// ------------------- BLOKADA GRY DLA POJEDYNCZEGO GRACZA -------------------
socket.on('block-start', (message) => {
    isBlocked = true;
    alert(message);
    document.getElementById('roll-dice').disabled = true;
});

// ------------------- ODMROŻENIE GRY -------------------
socket.on('unblock-start', () => {
    isBlocked = false;
    if (isMyTurn){
        document.getElementById('roll-dice').disabled = false;
    }
});

// ------------------- OBSŁUGA RZUTU KOSTKĄ -------------------
let doubleCount = 0;

document.getElementById('roll-dice').addEventListener('click', () => {
    if (!currentPlayer || isBlocked) return;

    document.getElementById('roll-dice').disabled = true;
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const rollsum = roll1 + roll2;
    const isDouble = roll1 === roll2;

    const wynik = document.getElementById('dice-result');
    wynik.textContent = `Wyrzuciłeś: ${roll1} + ${roll2} = ${rollsum}` + (isDouble ? ' (DUBLET!)' : '');

    const nextTile = document.getElementById('next-tile');
    nextTile.style.display = 'flex';

    // Obsługa ruchu po kliknięciu w "Idź dalej"
    const newNextTile = nextTile.cloneNode(true);
    nextTile.parentNode.replaceChild(newNextTile, nextTile);

    newNextTile.addEventListener('click', () => {
        if (isDouble) {
            doubleCount++;
            document.getElementById('roll-dice').disabled = false;
        } else {
            doubleCount = 0;
        }

        // Trzeci dublet — więzienie
        if (doubleCount >= 3) {
            currentPlayer.position = 10; // Orthanc
            wynik.textContent = '3 doublets in a row! You are sentenced for ORTHANC TOWER';
            doubleCount = 0;
        } else {
            currentPlayer.position = (currentPlayer.position + rollsum) % tiles.length;
            socket.emit('player-move', currentPlayer);
            handleTileAction(currentPlayer);
        }

        newNextTile.style.display = 'none';
    });
});

// ------------------- OBSŁUGA KOŃCA TURY -------------------
let isMyTurn = false;

document.getElementById('next-turn').addEventListener('click', () => {
    if (isMyTurn) {
        // Usuwanie przycisków "Kup" z planszy
        document.querySelectorAll('.buy-button').forEach(btn => btn.remove());

        // Przywracanie ceny na polach niekupionych
        tiles.forEach(tile => {
            if (!tile.owner) {
                const tileEl = document.querySelectorAll('.tile')[tile.id];
                if (!tileEl.querySelector('.tile-price') && tile.price) {
                    const price = document.createElement('div');
                    price.classList.add('tile-price');
                    price.textContent = `${tile.price} ¤`;
                    tileEl.appendChild(price);
                }
            }
            // Dodaj znacznik na kupione pole
            // if (tile.owner){
            //     //const ownerPlayer = playersList.find(p => p.id === tile.owner);
            //     const tileNow = document.querySelectorAll('.tile')[tile.id];
            //     if (!tileNow.querySelector('.owner')) {
            //         const savedLogo = document.createElement('div');
            //         savedLogo.classList.add('owner');
            //         savedLogo.style.backgroundColor = currentPlayer.color;
            //         savedLogo.title = currentPlayer.name;
            //         tileNow.appendChild(savedLogo);
            //     }
            // }
        });

        socket.emit('end-turn');
    }
});

// ------------------- OBSŁUGA INFORMACJI KTO MA TURĘ -------------------
socket.on('current-turn', (playerId) => {
    isMyTurn = currentPlayer && currentPlayer.id === playerId;

    const turnDisplay = document.getElementById('turn-indicator');
    if (turnDisplay) {
        turnDisplay.textContent = isMyTurn ? 'Twoja tura' : `Tura innego gracza`;
    }

    // Włączenie / wyłączenie przycisków
    document.getElementById('roll-dice').disabled = !isMyTurn || isBlocked;
    document.getElementById('next-turn').disabled = !isMyTurn;
});

// ------------------- TWORZENIE STRUKTURY PLANSZY -------------------
const rowConfig = [
    { id: 0, name: 'row-0', area: 'a' },
    { id: 10, name: 'row-1', area: 'b' },
    { id: 20, name: 'row-2', area: 'c' },
    { id: 30, name: 'row-3', area: 'd' }
];

rowConfig.forEach(({ id, name, area }) => {
    const rowDiv = document.createElement('div');
    rowDiv.id = name;
    rowDiv.className = 'row';
    rowDiv.style.gridArea = area;
    document.getElementById('board').appendChild(rowDiv);
});

// ------------------- TWORZENIE KAFELKÓW -------------------
tiles.forEach(tile => {
    const tileEl = document.createElement('div');
    tileEl.classList.add('tile');

    if (tile.group) {
        const tileColor = document.createElement('div');
        tileColor.classList.add('tile-color');
        tileColor.style.background = tile.group;
        tileEl.appendChild(tileColor);
    }

    const nameEl = document.createElement('div');
    nameEl.classList.add('tile-name');
    nameEl.textContent = tile.name;
    tileEl.appendChild(nameEl);

    if (tile.price) {
        const priceEl = document.createElement('div');
        priceEl.classList.add('tile-price');
        priceEl.textContent = `${tile.price} ¤`;
        tileEl.appendChild(priceEl);
    }

    const rowId = tile.id <= 9 ? 'row-0' : tile.id <= 19 ? 'row-1' : tile.id <= 29 ? 'row-2' : 'row-3';
    document.getElementById(rowId).appendChild(tileEl);
});

// ------------------- POPUP DO DOŁĄCZENIA DO GRY -------------------
function showJoinPopup(onJoin) {
    const overlay = document.createElement('div');
    overlay.classList.add('join');

    const popup = document.createElement('div');
    popup.classList.add('popup');

    const colors = [
        { name: 'Różowy', value: '#ff69b4' },
        { name: 'Czerwony', value: '#e74c3c' },
        { name: 'Niebieski', value: '#3498db' },
        { name: 'Zielony', value: '#2ecc71' },
        { name: 'Czarny', value: '#000000' },
        { name: 'Kremowy', value: '#f5deb3' }
    ];

    let selectedColor = colors[2].value;

    const colorButtons = colors.map(c => `
        <div class="color-choice" data-color="${c.value}" title="${c.name}" style="background: ${c.value};"></div>
    `).join('');

    popup.innerHTML = `
        <h2>Dołącz do gry</h2>
        <input type="text" id="player-name" placeholder="Twoje imię" style="padding:5px; width: 80%; margin-bottom:10px;"><br>
        <label>Wybierz kolor pionka:</label><br>
        <div id="color-options" style="margin:10px 0;">${colorButtons}</div>
        <button id="join-game" style="padding:8px 16px; font-size:16px;">Dołącz</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Wybór koloru
    const choices = popup.querySelectorAll('.color-choice');
    choices.forEach(el => {
        el.addEventListener('click', () => {
            selectedColor = el.dataset.color;
            choices.forEach(c => c.style.border = '2px solid #ccc');
            el.style.border = '3px solid #000';
        });
    });

    // Obsługa kliknięcia „Dołącz”
    document.getElementById('join-game').addEventListener('click', () => {
        const name = document.getElementById('player-name').value.trim();
        if (name === '') {
            alert('Podaj swoje imię!');
            return;
        }

        document.body.removeChild(overlay);
        onJoin({ name, color: selectedColor });
    });
}

// ------------------- TWORZENIE PIONKA NA PLANSZY -------------------
function createPawn(player) {
    const pawn = document.createElement('div');
    pawn.classList.add('pawn');
    pawn.style.backgroundColor = player.color;
    pawn.title = player.name;

    const label = document.createElement('div');
    label.classList.add('pawn-label');
    label.textContent = player.name[0] || '?';

    pawn.appendChild(label);
    pawn.id = 'pawn-' + player.id;
    return pawn;
}

// ------------------- ODBIÓR AKTUALNEJ LISTY GRACZY -------------------
socket.on('update-players', (playersList) => {
    document.querySelectorAll('.pawn').forEach(p => {
        if (!p.classList.contains('owner-marker')) p.remove();
    });
    playersList.forEach(player => {
        if (!player || typeof player.position !== 'number') return;

        const tile = document.querySelectorAll('.tile')[player.position];
        if (tile) {
            const pawn = createPawn(player);
            tile.appendChild(pawn);
        }
    });
});

socket.on('property-update', ({ tileId, owner }) => {

    const tile = tiles[tileId];
    if (!tile) return;
    tile.owner = owner.id;

    const tileEl = document.querySelectorAll('.tile')[tileId];
    if (!tileEl) return;

    const priceEl = tileEl.querySelector('.tile-price');
    if (priceEl) {
        priceEl.remove();
    }

    if (!tileEl.querySelector('.owner')) {
        const marker = document.createElement('div');
        marker.classList.add('owner');
        marker.style.backgroundColor = owner.color;
        marker.title = owner.name;
        tileEl.appendChild(marker);
    }

});

// ------------------- ODRZUCENIE DOŁĄCZENIA -------------------
socket.on('join-denied', (message) => {
    alert(message);
    document.body.innerHTML = `
    <div style="display: flex; height: 100vh; align-items: center; justify-content: center; font-size: 24px; color: red;">
      ${message}
    </div>
  `;
});
