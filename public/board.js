import { tiles } from './tiles.js';

const socket = io();
let currentPlayer = null;

// ------------------- POŁĄCZENIE -------------------
socket.on('connect', () => {
    console.log('Połączono z serwerem, ID:', socket.id);

    showJoinPopup(({ name, color }) => {
        currentPlayer = {
            id: socket.id,
            name,
            color,
            position: 0,
            money: 1500
        };
        socket.emit('new-player', currentPlayer);
    });
});

// ------------------- RZUT KOSTKĄ -------------------
let doubleCount = 0;

document.getElementById('roll-dice').addEventListener('click', () => {
    if (!currentPlayer) return;

    document.getElementById('roll-dice').disabled = true;
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const rollsum = roll1 + roll2;
    const isDouble = roll1 === roll2;

    const wynik = document.getElementById('dice-result');
    wynik.textContent = `Wyrzuciłeś: ${roll1} + ${roll2} = ${rollsum}` + (isDouble ? ' (DUBLET!)' : '');

    const nextTile = document.getElementById('next-tile');
    nextTile.style.display = 'flex';

    const newNextTile = nextTile.cloneNode(true);
    nextTile.parentNode.replaceChild(newNextTile, nextTile);

    newNextTile.addEventListener('click', () => {
        if (isDouble) {
            doubleCount++;
            document.getElementById('roll-dice').disabled = false;
        } else {
            doubleCount = 0;
        }

        // 3 dublety = więzienie
        if (doubleCount >= 3) {
            currentPlayer.position = 10; // pole więzienia (Orthanc)
            wynik.textContent = '3 doublets in a row! You are sentenced for ORTHANC TOWER';
            doubleCount = 0;
        } else {
            currentPlayer.position = (currentPlayer.position + rollsum) % tiles.length;
            socket.emit('player-move', currentPlayer);

            // jeśli dublet – pozwól rzucić ponownie
            if (isDouble) {
                wynik.textContent += ' Rzuć ponownie!';
                // Można aktywować przycisk rzutu ponownie tutaj
                // lub po prostu nie wyłączać go
            } else {
                // Tu można zakończyć turę i przejść do następnego gracza
            }
        }

        newNextTile.style.display = 'none';
    });
});

// ------------------- KOGO TURA REAKCJA -------------------
let isMyTurn = false;

document.getElementById('next-turn').addEventListener('click', () => {
    if (isMyTurn) {
        socket.emit('end-turn');
    }
});

socket.on('current-turn', (playerId) => {
    isMyTurn = currentPlayer && currentPlayer.id === playerId;

    const turnDisplay = document.getElementById('turn-indicator');
    if (turnDisplay) {
        turnDisplay.textContent = isMyTurn ? 'Twoja tura' : `Tura innego gracza`;
    }

    // Blokuj / odblokuj przyciski
    document.getElementById('roll-dice').disabled = !isMyTurn;
    document.getElementById('next-turn').disabled = !isMyTurn;
});


// ------------------- TWORZENIE PLANSZY -------------------
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

// ------------------- POPUP DOŁĄCZANIA -------------------
function showJoinPopup(onJoin) {
    const overlay = document.createElement('div');
    overlay.classList.add('join');

    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
    <h2>Dołącz do gry</h2>
    <input type="text" id="player-name" placeholder="Twoje imię" style="padding:5px; width: 80%; margin-bottom:10px;"><br>
    <label for="player-color">Wybierz kolor pionka:</label><br>
    <input type="color" id="player-color" value="#3498db" style="margin:10px;"><br>
    <button id="join-game" style="padding:8px 16px; font-size:16px;">Dołącz</button>
  `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    document.getElementById('join-game').addEventListener('click', () => {
        const name = document.getElementById('player-name').value.trim();
        const color = document.getElementById('player-color').value;

        if (name === '') {
            alert('Podaj swoje imię!');
            return;
        }

        document.body.removeChild(overlay);
        onJoin({ name, color });
    });
}

// ------------------- TWORZENIE PIONKA -------------------
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

// ------------------- AKTUALIZACJA GRACZY -------------------
socket.on('update-players', (playersList) => {
    document.querySelectorAll('.pawn').forEach(p => p.remove());

    playersList.forEach(player => {
        if (!player || typeof player.position !== 'number') return;

        const tile = document.querySelectorAll('.tile')[player.position];
        if (tile) {
            const pawn = createPawn(player);
            tile.appendChild(pawn);
        }
    });
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