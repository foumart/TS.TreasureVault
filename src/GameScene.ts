import { Application, Container, ObservablePoint, Sprite } from "pixi.js";

import Scene from "./Scene";
import { getTexture } from "./assetLoader";
import Handle from "./Handle";

class GameScene extends Scene {
    
    label: string = "GameScene";

    app: Application;
    screenWidth!: number;
    screenHeight!: number;

    bgr!: Sprite;
    door!: Sprite;
    doorOpen!: Sprite;
    doorOpenShadow!: Sprite;
    handle!: Handle;
    handleShadow!: Sprite;

    // Define protected boundaries inside the scene to always be visible
    minWidth: number = .45;
    minHeight: number = .65;

    constructor(app: Application) {
        super();
        this.app = app;
        this.init();
    }

    init() {
        this.bgr = new Sprite(getTexture("bg"));
        this.bgr.anchor.set(0.5);
        this.addChild(this.bgr);

        this.door = new Sprite(getTexture("door"));
        this.door.anchor.set(0.5);
        this.addChild(this.door);

        this.handle = new Handle();
        this.addChild(this.handle);

        this.positionElements();
    }

    positionElements() {
        this.centerElement(this.bgr);
        this.resizeElement(this.bgr.scale, this.door, 30, -22);
        this.resizeElement(this.bgr.scale, this.handle, -18, -24);
    }

    resizeElement(scale: ObservablePoint, element: Sprite | Container, offsetX: number = 0, offsetY: number = 0) {
        element.scale = scale;
        element.x = this.screenWidth / 2 + offsetX * scale.x;
        element.y = this.screenHeight / 2 + offsetY * scale.y;
    }

    centerElement(element: Sprite) {
        this.screenWidth = this.app.screen.width;
        this.screenHeight = this.app.screen.height;
        const textureWidth = element.texture.width;
        const textureHeight = element.texture.height;

        const scaleX = this.screenWidth / textureWidth;
        const scaleY = this.screenHeight / textureHeight;
        let scale = Math.max(scaleX, scaleY);

        if (textureWidth * scale * this.minWidth > this.screenWidth) {
            scale = this.screenWidth / (textureWidth * this.minWidth);
        }

        if (textureHeight * scale * this.minHeight > this.screenHeight) {
            scale = this.screenHeight / (textureHeight * this.minHeight);
        }

        element.width = textureWidth * scale;
        element.height = textureHeight * scale;

        element.x = this.screenWidth / 2;
        element.y = this.screenHeight / 2;
    }

    resize() {
        this.positionElements();
    }
}

export default GameScene;