import { Application, Graphics, Texture } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';

// Create a new PIXI application
const app = new Application();
initDevtools({ app });

// Initialize the application with options
(async () => {
    await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
    });

    // Append the canvas to the DOM
    document.body.appendChild(app.canvas);
    
    const rect = new Graphics()
        .rect(0, 0, 100, 100)
        .fill({texture:Texture.WHITE, alpha:0.5, color:0xFF0000})
        .rect(100, 0, 100, 100)
        .fill({color:0xFFFF00, alpha:0.5});

    // Add the graphics object to the PIXI application
    app.stage.addChild(rect);
})();
