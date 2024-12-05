import { Container } from "pixi.js";
import { AssetManager } from "./AssetManager";

export abstract class Scene extends Container {

    abstract label: string;

    assetManager: AssetManager;

    constructor() {
        super();
        this.assetManager = AssetManager.getInstance();
    }

    abstract init(): void
}
