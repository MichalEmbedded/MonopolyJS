export const unexpectedDeck = [
    {
        id: 1,
        text: "You encounter Gollum – lose 50¤ while escaping.",
        action: (player, _allPlayers, _emit, modified) => {
            if(player.money >= 50) {
                player.money -= 50;
            }else{
                player.money = 0;
            }
            modified.add(player);
        }
    },
    {
        id: 2,
        text: "Elrond heals your wounds – gain 100¤.",
        action: (player, _allPlayers, _emit, modified) => {
            player.money += 100;
            modified.add(player);
        }
    },
    {
        id: 3,
        text: "You are caught by Orcs – go to Orthanc.",
        action: (player, _allPlayers, emit, modified) => {
            player.position = 10; // Orthanc
            emit('player-move', player);
            modified.add(player);
        }
    },
    {
        id: 4,
        text: "You find a shortcut – advance to The Green Dragon.",
        action: (player, _allPlayers, emit, modified) => {
            player.position = 28; // The Green Dragon
            emit('player-move', player);
            modified.add(player);
        }
    }
];
