let currentGameId = null;
let guessedLettersList = [];

document.addEventListener('DOMContentLoaded', function() {
    const newGameBtn = document.getElementById('new-game-btn');
    const gameInfo = document.getElementById('game-info');
    const wordState = document.getElementById('word-state');
    const statusSpan = document.getElementById('status');
    const incorrectGuesses = document.getElementById('incorrect-guesses');
    const guessesRemaining = document.getElementById('guesses-remaining');
    const guessedLetters = document.getElementById('guessed-letters');
    const guessForm = document.getElementById('guess-form');
    const guessInput = document.getElementById('guess-input');
    const messageDiv = document.getElementById('message');
    newGameBtn.addEventListener('click', startNewGame);

    guessForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const letter = guessInput.value.trim();
        if (letter && currentGameId) {
            makeGuess(letter);
        }
        guessInput.value = '';
    });

    function renderGuessedLetters(word) {
        guessedLetters.innerHTML = guessedLettersList.map(letter => {
            if (word.toUpperCase().includes(letter)) {
                return `<span style="color: green;">${letter}</span>`;
            } else {
                return `<span style="color: red;">${letter}</span>`;
            }
        }).join(' ');
    }

    function startNewGame() {
        guessedLettersList = [];
        guessedLetters.innerHTML = '';
        fetch('/game/new', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                currentGameId = data.game_id;
                loadGameState();
            });
    }

    function loadGameState() {
        fetch(`/game/${currentGameId}`)
            .then(response => response.json())
            .then(data => {
                gameInfo.style.display = '';
                wordState.textContent = data.word_state;
                statusSpan.textContent = data.status;
                incorrectGuesses.textContent = data.incorrect_guesses;
                guessesRemaining.textContent = data.incorrect_guesses_remaining;
                renderGuessedLetters(data.word_state);
                messageDiv.style.display = 'none';
                if (data.status !== 'InProgress') {
                    guessInput.disabled = true;
                } else {
                    guessInput.disabled = false;
                }
            });
    }

    function makeGuess(letter) {
        letter = letter.toUpperCase();
        if (!guessedLettersList.includes(letter)) {
            guessedLettersList.push(letter);
        }
        fetch(`/game/${currentGameId}/guess`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ letter: letter })
        })
        .then(response => response.json())
        .then(data => {
            wordState.textContent = data.word_state;
            statusSpan.textContent = data.status;
            statusSpan.style.color = data.status === 'Won' ? 'green' : data.status === 'Lost' ? 'red' : 'black';
            incorrectGuesses.textContent = data.incorrect_guesses;
            guessesRemaining.textContent = data.incorrect_guesses_remaining;
            messageDiv.textContent = data.message;
            messageDiv.style.display = '';
            renderGuessedLetters(data.word_state);
            if (data.status === 'Won') {
                const confettiConfigObj = {
                    colorsArray: ["rgba(255, 180, 185, 1)", "rgba(255, 220, 185, 1)", "rgba(255, 255, 185, 1)", "rgba(185, 255, 200, 1)", "rgba(185, 225, 255, 1)", "rgba(215, 185, 255, 1)"],
                    velocity: 0.025,
                    quantity: 750,
                    minSize: 4,
                    maxSize: 12,
                    minOpacity: 1,
                    maxOpacity: 1,
                    infiniteLoop: false
                };
                if (typeof generateConfetti === 'function') {
                    generateConfetti(confettiConfigObj, "vanillaConfettiCanvas");
                }
            }
            if (data.status !== 'InProgress') {
                guessInput.disabled = true;
            }
        });
    }
}); 