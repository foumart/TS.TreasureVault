import { Application, Container, ObservablePoint, Sprite, FederatedPointerEvent, PointData } from "pixi.js";

import Scene from "./Scene";
import { getTexture } from "./assetLoader";
import Handle from "./Handle";
import { generateCode, secretCombo } from "./vault";

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

    // The background image is resized in a way to fit well in any screen size.
    // Here we define protected boundaries and for area that will always be visible.
    // The following values are percentages of the background image width/height.
    // We'll use the background image's scale to set the scale of all other elements.
    minWidth: number = .45;
    minHeight: number = .65;

    dragging: Boolean = false;

    constructor(app: Application) {
        super();
        this.app = app;
        this.init();
    }

    init() {
        this.bgr = new Sprite(getTexture("bg"));
        this.bgr.anchor.set(0.5);
        this.bgr.interactive = true;
        this.addChild(this.bgr);

        this.door = new Sprite(getTexture("door"));
        this.door.anchor.set(0.5);
        this.addChild(this.door);

        this.handle = new Handle();
        this.addChild(this.handle);
        this.handle.interactive = true;
        this.handle.cursor = 'pointer';
        this.handle
            .on("pointerdown", this.onDragStart.bind(this))
            .on("pointerup", this.onDragEnd.bind(this))
            .on("pointerupoutside", this.onDragEnd.bind(this))
            .on("pointermove", this.onDragMove.bind(this));

        this.positionElements();

        this.beginNewGame();
    }

    beginNewGame() {
        //currentCombos = [];
        generateCode();
    }

    /* Handle Interaction */
    onDragStart(event: FederatedPointerEvent) {
        event.stopPropagation();
        // make sure the handle is at rest (not crazy spinning or adjusting to 60 degrees rounded multiple)
        if (!this.handle.animating) {
            this.dragging = true;
            this.handle.setStartRotation(this.getAngle(event.global))
            // listen for dragging outside the handle area so the interaction could be more convenient
            this.bgr.on("pointermove", this.onDragMove.bind(this));
        }
    }
        
    onDragEnd(event: FederatedPointerEvent) {
        event.stopPropagation();
        if (this.dragging) {
            this.dragging = false;
            this.bgr.off("pointermove", this.onDragMove.bind(this));
            this.handle.endRotation();
        }
    }
        
    onDragMove(event: FederatedPointerEvent) {
        event.stopPropagation();
        if (this.dragging) {
            this.handle.rotate(this.getAngle(event.global));
        }
    }

    getAngle(global: PointData) {
        const position = this.handle.parent.toLocal(global);
        return Math.atan2(position.y - this.handle.y, position.x - this.handle.x)
    }

    /* Element positioning */
    resize() {
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
}

export default GameScene;