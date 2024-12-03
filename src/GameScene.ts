import { Application, Sprite } from "pixi.js";

import Scene from "./scene";
import { getTexture } from "./assetLoader";

class GameScene extends Scene {
    
    label: string = "GameScene";

    app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
        this.init();
    }

    init() {
        const sprite = new Sprite(getTexture("bg"));
    
        sprite.anchor.set(0.5);
    
        sprite.x = this.app.screen.width / 2;
        sprite.y = this.app.screen.height / 2;
    
        this.addChild(sprite);
    }
}

export default GameScene;