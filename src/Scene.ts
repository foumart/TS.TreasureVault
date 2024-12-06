import { Application, Container, ObservablePoint, Sprite } from "pixi.js";
import { AssetManager } from "./AssetManager";

export abstract class Scene extends Container {

    abstract label: string;

    app: Application;
    assetManager: AssetManager;

    screenWidth!: number;
    screenHeight!: number;

    // The background image is resized in a way to fit well in any screen size.
    // Here we define protected boundaries for area that will always be visible.
    // The following values are percentages of the background image width/height.
    // We'll use the background image's scale to set the scale of all other elements.
    minWidth: number = .45;
    minHeight: number = .65;

    constructor(app: Application) {
        super();
        this.app = app;
        this.screenWidth = this.app.screen.width;
        this.screenHeight = this.app.screen.height;
        this.assetManager = AssetManager.getInstance();
        this.init();
    }

    abstract init(): void

    centerElement(element: Sprite) {
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
        this.screenWidth = this.app.screen.width;
        this.screenHeight = this.app.screen.height;
        this.positionElements();
    }

    positionElements(): void {
        
    }

    resizeElement(scale: ObservablePoint, element: Sprite | Container, offsetX: number = 0, offsetY: number = 0) {
        element.scale = scale;
        element.x = this.screenWidth / 2 + offsetX * scale.x;
        element.y = this.screenHeight / 2 + offsetY * scale.y;
    }
}
