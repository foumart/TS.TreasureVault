import { Application, Graphics, Texture } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';

// Create a new PIXI application
const app = new Application();
initDevtools({ app });

// test graphics object
const rect = new Graphics();

// Initialize the application with options
(async () => {
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
    });

    // Append the canvas to the DOM
    document.body.appendChild(app.canvas);

    // Add resize event listener
    window.addEventListener('resize', resize);

    // Add a test graphics object to the PIXI application
    app.stage.addChild(rect);

    updateGraphics();
})();

function updateGraphics() {
    rect.clear();
    rect.rect(window.innerWidth / 2 - 50, window.innerHeight / 2 - 50, 100, 100)
        .fill({texture:Texture.WHITE, alpha:0.5, color:0xFF0000})
}

function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    updateGraphics();
};
