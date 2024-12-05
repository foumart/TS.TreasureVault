import { Application, Container, ObservablePoint, Sprite, FederatedPointerEvent, PointData } from "pixi.js";

import { Scene } from "./Scene";
import { AssetManager } from "./AssetManager";
import { Handle, StepsEvent } from "./Handle";
import { CodeGenerator, Rotation, Steps } from "./CodeGenerator";

export class GameScene extends Scene {
    
    label: string = "GameScene";

    assetManager!: AssetManager;

    app: Application;
    codeGenerator: CodeGenerator;

    bgr!: Sprite;
    door!: Sprite;
    doorOpen!: Sprite;
    doorOpenShadow!: Sprite;
    handle!: Handle;
    handleShadow!: Sprite;

    screenWidth!: number;
    screenHeight!: number;

    // The background image is resized in a way to fit well in any screen size.
    // Here we define protected boundaries for area that will always be visible.
    // The following values are percentages of the background image width/height.
    // We'll use the background image's scale to set the scale of all other elements.
    minWidth: number = .45;
    minHeight: number = .65;

    // if the handle is currently being dragged
    dragging: Boolean = false;

    constructor(app: Application) {
        super();
        this.app = app;
        this.codeGenerator = new CodeGenerator();
        this.init();
    }

    init() {
        this.bgr = new Sprite(this.assetManager.getTexture("bg"));
        this.bgr.anchor.set(0.5);
        this.bgr.interactive = true;
        this.addChild(this.bgr);

        this.door = new Sprite(this.assetManager.getTexture("door"));
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
            .on("pointermove", this.onDragMove.bind(this))
            .on('sendSteps', this.onSentStepsEvent.bind(this));

        this.positionElements();

        this.beginNewGame();
    }

    beginNewGame() {
        this.codeGenerator.generateCode();
        this.handle.currentSteps = 0;
    }

    enterPlayerSecretCode(currentDirection: Rotation, currentSteps: number) {
        this.codeGenerator.currentCombo.push([currentDirection, Math.abs(currentSteps) as Steps]);
        this.checkSecretCode();
    }

    checkSecretCode() {
        if (this.codeGenerator.isSecretComboMatching() && !this.dragging) {
            // Code is correct!
            this.removeHandleInteractions();
            this.openVault();
        } else {
            if (this.codeGenerator.areComboEntriesExceeding()) {
                // Code is incorrect! Begin countdown to self destruction... :)
                this.removeHandleInteractions();
                this.handle.spinLikeCrazy()
                    .then(()=>{
                        this.beginNewGame();
                    });
            } else if (this.dragging) {
                console.log(`Entry ${this.codeGenerator.currentCombo.length + 1}`);
            }
        }
    }

    openVault() {
        console.log("GG");
    }

    /* Handle Interaction */
    onDragStart(event: FederatedPointerEvent) {
        event.stopPropagation();
        // Make sure the handle is at rest (not "crazy spinning" or adjusting to 60 degrees rounded multiple)
        if (!this.handle.animating) {
            this.dragging = true;
            // Listen for dragging outside the handle area so the interaction could be more convenient
            this.bgr.on("pointermove", this.onDragMove.bind(this));

            // Begin new secret code entry
            if (!this.handle.currentSteps) {
                this.handle.setStartRotation(this.getAngleInRadians(event.global));
                console.log(`Entry ${this.codeGenerator.currentCombo.length + 1}`);
            }
        }
    }
        
    async onDragEnd(event: FederatedPointerEvent) {
        event.stopPropagation();
        if (this.dragging) {
            this.removeHandleInteractions();
            await this.handle.endRotation();
            // allow a timeout for player to continue rotating in the same direction
            await this.handle.delay(0.5);
            // Ensure player hasn't interacted with the handle in the meantime
            if (!this.dragging && !this.handle.animating) {
                // Check if Player is entering the last secret code entry
                if (this.codeGenerator.areComboEntriesEnough()) {
                    this.enterPlayerSecretCode(this.handle.currentDirection, this.handle.currentSteps);
                }
            }
        }
    }
        
    onDragMove(event: FederatedPointerEvent) {
        event.stopPropagation();
        if (this.dragging) {
            this.handle.setRotation(this.getAngleInRadians(event.global));
        }
    }

    onSentStepsEvent(event: StepsEvent) {
        this.enterPlayerSecretCode(event.direction, event.steps);
    }

    removeHandleInteractions() {
        this.dragging = false;
        this.bgr.off("pointermove", this.onDragMove.bind(this));
    }

    getAngleInRadians(global: PointData) {
        const position = this.handle.parent.toLocal(global);
        return Math.atan2(position.y - this.handle.y, position.x - this.handle.x);
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
