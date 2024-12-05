import { Application } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';
import { AssetManager } from './AssetManager';
import { LoadingScene } from './LoadingScene';
import { GameScene } from './GameScene';

class TreasureVault {
    app: Application;
    assetManager: AssetManager;
    loadingScene!: LoadingScene;
    gameScene!: GameScene;

    constructor() {
        this.app = new Application();
        initDevtools({ app: this.app });

        this.assetManager = AssetManager.getInstance();

        this.initialize();
    }

    async initialize() {
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x7fbaa6,
            eventMode: 'passive',
            eventFeatures: {
                globalMove: false
            }
        });

        document.body.appendChild(this.app.canvas);

        window.addEventListener('resize', this.resize.bind(this));

        this.loadingScene = new LoadingScene();
        this.app.stage.addChild(this.loadingScene);

        await this.assetManager.preloadAssets();

        this.app.stage.removeChild(this.loadingScene);

        this.gameScene = new GameScene(this.app);
        this.app.stage.addChild(this.gameScene);
    }

    /**
    * Handles the window resize event.
    * @param {UIEvent} event - The resize event triggered by the window.
    */
    resize(event: UIEvent) {
        const target = event.target as Window;
        this.app.renderer.resize(target.innerWidth, target.innerHeight);
        this.gameScene.resize();
    }
}

// Instantiate to start the application
new TreasureVault();
