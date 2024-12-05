import { Container, Sprite } from "pixi.js";
import { gsap } from "gsap";

import { Scene } from "./Scene";
import { AssetManager } from "./AssetManager";
import { Handle } from "./Handle";

export class VaultScene extends Scene {
    
    label: string = "VaultScene";

    assetManager!: AssetManager;

    bgr!: Sprite;
    door!: Sprite;
    doorOpen!: Sprite;
    doorOpenShadow!: Sprite;
    handle!: Handle;
    handleShadow!: Sprite;

    blinksContainer!: Container;
    blink!: Sprite;
    blink2!: Sprite;

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

        this.doorOpenShadow = new Sprite(this.assetManager.getTexture("doorOpenShadow"));
        this.doorOpenShadow.anchor.set(0.5);
        this.addChild(this.doorOpenShadow);
        this.doorOpenShadow.visible = false;

        this.doorOpen = new Sprite(this.assetManager.getTexture("doorOpen"));
        this.doorOpen.anchor.set(0.5);
        this.addChild(this.doorOpen);
        this.doorOpen.visible = false;

        this.blinksContainer = new Container();
        this.addChild(this.blinksContainer);

        this.blink = new Sprite(this.assetManager.getTexture("blink"));
        this.blink.anchor.set(0.5);
        this.blinksContainer.addChild(this.blink);
        this.blink.visible = false;

        this.blink2 = new Sprite(this.assetManager.getTexture("blink"));
        this.blink2.anchor.set(0.5);
        this.blinksContainer.addChild(this.blink2);
        this.blink2.visible = false;

        this.positionElements();

        this.openVault();
    }

    async openVault() {
        // Cheap open animation, still better than nothing..
        gsap.to(this.handle, {
            x: this.handle.x + 110,
            width: this.handle.width-40,
            duration: 1,
            ease: "power4.in"
        });
        gsap.to(this.handle.handleShadow, {
            x: this.handle.handleShadow.x - 40,
            y: this.handle.handleShadow.y + 80,
            width: this.handle.handleShadow.width + 80,
            height: this.handle.handleShadow.height + 120,
            duration: 1,
            ease: "power4.in"
        });
        await gsap.to(this.door, {
            x: this.door.x + 80,
            width:this.door.width-160,
            duration: 1,
            ease: "power4.in"
        });

        this.door.visible = false;
        this.handle.visible = false;
        this.doorOpen.visible = true;

        // use flipped opened door to immitate one additional frame
        const doorX = this.doorOpen.x;
        this.doorOpen.scale.x *= -0.5;
        this.doorOpen.x -= this.doorOpen.width;
        
        await this.handle.delay(0.05);
        
        this.doorOpen.scale.x *= -2;
        this.doorOpen.x = doorX;
        this.doorOpenShadow.visible = true;

        await this.animateBlinks();

        this.emit("restartGame");
    }

    async animateBlinks() {
        this.blink.visible = true;
        this.blink.alpha = 0;

        await gsap.to(this.blink, {alpha: 1, rotation: 4, duration: 1.5, ease: "power1.in"});

        this.blink2.visible = true;
        this.blink2.alpha = 0;
        this.blink2.x += 80;
        this.blink2.y += 160;
        gsap.to(this.blink2, {alpha: 1, rotation: 1, duration: 1.5, ease: "power2.in"});

        await gsap.to(this.blink, {alpha: 0, rotation: 6, duration: 1.5, ease: "power1.out"});

        gsap.to(this.blink2, {alpha: 0, rotation: 2, duration: 2, ease: "power1s.out"});

        this.blink.x -= 160;
        this.blink.y -= 40;
        
        await gsap.to(this.blink, {alpha: 1, x: this.blink.x - 40, y: this.blink.y + 80, duration: 1, ease: "power2.in"});
        await gsap.to(this.blink, {alpha: 0, x: this.blink.x - 20, y: this.blink.y + 40, duration: 1, ease: "power2.out"});

        this.doorOpen.scale.x *= -0.5;
        this.doorOpen.x -= this.doorOpen.width;
        
        await this.handle.delay(0.05);
    }

    positionElements() {
        this.centerElement(this.bgr);
        this.resizeElement(this.bgr.scale, this.door, 30, -22);
        this.resizeElement(this.bgr.scale, this.handle, -18, -24);
        this.resizeElement(this.bgr.scale, this.doorOpen, 735, -18);
        this.resizeElement(this.bgr.scale, this.doorOpenShadow, 775, 10);
        this.resizeElement(this.bgr.scale, this.blinksContainer, -25, -10);
    }
}
