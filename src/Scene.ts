import { Application, Container, ObservablePoint, Sprite } from "pixi.js";
import { AssetManager } from "./AssetManager";

export abstract class Scene extends Container {

    abstract label: string;

    app: Application;
    assetManager: AssetManager;

    screenWidth!: number;
    screenHeight!: number;

    /**
     * Defining a protected boundaries area that will always be visible, no matter the screen size.
     * The following values are percentages of the main centered element (the background) width/height.
     */
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

    /**
    * Centers a PIXI.Sprite element on the screen, scaling it to fit within the screen dimensions.
    * Useful for setting the scale and position of background images.
    * 
    * @param {PIXI.Sprite} element - The sprite to be centered and scaled.
    */
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

    /**
    * Resizes and repositions a PIXI.Sprite or PIXI.Container element based on a given scale and optional offsets.
    * The first argument is usually the scale of an already resized background via centerElement()
    * 
    * @param {PIXI.ObservablePoint} scale - The scale to apply to the element.
    * @param {PIXI.Sprite | PIXI.Container} element - The element to be resized and repositioned.
    * @param {number} [offsetX=0] - Optional horizontal offset.
    * @param {number} [offsetY=0] - Optional vertical offset.
    */
    resizeElement(scale: ObservablePoint, element: Sprite | Container, offsetX: number = 0, offsetY: number = 0) {
        element.scale = scale;
        element.x = this.screenWidth / 2 + offsetX * scale.x;
        element.y = this.screenHeight / 2 + offsetY * scale.y;
    }
}
