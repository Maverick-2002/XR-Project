export class GameManager {
    constructor() {
        this.gameOver = false;
        this.startScreen = document.getElementById('start-screen');
        this.endScreen = document.getElementById('end-screen');
        this.startButton = document.getElementById('start-button');
        this.resetButton = document.getElementById('reset-button');
        this.bgMusic = new Audio('desert-bells-158703.mp3'); // Path to your background music

        // Ensure the audio doesn't auto-play on page load
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;

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

        // Play the background music when the game starts
        this.bgMusic.play()

        // Call an external function to actually start the game
        if (typeof this.onStart === 'function') {
            this.onStart(); // Notify when the game should start
        }
    }
}
