'user stirct'
// players 
const player_2 = document.querySelector('.player-2')
const player_1 = document.querySelector('.player-1')
    // totat score 
const value_1 = document.querySelector('.value-1')
const value_2 = document.querySelector('.value-2')
    // current score 
const current_1 = document.querySelector('.current-value-1')
const current_2 = document.querySelector('.current-value-2')
    // buttons 
const rollBtn = document.querySelector('.roll-btn')
const holdBtn = document.querySelector('.hold-btn')
const restartBtn = document.querySelector('.restart-btn')
    // the die image
const img = document.querySelector('.img')

function clearInputs() {
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            input.value = '';
        })
    })
}
clearInputs();
// initial values
let score, current, playing, activePlayer, finishScore = 100;

const initialize = function(playerNow = 1) {
    score = ['none', 0, 0];
    current = 0;

    current_1.textContent = 0;
    current_2.textContent = 0;
    value_1.textContent = 0;
    value_2.textContent = 0;

    activePlayer = playerNow;
    player_1.classList.remove('active')
    player_2.classList.remove('active')
    document.querySelector(`.player-${playerNow}`).classList.add('active');
    playing = true;
    img.classList.add('hidden')
    document.querySelectorAll('.disabled').forEach(btn => {
        btn.removeAttribute('disabled', '')
    });
}
initialize();

const switchPlayer = function(die) {
    activePlayer = activePlayer == 1 ? (2) : (1);
    current_1.textContent = 0;
    current_2.textContent = 0;
    player_1.classList.toggle('active')
    player_2.classList.toggle('active')
    if (1 !== die)
        img.textContent = '_';
}
rollBtn.addEventListener('click', function() {
    if (playing) {
        let die = Math.trunc(Math.random() * 6) + 1;
        img.classList.remove('hidden')
        img.textContent = die;
        if (die !== 1) {
            current += die;
            document.querySelector(`.current-value-${activePlayer}`).textContent = current;

        } else {
            // switch player
            current = 0;
            switchPlayer(die)
        }

    }
});

holdBtn.addEventListener('click', function() {
    if (playing) {
        score[activePlayer] += current;
        current = 0;
        document.querySelector(`.value-${activePlayer}`).textContent = score[activePlayer];
        if (score[activePlayer] >= getfinishScore()) {
            // game end
            playing = false;
            document.querySelector(`.player-${activePlayer}`).classList.add('won-color')
            document.querySelector(`.won-${activePlayer}`).classList.add('wonShow');
            document.querySelector(`.won`).classList.add('visble')
            img.classList.add('hidden')
            img.textContent = 0;
            document.querySelectorAll('.disabled').forEach(btn => {
                btn.setAttribute('disabled', '')
            });

            formatHistory(activePlayer);

        } else
            switchPlayer()
    }

});

function formatHistory(activePlayer) {
    const looserId = activePlayer == 1 ? 2 : 1;
    const winner = document.querySelector(`.player-name-${activePlayer}`).textContent;
    const looser = document.querySelector(`.player-name-${looserId}`).textContent;
    const winTime = new Date();
    saveHistory(winner, looser, winTime);



}
const restart = function() {
    player_1.classList.remove('won-color');
    player_2.classList.remove('won-color');
    img.classList.add('hidden');
    document.querySelector(`.won-${activePlayer}`).classList.remove('wonShow');
    initialize(activePlayer)

};
restartBtn.addEventListener('click', restart)

//  menu  options 

document.querySelector('.menu-btn').addEventListener('click', function() {
    // selections.
    const menuBtns = document.querySelectorAll('.btn-menu');
    const menuContents = document.querySelectorAll('.menu-content-div');
    const btnSetPlayer = document.querySelector('.btn-set-player');
    const btnSetScore = document.querySelector('.btn-set-score');
    const btnHistory = document.querySelector('.btn-history');
    const btnHelp = document.querySelector('.btn-help');
    const menu = document.querySelector('.menu');
    // making menu visible
    menu.classList.toggle('unhide');
    if (menu.classList.contains('unhide')) {

        menuBtns.forEach(btn => btn.classList.remove('active-menu-btn'));

        menuContents.forEach(content => content.classList.remove('active-menu-content'));
        menuContents.forEach(content => content.classList.remove('active-menu-content-flex'));
    }
    // event for meny buttons
    btnSetPlayer.addEventListener('click', function() {
        //  neede variables
        let player_one = document.querySelector('.player-name-1');
        let input_one = document.querySelector('.player-1-input');
        let player_two = document.querySelector('.player-name-2');
        let input_two = document.querySelector('.player-2-input');
        let currentContent = document.querySelector('.setPlayers');
        let dataNo = btnSetPlayer.dataset.btn;
        // intitial values 
        input_one.value = player_one.textContent.trimStart();
        input_two.value = player_two.textContent.trimStart();
        checkOthers(dataNo)

        function setted() {
            player_one.textContent = input_one.value || player_one.textContent;

            player_two.textContent = input_two.value || player_two.textContent;
            restart();
        }
        currentContent.querySelector('.set').addEventListener('click', setted);
    });
    /**   ------------- setting score --------- */
    btnSetScore.addEventListener('click', function() {
        //  need variables
        let input_score = document.querySelector('.score-input');
        const currentContent = document.querySelector('.setScore');
        let dataNo = btnSetScore.dataset.btn;

        // intitial values 
        input_score.value = getfinishScore();
        checkOthers(dataNo)

        // making form visible

        function setted() {
            finishScore = input_score.value || finishScore
            changefinishScore(finishScore);
            restart();
        }
        currentContent.querySelector('.set').addEventListener('click', setted);
    });
    btnHistory.addEventListener('click', function() {
        // getting data set number
        let dataNo = btnHistory.dataset.btn;
        displayHistory();
        clearBtn = document.querySelector('.btn-clear-history');

        clearBtn.addEventListener('click', function() {

            const file = getFile();
            console.log(file.gameHistory.historys.length);
            file.gameHistory.historys = [];
            console.log(file.gameHistory.historys);
            saveFile(file);
            displayHistory()
        });

        // making form visible
        checkOthers(dataNo)

    });

    function checkOthers(tabNo) {
        menuBtns.forEach(btn => btn.classList.remove('active-menu-btn'));

        menuContents.forEach(content => content.classList.remove('active-menu-content'));
        menuContents.forEach(content => content.classList.remove('active-menu-content-flex'));

        document.querySelector(`.btn-menu-${tabNo}`).classList.add('active-menu-btn');

        if (tabNo == 3)
            document.querySelector(`.menu-content-div-${tabNo}`).classList.add('active-menu-content-flex');
        else
            document.querySelector(`.menu-content-div-${tabNo}`).classList.add('active-menu-content');
    }
    btnHelp.addEventListener('click', function() {
        let dataNo = btnHelp.dataset.btn;
        checkOthers(dataNo)
            // console.log(dataNo)

    })


});
/**  functionalities  */
const savedFile = {
    gameHistory: {
        historys: [],
    },
    finishScore: 100,
};

function saveHistory(winnerP, looserP, timeP) {
    const gameEnd = {
        winner: winnerP,
        looser: looserP,
        time: timeP.toISOString(),
    };
    const file = getFile();
    file.gameHistory.historys.push(gameEnd);
    saveFile(file);
}

function changefinishScore(score) {
    const file = getFile();
    file.finishScore = score;
    saveFile(file);
}
const gameHistory = document.querySelector('.game-history');

function displayHistory() {
    const file = getFile();
    const historys = file.gameHistory.historys;
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'clear history';
    clearBtn.classList.add('btn', 'btn-menu', 'btn-clear-history', );
    if (historys.length === 0) {

        gameHistory.innerHTML = `<h1> no history saved yet 😔`;
    } else {
        gameHistory.innerHTML = ``;
        clearBtn.classList.add('visible');
        historys.forEach(history => renderHistory(history))
    }
    gameHistory.append(clearBtn);

}

function renderHistory(history) {
    const { winner, looser, time } = history;
    // creating element for each history.
    const historyElement = document.createElement('div');

    historyElement.classList.add('history');

    // creating history content.
    const historyContent =
        `<div class="win">
            <span class="winner player">
              ${winner}
            </span> won
            <span class="looser player">
             ${looser}
            </span>
        </div>

        <div class="win-time">  ${formatTime(time)} </div>
        `;
    historyElement.innerHTML = historyContent;

    gameHistory.append(historyElement);

}

function formatTime(time) {

    const timeFormated = Intl.DateTimeFormat('en-Us', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',

    }).format(new Date(time));
    return timeFormated;
}

function saveFile(file) {
    localStorage.clear();
    localStorage.setItem('saved', JSON.stringify(file));
}

function getFile() {
    let file = localStorage.getItem('saved');
    if (file)
        file = JSON.parse(file);
    else
        file = savedFile;
    return file;

}

function getfinishScore() {
    return getFile().finishScore;

}