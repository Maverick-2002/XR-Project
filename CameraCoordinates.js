// CameraCoordinates.js
export class CameraCoordinates {
    constructor(camera) {
      this.camera = camera;
  
      // Create an HTML element to display the coordinates
      this.coordinatesDisplay = document.createElement('div');
      this.coordinatesDisplay.style.position = 'absolute';
      this.coordinatesDisplay.style.top = '10px';
      this.coordinatesDisplay.style.left = '10px';
      this.coordinatesDisplay.style.color = '#ffffff';
      this.coordinatesDisplay.style.fontSize = '20px';
      document.body.appendChild(this.coordinatesDisplay);
    }
  
    update() {
      // Get the camera's position
      const { x, y, z } = this.camera.position;
  
      // Update the display with the camera coordinates
      this.coordinatesDisplay.innerHTML = `Camera Position: X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`;
    }
  }
  