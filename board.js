import { tiles } from './tiles.js';

tiles.forEach(tile => {

    if(tile.id === 0){
        const divRow0 = document.createElement('div');
        divRow0.id = 'row-0';
        divRow0.className = 'row';
        divRow0.style.gridArea = 'a';
        document.getElementById('board').appendChild(divRow0);
    }else if(tile.id === 10){
        const divRow1 = document.createElement('div');
        divRow1.id = 'row-1';
        divRow1.className = 'row';
        divRow1.style.gridArea = 'b';
        document.getElementById('board').appendChild(divRow1);
    }else if(tile.id === 20){
        const divRow2 = document.createElement('div');
        divRow2.id = 'row-2';
        divRow2.className = 'row';
        divRow2.style.gridArea = 'c';
        document.getElementById('board').appendChild(divRow2);
    }else if(tile.id === 30){
        const divRow3 = document.createElement('div');
        divRow3.id = 'row-3';
        divRow3.className = 'row';
        divRow3.style.gridArea = 'd';
        document.getElementById('board').appendChild(divRow3);
    }

    const tileEl = document.createElement('div');
    tileEl.classList.add('tile');

    if(tile.group){
        const tileColor = document.createElement('div');
        tileColor.classList.add('tile-color');
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

    let rowId = '';

    if (tile.id <= 9) rowId = 'row-0';
    else if (tile.id <= 19) rowId = 'row-1';
    else if (tile.id <= 29) rowId = 'row-2';
    else if (tile.id <= 39) rowId = 'row-3';

    document.getElementById(rowId).appendChild(tileEl);

});
