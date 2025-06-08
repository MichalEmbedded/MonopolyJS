export const deedsDeck = [
    {
        id: 1,
        text: "Rohan Sends Aid – otrzymujesz 150¤ od banku.",
        action: (player) => {
            player.money += 150;
            return player;
        }
    },
    {
        id: 2,
        text: "Gandalf the Grey Intervenes – wyjdź za darmo z Orthanku.",
        action: (player) => {
            player.getOutOfJailFree = true;
            return player;
        }
    },
    {
        id: 3,
        text: "Secret Passage through Moria – przesuń się na Moria.",
        action: (player) => {
            player.position = 39; // ID pola "Moria"
            return player;
        }
    },
    {
        id: 4,
        text: "Temptation of the Ring – rzuć kostką: 4–6 +100¤, inaczej -100¤.",
        action: (player) => {
            const roll = Math.floor(Math.random() * 6) + 1;
            player.money += (roll >= 4) ? 100 : -100;
            return player;
        }
    },
    {
        id: 5,
        text: "Battle at Helm's Deep – zapłać 50¤ każdemu graczowi.",
        action: (player, allPlayers) => {
            const total = 50 * (allPlayers.length - 1);
            if (player.money >= total) {
                player.money -= total;
                allPlayers.forEach(p => {
                    if (p.id !== player.id) p.money += 50;
                });
            }
            return player;
        }
    }
];
