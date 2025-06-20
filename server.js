const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let playerOrder = [];
let currentTurnIndex = 0;
const players = {};
let usedColors = new Set();

io.on('connection', (socket) => {
    console.log('Gracz połączony:', socket.id);

    socket.emit('update-blocked-colors', Array.from(usedColors));

    socket.on('new-player', (playerData) => {
        if(Object.keys(players).length >=4) {
            socket.emit('join-denied', 'Gra ma już maksymalną liczbę graczy.');
            return;
        }

        players[socket.id] = playerData;

        if (!playerOrder.includes(socket.id)) {
            playerOrder.push(socket.id);
        }

        console.log('Nowy gracz dołączył:', playerData);

        io.emit('update-players', Object.values(players));
        io.emit('current-turn', playerOrder[currentTurnIndex]);

        if(Object.keys(players).length < 2) {
            io.emit('block-start', 'Gra wymaga minimum 2 graczy!');
        } else {
            io.emit('unblock-start');
        }
    })

    socket.on('color-blocked', ({ selectedColor }) => {
        console.log('PRZED DODANIEM:', usedColors, typeof usedColors);
        usedColors.add(selectedColor);
        console.log('PO DODANIU:', usedColors, typeof usedColors);
        io.emit('update-blocked-colors', Array.from(usedColors));
    });

    socket.on('end-turn', () => {
        if(socket.id !== playerOrder[currentTurnIndex]) return;

        currentTurnIndex = (currentTurnIndex + 1) % playerOrder.length;
        io.emit('current-turn', playerOrder[currentTurnIndex]);
    })

    socket.on('disconnect', () => {
        console.log('Gracz rozłączony:', socket.id);

        const player = players[socket.id];
        if (player) {
            usedColors.delete(player.color);
        }
        console.log("TEST KOLORÓW: ", usedColors);

        delete players[socket.id];

        const index = playerOrder.indexOf(socket.id);
        if (index !== -1) {
            playerOrder.splice(index, 1);

            if (index <= currentTurnIndex && currentTurnIndex > 0) {
                currentTurnIndex--;
            }
        }

        if (playerOrder.length === 0) {
            currentTurnIndex = 0;
        } else {
            currentTurnIndex = currentTurnIndex % playerOrder.length;
        }
        io.emit('update-blocked-colors', Array.from(usedColors));
        io.emit('update-players', Object.values(players));
        io.emit('current-turn', playerOrder[currentTurnIndex] || null);

    });

    socket.on('player-move', (updatedPlayer) => {
        if (players[socket.id]) {
            players[socket.id] = updatedPlayer;
            io.emit('update-players', Object.values(players));
        }
    });

    socket.on('update-player', (updatedPlayer) => {
        const id = updatedPlayer.id; // zawsze używamy id aktualnego połączenia
        if (players[id]) {
            players[id] = updatedPlayer;
            io.emit('update-players', Object.values(players));
            io.emit('update-money', Object.values(players));
        }
    });

    socket.on('property-bought', ({ tileId, owner }) => {
        io.emit('property-update', { tileId, owner });
    });

    socket.on('pay-rent', ({ tileId, currentPlayer }) => {
        io.emit('rent-update', { tileId, currentPlayer });
    });

    socket.on('player-surrender', (player) => {
        console.log(`Gracz ${player.name} się poddał.`);

        delete players[player.id];
        usedColors.delete(player.color);

        const index = playerOrder.indexOf(player.id);
        if (index !== -1) {
            playerOrder.splice(index, 1);
            if (index <= currentTurnIndex && currentTurnIndex > 0) {
                currentTurnIndex--;
            }
        }

        io.emit('update-blocked-colors', Array.from(usedColors));
        io.emit('update-players', Object.values(players));

        if (playerOrder.length === 0) {
            currentTurnIndex = 0;
        } else {
            currentTurnIndex %= playerOrder.length;
            io.emit('current-turn', playerOrder[currentTurnIndex]);
        }
    });

});

server.listen(3000, '0.0.0.0',() => {
    console.log('Serwer działa na http://localhost:3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/plansza.html');
});

