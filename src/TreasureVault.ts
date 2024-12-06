import { Application, ContainerChild } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';
import { AssetManager } from './AssetManager';
import { LoadingScene } from './LoadingScene';
import { GameScene } from './GameScene';
import { VaultScene } from './VaultScene';
import { Scene } from './Scene';

class TreasureVault {
    app: Application;
    assetManager: AssetManager;
    loadingScene!: LoadingScene;
    gameScene!: GameScene;
    vaultScene!: VaultScene;

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

        this.loadingScene = new LoadingScene(this.app);
        this.app.stage.addChild(this.loadingScene);

        await this.assetManager.preloadAssets();

        await this.loadingScene.waitForInteraction();

        this.beginGame();
    }

    beginGame() {
        this.app.stage.removeChild(this.loadingScene);

        this.gameScene = new GameScene(this.app);
        this.app.stage.addChild(this.gameScene);

        this.gameScene.on("gameComplete", this.gameComplete.bind(this));
    }

    gameComplete() {
        const handleRotation = this.gameScene.handle.handleSprite.rotation;
        this.app.stage.removeChild(this.gameScene);
        this.vaultScene = new VaultScene(this.app);
        this.app.stage.addChild(this.vaultScene);
        // Matching handle rotation wouldn't have been necessary
        // if the handle asset's design was perfectly simmetrical.
        // Handle wheel arms are not evenly spread at 60 degrees each..
        this.vaultScene.handle.handleSprite.rotation = handleRotation;
        this.vaultScene.handle.handleShadow.rotation = handleRotation;

        this.vaultScene.on("restartGame", this.restartGame.bind(this));
    }

    restartGame() {
        this.app.stage.removeChild(this.vaultScene);
        this.app.stage.addChild(this.gameScene);
        this.gameScene.beginNewGameWithSpin();
    }

    /**
    * Handles the window resize event.
    * @param {UIEvent} event - The resize event triggered by the window.
    */
    resize(event: UIEvent) {
        const target = event.target as Window;
        this.app.renderer.resize(target.innerWidth, target.innerHeight);

        // We don't add to stage anything other than Scenes, so this is safe.
        this.app.stage.children.forEach((scene: ContainerChild) => (scene as Scene).resize());
    }
}

// Instantiate to start the application
new TreasureVault();
