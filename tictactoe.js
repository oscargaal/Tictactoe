let gameStarted = false;

let aiTimeoutId = null;
let aiIsThinking = false;

let divCounter = 0;
let gameOver = false;

let allGame = document.querySelector(".allGame");

let cell = document.querySelector(".cell");

let menuStart = document.querySelector(".menuStart");
let xStart = document.querySelector(".xStart");
let oStart = document.querySelector(".oStart");

let xIsStarting = false;

let xMoment = document.querySelector(".xMoment");
let xWinText = document.querySelector(".xWin")

let oMoment = document.querySelector(".oMoment");
let oWinText = document.querySelector(".oWin");

let xTurnColor = document.querySelector(".xTurnColor");
let oTurnColor = document.querySelector(".oTurnColor");

let tieText = document.querySelector(".tie");

let mainColor = document.querySelector(".mainColor");

let chooseGamemode = document.getElementById("gameMode");
let gameModeChoosed = "playerVsPlayer";

const game = {
    xTurn: true,
    xState: [],
    oState: [],
    winningStates: [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],

        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],

        ['0', '4', '8'],
        ['2', '4', '6']
    ]
}

const cells = [];

for (let i = 0; i < 9; i++) {
    cells.push(document.getElementById(`${i}`))
}

const playClickSound = () => {
    const clickSound = new Audio("./sound/click.mp3");
    clickSound.play();
};

const startClassListManipulator = (color, action) => {
    if (!gameStarted) color.classList[action]("hidden");
}

const classListAddHidden = (element) => {
    element.classList.add("hidden");
}

const classListRemoveHidden = (element) => {
    element.classList.remove("hidden");
}

const modificacionesClickX = (divClick, divClickDad) => {
    game.xState.push(divClick.id);
    divClick.classList.add('x');
    divClickDad.classList.add('bg-[#A4B465]');
    divClickDad.classList.remove('hover:bg-gray-200');
    classListRemoveHidden(oMoment);
    classListRemoveHidden(oTurnColor);
    classListAddHidden(xMoment);
    classListAddHidden(xTurnColor);
}

const modificacionesClickO = (divClick, divClickDad) => {
    game.oState.push(divClick.id);
    divClick.classList.add('o');
    divClickDad.classList.add('bg-[#F0BB78]');
    divClickDad.classList.remove('hover:bg-gray-200');
    classListRemoveHidden(xMoment);
    classListRemoveHidden(xTurnColor);
    classListAddHidden(oMoment);
    classListAddHidden(oTurnColor);
}

const checkWinner = () => {
    for (let win of game.winningStates) {
        let xWins = true;
        let oWins = true;

        for (let pos of win) {
            if (!game.xState.includes(pos)) {
                xWins = false;
            }
            if (!game.oState.includes(pos)) {
                oWins = false;
            }
        }

        if (xWins) {
            gameOver = true
            classListRemoveHidden(xWinText);
            mainColor.classList.replace("bg-[#F5ECD5]", "bg-[#A4B465]");

        } else if (oWins) {
            gameOver = true
            classListRemoveHidden(oWinText);
            mainColor.classList.replace("bg-[#F5ECD5]", "bg-[#F0BB78]");
        }
    }

    if (divCounter === 9 && gameOver === false) {
        gameOver = true
        classListRemoveHidden(tieText);
    }

    if (gameOver) {
        let gameOverSound = new Audio("./sound/gameOver.mp3");
        gameOverSound.volume = 0.5;
        gameOverSound.play();

        if (!oMoment.classList.contains("hidden")) {
            classListAddHidden(oMoment);
        } else if (!xMoment.classList.contains("hidden")) {
            classListAddHidden(xMoment);
        }

        if (!oTurnColor.classList.contains("hidden")) {
            classListAddHidden(oTurnColor);
        } else if (!xTurnColor.classList.contains("hidden")) {
            classListAddHidden(xTurnColor);
        }
    }
}

const aiThinking = (modificacionesClick) => {
    if (gameOver) return;
    aiIsThinking = true;

    aiTimeoutId = setTimeout(() => {
        let randomIndex = Math.floor(Math.random() * cells.length);
        let attempts = 0;

        do {
            randomIndex = Math.floor(Math.random() * cells.length);
            attempts++;
        } while (
            (cells[randomIndex].classList.contains('x') || cells[randomIndex].classList.contains('o') || cells[randomIndex].classList.contains('b')) && attempts < 50
        );

        modificacionesClick(cells[randomIndex], cells[randomIndex].parentElement);
        playClickSound();
        divCounter++;
        if (gameModeChoosed === "blockChallengeRobot") {
            blockCellRemove();
            blockChallenge();
        }

        checkWinner();
        aiIsThinking = false;
        
    }, 2000); 
};

const aiThinkingStarts = () => {
    aiThinking(modificacionesClickX);
    setTimeout(() => {
        game.xTurn = !game.xTurn;
    }, 2000)
};

const blockChallenge = () => {
    if (divCounter >= 8 || gameOver) return;

    let randomIndex = Math.floor(Math.random() * cells.length);
    let attempts = 0;

    do {
        randomIndex = Math.floor(Math.random() * cells.length);
        attempts++;
    } while (
        (cells[randomIndex].classList.contains('x') || cells[randomIndex].classList.contains('o') || cells[randomIndex].classList.contains('b')) && attempts < 50
    );
    checkWinner();
    blockCellAdd(cells[randomIndex], cells[randomIndex].parentElement);

};

const blockCellAdd = (divClick, divClickDad) => {
    divClick.classList.add('b');
    divClickDad.classList.add('bg-[#F5ECD5]');
    divClickDad.classList.remove('hover:bg-gray-200');
}

const blockCellRemove = () => {
    for (let cell of cells) {
        if (cell.classList.contains("b")) {
            cell.classList.remove("b")
            cell.parentElement.classList.remove('bg-[#F5ECD5]');
            cell.parentElement.classList.add('hover:bg-gray-200');
        }
    }
}

chooseGamemode.addEventListener('change', () => {
    playClickSound();
    gameModeChoosed = chooseGamemode.value;
});

xStart.addEventListener('mouseenter', () => {
    startClassListManipulator(xTurnColor, "remove");
});

xStart.addEventListener('mouseleave', () => {
    startClassListManipulator(xTurnColor, "add");
});

oStart.addEventListener('mouseenter', () => {
    startClassListManipulator(oTurnColor, "remove");
});

oStart.addEventListener('mouseleave', () => {
    startClassListManipulator(oTurnColor, "add");
});

xStart.addEventListener('click', () => {
    playClickSound();
    gameStarted = true;
    xIsStarting = true;

    classListAddHidden(menuStart);

    classListRemoveHidden(allGame);
    classListRemoveHidden(xTurnColor);
    classListRemoveHidden(xMoment);
});

oStart.addEventListener('click', () => {
    playClickSound();
    gameStarted = true;
    xIsStarting = false;

    classListAddHidden(menuStart);
    classListAddHidden(oTurnColor);

    classListRemoveHidden(allGame);
    classListRemoveHidden(xTurnColor);
    classListRemoveHidden(xMoment);

    if (gameModeChoosed === "playerVsRobot" || gameModeChoosed === "blockChallengeRobot") {
        aiThinkingStarts();
    }
});

let tablero = document.getElementById("game");
tablero.addEventListener('click', event => {
    if (gameOver) {
        return;
    }

    const divClick = event.target.querySelector(".cell");
    const divClickDad = divClick.parentElement;

    if (!divClick.classList.contains('x') && !divClick.classList.contains('o') && !divClick.classList.contains('b')) {

        if (gameModeChoosed === "playerVsPlayer") {
            playClickSound();
            divCounter++
            if (game.xTurn === true) {
                modificacionesClickX(divClick, divClickDad);
            } else {
                modificacionesClickO(divClick, divClickDad);
            }
            game.xTurn = !game.xTurn;

        } else if (gameModeChoosed === "playerVsRobot") {

            if (game.xTurn === true && xIsStarting === true) {
                playClickSound();
                divCounter++
                modificacionesClickX(divClick, divClickDad);
                checkWinner();
                if(gameOver) return;
                game.xTurn = !game.xTurn;
                aiThinking(modificacionesClickO);
                setTimeout(() => {
                    game.xTurn = !game.xTurn;
                }, 2000)
            } else if (game.xTurn === false && xIsStarting === false) {
                playClickSound();
                divCounter++
                modificacionesClickO(divClick, divClickDad);
                checkWinner();
                if(gameOver) return;
                game.xTurn = !game.xTurn;
                aiThinking(modificacionesClickX);
                setTimeout(() => {
                    game.xTurn = !game.xTurn;
                }, 2000)
            }

        } else if (gameModeChoosed === "blockChallenge") {
            playClickSound();
            divCounter++
            if (game.xTurn === true) {
                modificacionesClickX(divClick, divClickDad);
                blockCellRemove();
                blockChallenge();

            } else {
                modificacionesClickO(divClick, divClickDad);
                blockCellRemove();
                blockChallenge();
            }
            game.xTurn = !game.xTurn;

        } else if (gameModeChoosed === "blockChallengeRobot") {
            if (game.xTurn === true && xIsStarting === true) {
                playClickSound();
                divCounter++
                modificacionesClickX(divClick, divClickDad);
                checkWinner();
                if(gameOver) return;
                game.xTurn = !game.xTurn;
                blockCellRemove();
                blockChallenge();
                aiThinking(modificacionesClickO);
                setTimeout(() => {
                    game.xTurn = !game.xTurn;
                }, 2000)

            } else if (game.xTurn === false && xIsStarting === false) {
                playClickSound();
                divCounter++
                modificacionesClickO(divClick, divClickDad);
                checkWinner();
                if(gameOver) return;
                game.xTurn = !game.xTurn;
                blockCellRemove();
                blockChallenge();
                aiThinking(modificacionesClickX);
                setTimeout(() => {
                    game.xTurn = !game.xTurn;
                }, 2000)
            }
        }
    }

    checkWinner();

});

document.querySelector('.restart').addEventListener('click', () => {

    gameOver = false;
    
    if (aiIsThinking === false) {
        playClickSound();
        blockCellRemove();

        for (let cell of cells) {
            cell.classList.remove("x");
            cell.classList.remove("o");
            cell.classList.remove("b");
            const cellDad = cell.parentElement;
            cellDad.classList.remove("bg-[#A4B465]", "bg-[#F0BB78]");
            if (!cellDad.classList.contains("hover:bg-gray-200")) {
                cellDad.classList.add("hover:bg-gray-200");
            }
        }

        classListRemoveHidden(menuStart);
        classListAddHidden(allGame);
        classListAddHidden(xTurnColor);
        classListAddHidden(oTurnColor);
        classListAddHidden(xMoment);
        classListAddHidden(oMoment);
        classListAddHidden(xWinText);
        classListAddHidden(oWinText);
        classListAddHidden(tieText);

        mainColor.classList.remove("bg-[#A4B465]", "bg-[#F0BB78]");
        if (!mainColor.classList.contains("bg-[#F5ECD5]")) {
            mainColor.classList.add("bg-[#F5ECD5]");
        }

        xIsStarting = false;
        gameStarted = false;
        game.xTurn = true;
        game.xState = [];
        game.oState = [];
        divCounter = 0;

        if (aiTimeoutId !== null) {
            clearTimeout(aiTimeoutId);
            aiTimeoutId = null;
        }

    } else {
        alert("Wait for the AI move");
    }
});

