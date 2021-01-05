class Grid {
    constructor(height, length, bombs) {
        this.squares = [];
        this.height = height;
        this.length = length;
        this.bombs = bombs;

        this.checkWin = this.height * this.length - this.bombs;
        document.querySelector('#flags-counter-max').textContent = this.bombs;
        this.fillEmpty();
        this.fillWithBomb();
        this.addClickEvent();
    }

    fillEmpty() {
        const grid = document.querySelector('.grid');
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${this.length}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${this.height}, 1fr)`;

        for (let i = 0; i < this.height; i++) {
            this.squares[i] = [];

            for (let j = 0; j < this.length; j++) {
                this.squares[i][j] = 'O';

                const square = document.createElement('div');
                square.classList.add('square');
                square.setAttribute('id', `grid-${String(i).padStart(2, '0')}-${String(j).padStart(2, '0')}`);
                grid.appendChild(square);
            }
        }
    }

    fillWithBomb() {
        let rdm_Y, rdm_X;
        for (let i = 0; i < this.bombs; i++) {
            do {
                rdm_Y = Math.floor(Math.random() * this.height);
                rdm_X = Math.floor(Math.random() * this.length);
            } while (this.squares[rdm_Y][rdm_X] == 'X');

            this.squares[rdm_Y][rdm_X] = 'X';
        }
    }

    addClickEvent() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.length; j++) {
                if (this.squares[i][j] === 'O') {
                    let squareValue = 0;

                    /* 
                    grid[i-1][j-1]
                    grid[i-1][j]
                    grid[i-1][j+1] */
                    if (this.squares[i - 1] !== undefined) {
                        if (this.squares[i - 1][j - 1] === 'X') {
                            squareValue++;
                        }
                        if (this.squares[i - 1][j] === 'X') {
                            squareValue++;
                        }
                        if (this.squares[i - 1][j + 1] === 'X') {
                            squareValue++;
                        }
                    }

                    /*
                    grid[i][j-1]
                    grid[i][j+1]
                    grid[i+1][j-1]*/
                    if (this.squares[i][j - 1] === 'X') {
                        squareValue++;
                    }
                    if (this.squares[i][j + 1] === 'X') {
                        squareValue++;
                    }

                    /*
                    grid[i+1][j-1]
                    grid[i+1][j]
                    grid[i+1][j+1]*/
                    if (this.squares[i + 1] !== undefined) {
                        if (this.squares[i + 1][j - 1] === 'X') {
                            squareValue++;
                        }
                        if (this.squares[i + 1][j] === 'X') {
                            squareValue++;
                        }
                        if (this.squares[i + 1][j + 1] === 'X') {
                            squareValue++;
                        }
                    }

                    this.squares[i][j] = squareValue;
                }

                const node = document.querySelector(
                    `#grid-${String(i).padStart(2, '0')}-${String(j).padStart(2, '0')}`
                );

                node.addEventListener('click', function (e) {
                    clickEvent(e, false);
                });

                node.addEventListener('contextmenu', function (e) {
                    clickEvent(e, true);
                });
            }
        }
    }
}

const numberToLetter = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
const color = ['#404040', 'blue', 'green', 'red', 'purple', 'purple', 'purple', 'purple', 'purple'];

document.querySelector('#custom').addEventListener('click', () => {
    let edge, bombs;

    do {
        edge = parseInt(prompt('Enter the length of one side of the square\nMin: 4\nMax: 25'));
    } while (edge < 4 || edge > 25 || isNaN(edge));

    do {
        bombs = parseInt(prompt(`Enter the number of bombs\nMin: ${edge * 3}\nMax: ${edge * edge - 1}`));
    } while (bombs < edge * 3 || bombs > edge * edge - 1 || isNaN(bombs));

    curEdge = edge;
    curBombs = bombs;
    createGame(edge, bombs);
});

function createGame(edge, bombs) {
    grid = new Grid(edge, edge, bombs);
    flags = 0;
    updateFlagsCounter(flags);
    winCheck = 0;
}

function updateFlagsCounter(flags) {
    document.querySelector('#flags-counter').textContent = flags;
}

function clickEvent({ target }, flag) {
    const i = Number(target.id.slice(5, 7));
    const j = Number(target.id.slice(8, 10));

    const node = document.querySelector(`#grid-${target.id.slice(5, 7)}-${target.id.slice(8, 10)}`);

    if (flag) {
        if (node.textContent === '') {
            node.textContent = '🚩';
            node.style.background = '#8b8987';
            flags++;
        } else if (node.textContent === '🚩') {
            node.textContent = '';
            node.style.background = '#f3f3f3';
            flags--;
        }

        updateFlagsCounter(flags);
    } else {
        if (node.textContent !== '🚩') {
            if (grid.squares[i][j] === 'X') {
                node.style.background = 'black';
                alert('BOUM !!!\nRETRY');
                createGame(curEdge, curBombs);
            } else {
                if (node.textContent === '') {
                    revealSquare(i, j);
                    if (grid.squares[i][j] === 0) {
                        spreadZero(i, j);
                    }
                }

                setTimeout(() => {
                    if (winCheck === grid.checkWin) {
                        alert('YOU WIN !!');
                        createGame(curEdge, curBombs);
                    }
                }, 50);
            }
        }
    }
}

function revealSquare(i, j) {
    const node = document.querySelector(`#grid-${String(i).padStart(2, '0')}-${String(j).padStart(2, '0')}`);
    node.textContent = numberToLetter[grid.squares[i][j]];
    node.style.background = color[grid.squares[i][j]];
    node.style.color = 'white';
    if (grid.squares[i][j] === 0) {
        node.style.color = 'transparent';
    }
    winCheck++;
}

function spreadZero(i, j) {
    const map = [
        [-1, -1],
        [-1, +0],
        [-1, +1],
        [+0, -1],
        [+0, +1],
        [+1, -1],
        [+1, +0],
        [+1, +1],
    ];

    map.forEach((pos) => {
        if (grid.squares[i + pos[0]] !== undefined) {
            if (grid.squares[i + pos[0]][j + pos[1]] !== undefined) {
                if (
                    document.querySelector(
                        `#grid-${String(i + pos[0]).padStart(2, '0')}-${String(j + pos[1]).padStart(2, '0')}`
                    ).textContent === ''
                ) {
                    document
                        .querySelector(
                            `#grid-${String(i + pos[0]).padStart(2, '0')}-${String(j + pos[1]).padStart(
                                2,
                                '0'
                            )}`
                        )
                        .click();
                }
            }
        }
    });
}

// First Init
let grid,
    flags,
    winCheck,
    curEdge = 20,
    curBombs = 80;
createGame(curEdge, curBombs);

// //Dev Cheat
// showBombs();
// function showBombs() {
//     for (let i = 0; i < curEdge; i++) {
//         for (let j = 0; j < curEdge; j++) {
//             if (grid.squares[i][j] === 'X') {
//                 document.querySelector(
//                     `#grid-${String(i).padStart(2, '0')}-${String(j).padStart(2, '0')}`
//                 ).style.background = 'black';
//             }
//         }
//     }
// }
