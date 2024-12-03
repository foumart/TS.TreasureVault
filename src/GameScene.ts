import { Application, Sprite } from "pixi.js";

import Scene from "./Scene";
import { getTexture } from "./assetLoader";

class GameScene extends Scene {
    
    label: string = "GameScene";

    app: Application;

    bgr!: Sprite;

    // Define protected boundaries inside the scene to always be visible
    minWidth: number = .5;
    minHeight: number = .75;

    constructor(app: Application) {
        super();
        this.app = app;
        this.init();
    }

    init() {
        this.bgr = new Sprite(getTexture("bg"));
        this.bgr.anchor.set(0.5);
    
        this.addChild(this.bgr);
        this.positionElements();
    }

    positionElements() {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;
        const textureWidth = this.bgr.texture.width;
        const textureHeight = this.bgr.texture.height;

        const scaleX = screenWidth / textureWidth;
        const scaleY = screenHeight / textureHeight;
        let scale = Math.max(scaleX, scaleY);

        if (textureWidth * scale * this.minWidth > screenWidth) {
            scale = screenWidth / (textureWidth * this.minWidth);
        }

        if (textureHeight * scale * this.minHeight > screenHeight) {
            scale = screenHeight / (textureHeight * this.minHeight);
        }

        this.bgr.width = textureWidth * scale;
        this.bgr.height = textureHeight * scale;

        this.bgr.x = screenWidth / 2;
        this.bgr.y = screenHeight / 2;
    }

    resize() {
        this.positionElements();
    }
}

export default GameScene;