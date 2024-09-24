export class TimerUI {
    constructor(elementId) {
      this.timerElement = document.getElementById(elementId);
      this.intervalId = null;
    }
  
    startTimer(duration, callback) {
      let timeRemaining = duration;
      this.updateDisplay(timeRemaining);
  
      this.intervalId = setInterval(() => {
        timeRemaining--;
        this.updateDisplay(timeRemaining);
  
        if (timeRemaining <= 0) {
          clearInterval(this.intervalId);
          callback(); // Call the callback when time's up
        }
      }, 1000);
    }
  
    updateDisplay(time) {
      this.timerElement.textContent = `Time remaining: ${time} seconds`;
    }
  }
  