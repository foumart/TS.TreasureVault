import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { getTexture } from "./assetLoader";

import { gsap } from "gsap";

class Handle extends Container {

    handle: Sprite;
    handleShadow: Sprite;
    staticHandle: Sprite;
    staticHandleMask: Graphics;

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
        .circle(0, 0, 125)
        .fill({color:0xFFFFFF})
        .circle(0, 0, 98)
        .cut()
        .circle(0, 0, 38)
        .fill({color:0xFFFFFF})

        this.addChild(this.staticHandleMask);
        this.staticHandle.mask = this.staticHandleMask;

        gsap.to(this.handle, {rotation: this.degreesToRadians(360), duration: 2});
        gsap.to(this.handleShadow, {rotation: this.degreesToRadians(360), duration: 2});
    }

    degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}

export default Handle;