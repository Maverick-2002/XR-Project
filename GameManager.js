// GameManager.js
export class GameManager {
    constructor() {
        this.gameOver = false;
        this.startScreen = document.getElementById('start-screen');
        this.endScreen = document.getElementById('end-screen');
        this.startButton = document.getElementById('start-button');
        this.resetButton = document.getElementById('reset-button');

        // Bind the start and reset button events
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());

        // Show the start screen at the beginning
        this.showStartScreen();
    }

    showStartScreen() {
        this.startScreen.style.display = 'flex';
        this.endScreen.style.display = 'none';
    }

    startGame() {
        this.startScreen.style.display = 'none';
        this.endScreen.style.display = 'none';
        this.gameOver = false;

        // Call an external function to actually start the game
        if (typeof this.onStart === 'function') {
            this.onStart(); // Notify when the game should start
        }
    }

    resetGame() {
        this.endScreen.style.display = 'none';
        this.gameOver = false;

        // Call an external function to reset the game
        if (typeof this.onReset === 'function') {
            this.onReset(); // Notify when the game should reset
        }
    }

    showEndScreen() {
        this.endScreen.style.display = 'flex';
        this.gameOver = true;
    }
}
