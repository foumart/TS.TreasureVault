import { Application, Container, ObservablePoint, Sprite, FederatedPointerEvent, PointData } from "pixi.js";

import { Scene } from "./Scene";
import { AssetManager } from "./AssetManager";
import { Handle, StepsEvent } from "./Handle";
import { CodeGenerator, Rotation, Steps } from "./CodeGenerator";

export class GameScene extends Scene {
    
    label: string = "GameScene";

    codeGenerator!: CodeGenerator;

    bgr!: Sprite;
    door!: Sprite;
    handle!: Handle;
    handleShadow!: Sprite;

    // if the handle is currently being dragged
    dragging: Boolean = false;

    init() {
        this.codeGenerator = new CodeGenerator();

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

        this.beginNewGameWithSpin();
    }

    async beginNewGameWithSpin() {
        await this.handle.spinLikeCrazy()
        this.beginNewGame();
    };

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
                this.beginNewGameWithSpin();
            } else if (this.dragging) {
                console.log(`Entry ${this.codeGenerator.currentCombo.length + 1}`);
            }
        }
    }

    openVault() {
        this.emit('gameComplete');
    }

    /* Handle Interaction */
    onDragStart(event: FederatedPointerEvent) {
        event.stopPropagation();
        // Make sure the handle is at rest (not "crazy spinning" or adjusting to 60 degrees rounded multiple)
        if (!this.handle.animating) {
            this.dragging = true;
            // Listen for dragging outside the handle area so the interaction could be more convenient
            this.bgr.on("pointermove", this.onDragMove.bind(this));

            this.handle.setStartRotation(this.getAngleInRadians(event.global));

            // Begin new secret code entry
            if (!this.handle.currentSteps) {
                console.log(`Entry ${this.codeGenerator.currentCombo.length + 1}`);
                this.handle.resetCurrentSteps();
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

    positionElements() {
        this.centerElement(this.bgr);
        this.resizeElement(this.bgr.scale, this.door, 30, -22);
        this.resizeElement(this.bgr.scale, this.handle, -18, -24);
    }
}
