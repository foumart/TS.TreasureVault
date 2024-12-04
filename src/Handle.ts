import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { getTexture } from "./assetLoader";

import { gsap } from "gsap";

class Handle extends Container {

    handle: Sprite;
    handleShadow: Sprite;
    staticHandle: Sprite;
    staticHandleMask: Graphics;

    initialAngle: number = 0;
    startRotation: number = 0;

    constructor() {
        super();

        this.handleShadow = new Sprite(getTexture("handleShadow"));
        this.handleShadow.anchor.set(0.5);
        this.addChild(this.handleShadow);
        this.handleShadow.position.x = 10;
        this.handleShadow.position.y = 15;

        this.handle = new Sprite(getTexture("handle"));
        this.handle.anchor.set(0.5);
        this.addChild(this.handle);

        // Add some masked static part to preserve the point of light for added realism
        this.staticHandle = new Sprite(getTexture("handle"));
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

    spinLikeCrazy() {
        this.animateRotation(720, 1.5);
    }

    animateRotation(degrees?: number, duration?: number) {
        gsap.to([this.handle, this.handleShadow], {
            rotation: this.degreesToRadians(degrees || 360),
            duration: duration || 1
        });
    }

    setStartRotation(initialAngle: number) {
        this.initialAngle = initialAngle;
        this.startRotation = this.handle.rotation;
    }

    rotate(currentAngle: number) {
        const radians: number = this.startRotation + (currentAngle - this.initialAngle);
        this.handle.rotation = radians;
        this.handleShadow.rotation = radians;
    }

    endRotation() {
        this.animateRotation(this.getNearestTargetAngle(this.radiansToDegrees(this.handle.rotation)), 0.25);
    }

    getNearestTargetAngle(currentDegrees: number): number {
        return Math.round(currentDegrees / 60) * 60;
    }

    degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    radiansToDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }
}

export default Handle;