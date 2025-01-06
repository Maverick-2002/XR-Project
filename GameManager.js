export class GameManager {
    constructor() {
        this.gameOver = false;
        this.startScreen = document.getElementById('start-screen');
        this.endScreen = document.getElementById('end-screen');
        this.startButton = document.getElementById('start-button');
        this.resetButton = document.getElementById('reset-button');
        this.bgMusic = new Audio('desert-bells-158703.mp3'); 

        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;

        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());

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
        this.bgMusic.play()

        if (typeof this.onStart === 'function') {
            this.onStart(); 
        }
    }
}
