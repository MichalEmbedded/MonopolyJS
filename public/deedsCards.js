export const deedsDeck = [
    {
        id: 1,
        text: "Rohan Sends Aid – otrzymujesz 150¤ od banku.",
        action: (player, _allPlayers, _emit, modified) => {
            player.money += 150;
            modified.add(player);
        }
    },
    {
        id: 2,
        text: "Gandalf the Grey Intervenes – wyjdź za darmo z Orthanku.",
        action: (player, _allPlayers, _emit, modified) => {
            player.getOutOfJailFree = true;
            modified.add(player);
        }
    },
    {
        id: 3,
        text: "Secret Passage through Moria – przesuń się na Moria.",
        action: (player, _allPlayers, emit, modified) => {
            player.position = 39;
            emit('player-move', player);
            modified.add(player);
        }
    },
    {
        id: 4,
        text: "Battle at Helm's Deep – zapłać 50¤ każdemu graczowi.",
        action: (player, allPlayers, _emit, modified) => {
            player.money -= 50;
            modified.add(player);

            allPlayers.forEach(p => {
                if (p.id !== player.id) {
                    p.money += 50;
                    modified.add(p);
                }
            });
        }
    }
];
