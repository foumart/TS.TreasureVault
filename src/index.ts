import { Application } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';
import { preloadAssets } from './assetLoader';
import LoadingScene from './LoadingScene';
import GameScene from './GameScene';

// Create a new PIXI application
const app = new Application();
initDevtools({ app });

let loadingScene: LoadingScene;
let gameScene: GameScene;

// Initialize the application with options
(async () => {
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x7fbaa6,
        eventMode: 'passive',
        eventFeatures: {
            globalMove: false
        }
    });

    // Append the canvas to the DOM
    document.body.appendChild(app.canvas);

    // Add resize event listener
    window.addEventListener('resize', resize);

    // Add loading scene and wait for the assets to load
    loadingScene = new LoadingScene();
    app.stage.addChild(loadingScene);

    await preloadAssets();

    // Once loaded, remove the loading scene and add the game scene
    app.stage.removeChild(loadingScene);

    gameScene = new GameScene(app);
    app.stage.addChild(gameScene);

})();

/**
* Handles the window resize event.
* @param {UIEvent} event - The resize event triggered by the window.
*/
function resize(event: UIEvent) {
    const target = event.target as Window;
    app.renderer.resize(target.innerWidth, target.innerHeight);
    gameScene.resize();
};
