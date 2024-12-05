import { Container, Graphics, Sprite } from "pixi.js";
import { AssetManager } from "./AssetManager";

import { gsap } from "gsap";
import { Rotation } from "./CodeGenerator";

export interface StepsEvent {
    direction: Rotation;
    steps: number;
}

export class Handle extends Container {

    assetManager: AssetManager;

    // Handle and its drop-shadow with additional masked static part to preserve the point of light
    handle: Sprite;
    handleShadow: Sprite;
    staticHandle: Sprite;
    staticHandleMask: Graphics;

    // Used to prevent dragging while the handle is animating
    animating: boolean = false;

    // Variables used for general handle 360 degrees drag rotation
    initialDragRadians: number = 0;
    initialHandleRadians: number = 0;

    // When dragging begins or after every 60 degrees step, this is set to the current handle rotation,
    // so steps could be properly accumulated beyond 6 (because of 0-360 degree boundary)
    currentStepRadians: number = 0;
    
    // Accumulate steps for CW/CCW rotation on the handle (positive value: CW, negative value: CCW)
    currentSteps: number = 0;
    
    // Define the current rotation direction so multiple code entries could be handled with a single drag.
    currentDirection: Rotation = Rotation.STILL;

    constructor() {
        super();

        this.assetManager = AssetManager.getInstance();

        this.handleShadow = new Sprite(this.assetManager.getTexture("handleShadow"));
        this.handleShadow.anchor.set(0.5);
        this.addChild(this.handleShadow);
        this.handleShadow.position.x = 10;
        this.handleShadow.position.y = 15;

        this.handle = new Sprite(this.assetManager.getTexture("handle"));
        this.handle.anchor.set(0.5);
        this.addChild(this.handle);

        // Add some masked static part to preserve the point of light for added realism
        this.staticHandle = new Sprite(this.assetManager.getTexture("handle"));
        this.staticHandle.anchor.set(0.5);
        this.addChild(this.staticHandle);

        this.staticHandleMask = new Graphics()
            .circle(0, 0, 126.5)
            .fill({color:0xFFFFFF})
            .circle(0, 0, 98)
            .cut()
            .circle(0, 0, 38)
            .fill({color:0xFFFFFF})

        this.addChild(this.staticHandleMask);
        this.staticHandle.mask = this.staticHandleMask;

        this.spinLikeCrazy();
    }

    async spinLikeCrazy() {
        await this.animateRotation(this.radiansToDegrees(this.handle.rotation) + 720, 1.5);
        this.setRotation(0);
    }

    async animateRotation(degrees: number, duration?: number): Promise<void> {
        if (this.animating) {
            console.warn("Unexpected animateRotation call while still animating!");
        }

        this.animating = true;
        return new Promise((resolve) => {
            gsap.to([this.handle, this.handleShadow], {
                angle: degrees,
                duration: duration || 1,
                onComplete: () => {
                    this.animating = false;
                    resolve();
                }
            });
         });
    }

    setStartRotation(initialDragRadians: number) {
        this.initialDragRadians = initialDragRadians;
        this.initialHandleRadians = this.handle.rotation;
        this.currentStepRadians = this.handle.rotation;
        this.currentSteps = 0;
        this.currentDirection = Rotation.STILL;
    }

    setRotation(currentAngleInRadians: number) {
        let radians: number = this.initialHandleRadians + (currentAngleInRadians - this.initialDragRadians);

        // Adjust the negative radians so we can count the rounded 60 degree steps properly
        if (radians < 0) {
            radians += 2 * Math.PI;
        }

        this.handle.rotation = radians;
        this.handleShadow.rotation = radians;

        // Do count rounded 60 degree steps in both directions
        const initialAngle = this.radiansToDegrees(this.currentStepRadians);
        const currentAngle = this.radiansToDegrees(radians);

        let angleDifference = currentAngle - initialAngle;

        // Adjusting the zero degree boundary (important)
        if (angleDifference > 180) {
            angleDifference -= 360;
        } else if (angleDifference < -180) {
            angleDifference += 360;
        }

        // Accumulate CW/CCW steps
        if (Math.abs(angleDifference) >= 60) {
            if (angleDifference > 0) {
                if (this.currentDirection == Rotation.STILL) {
                    this.currentDirection = Rotation.CW;
                } else if (this.currentDirection == Rotation.CCW) {
                    this.revertHandle(Rotation.CW);
                }
                this.currentSteps += Math.floor(angleDifference / 60);
            } else {
                if (this.currentDirection == Rotation.STILL) {
                    this.currentDirection = Rotation.CCW;
                } else if (this.currentDirection == Rotation.CW) {
                    this.revertHandle(Rotation.CCW);
                }
                this.currentSteps -= Math.floor(Math.abs(angleDifference) / 60);
            }
            this.currentStepRadians = radians;

            console.log(this.currentSteps);
        }
    }

    /**
    * Emits the current steps and rotation direction when the handle gets rotated in the
    * opposite direction, which is treated as an instruction to end the current secret code entry.
    * 
    * @param {Rotation} rotation - The new rotation direction to set after reverting.
    */
    revertHandle(rotation: Rotation) {
        this.emit('sendSteps', {direction: this.currentDirection, steps: this.currentSteps});
        this.currentDirection = rotation;
        this.currentSteps = 0;
    }

    /**
    * Ends the rotation by animating the handle to the nearest target angle.
    * @returns {Promise<void>} A promise that resolves when the animation is complete.
    */
    async endRotation(): Promise<void> {
        await this.animateRotation(this.getNearestTargetAngle(this.radiansToDegrees(this.handle.rotation)), 0.25);
    }

    /**
    * Calculates the nearest target angle that is a multiple of 60 degrees.
    * @param {number} currentDegrees - The current angle in degrees.
    * @returns {number} The nearest target angle in degrees.
    */
    getNearestTargetAngle(currentDegrees: number): number {
        const nearestRoundedMultiple = Math.round(currentDegrees / 60) * 60;
        return nearestRoundedMultiple;
    }

    degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    radiansToDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }
}
