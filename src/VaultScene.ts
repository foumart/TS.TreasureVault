import { Container, Sprite } from "pixi.js";
import { gsap } from "gsap";

import { Scene } from "./Scene";
import { AssetManager } from "./AssetManager";
import { Handle } from "./Handle";

export class VaultScene extends Scene {
    
    label: string = "VaultScene";

    assetManager!: AssetManager;

    bgr!: Sprite;
    doorContainer!: Container;
    door!: Sprite;
    doorOpen!: Sprite;
    doorOpenShadow!: Sprite;
    handle!: Handle;
    handleShadow!: Sprite;

    blinksContainer!: Container;
    blink!: Sprite;
    blink2!: Sprite;
    blink3!: Sprite;

    init() {
        this.bgr = new Sprite(this.assetManager.getTexture("bg"));
        this.bgr.anchor.set(0.5);
        this.bgr.interactive = true;
        this.addChild(this.bgr);

        this.doorContainer = new Container();
        this.addChild(this.doorContainer);

        this.door = new Sprite(this.assetManager.getTexture("door"));
        this.door.anchor.set(0.5);
        this.doorContainer.addChild(this.door);

        this.doorOpenShadow = new Sprite(this.assetManager.getTexture("doorOpenShadow"));
        this.doorOpenShadow.anchor.set(0.5);
        this.doorContainer.addChild(this.doorOpenShadow);
        this.doorOpenShadow.visible = false;
        this.doorOpenShadow.position.set(745, 32);

        this.doorOpen = new Sprite(this.assetManager.getTexture("doorOpen"));
        this.doorOpen.anchor.set(0.5);
        this.doorContainer.addChild(this.doorOpen);
        this.doorOpen.visible = false;
        this.doorOpen.position.set(705, 4);

        this.handle = new Handle();
        this.doorContainer.addChild(this.handle);
        this.handle.interactive = true;
        this.handle.cursor = 'pointer';
        this.handle.position.set(-48, -2);

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

        this.blink3 = new Sprite(this.assetManager.getTexture("blink"));
        this.blink3.anchor.set(0.5);
        this.blinksContainer.addChild(this.blink3);
        this.blink3.visible = false;

        this.positionElements();

        this.openVault();
    }

    async openVault() {
        // Cheap open animation, still better than nothing..
        gsap.to(this.handle, {
            x: this.handle.x + 125,
            width: this.handle.width-30,
            duration: 1,
            ease: "power4.in"
        });
        gsap.to(this.handle.handleShadow, {
            x: this.handle.handleShadow.x - 10,
            y: this.handle.handleShadow.y + 80,
            width: this.handle.handleShadow.width + 100,
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
        this.doorOpen.visible = true;
        this.doorOpenShadow.visible = true;
        this.doorOpenShadow.alpha = 0.5;

        // immitate additional frames
        this.handle.width = 180;
        this.handle.x = 360;
        this.handle.handleShadow.alpha = 0.9;
        this.doorOpenShadow.scale.set(-0.6, 0.94);
        this.doorOpenShadow.x = 300;
        this.doorOpenShadow.alpha = 0.5;
        this.doorOpen.scale.x = -1;
        this.doorOpen.x = 190;
        
        await this.handle.delay(0.05);

        this.handle.width = 150;
        this.handle.x = 410;
        this.handle.handleShadow.alpha = 0.75;
        this.doorOpenShadow.scale.set(-0.55, 0.95);
        this.doorOpenShadow.x = 320;
        this.doorOpenShadow.alpha = 0.5;
        this.doorOpen.scale.x = -0.8;
        this.doorOpen.x = 250;
        
        await this.handle.delay(0.05);

        this.handle.width = 90;
        this.handle.x = 440;
        this.handle.handleShadow.alpha = 0.5;
        this.doorOpenShadow.scale.set(-0.45, 0.95);
        this.doorOpenShadow.x = 355;
        this.doorOpenShadow.alpha = 0.6;
        this.doorOpen.scale.x = -0.5;
        this.doorOpen.x = 340;
        
        await this.handle.delay(0.05);

        this.handle.width = 40;
        this.handle.x = 460;
        this.handle.handleShadow.visible = false;
        this.doorOpenShadow.scale.set(0.4, 0.96);
        this.doorOpenShadow.x = 520;
        this.doorOpenShadow.alpha = 0.7;
        this.doorOpen.scale.x = -0.3;
        this.doorOpen.x = 400;
        
        await this.handle.delay(0.05);

        this.handle.visible = false;
        this.doorOpenShadow.scale.set(0.6, 0.97);
        this.doorOpenShadow.x = 620;
        this.doorOpenShadow.alpha = 0.8;
        this.doorOpen.scale.x = 0.3;
        this.doorOpen.x = 500;
        
        await this.handle.delay(0.05);

        this.doorOpenShadow.scale.set(0.8, 0.98);
        this.doorOpenShadow.x = 680;
        this.doorOpenShadow.alpha = 0.8;
        this.doorOpen.scale.x = 0.5;
        this.doorOpen.x = 560;
        
        await this.handle.delay(0.05);

        gsap.to(this.doorOpenShadow.scale, {x: 1,y: 1,  duration: 0.5, ease: "power4.out"});
        gsap.to(this.doorOpenShadow, {x: 745, alpha: 1, duration: 0.5, ease: "power4.out"});
        gsap.to(this.doorOpen.scale, {x: 1, duration: 0.5, ease: "power4.out"});
        gsap.to(this.doorOpen, {x: 705, duration: 0.5, ease: "power4.out"});

        await this.animateBlinks();

        this.emit("restartGame");
    }

    async animateBlinks() {
        this.blink.visible = true;
        this.blink.alpha = 0;
        this.blink2.visible = true;
        this.blink2.alpha = 0;
        this.blink3.visible = true;
        this.blink3.alpha = 0;

        this.blink2.x += 80;
        this.blink2.y += 160;
        gsap.to(this.blink2, {alpha: 1, rotation: 2, duration: 2, ease: "power1.in"});

        await gsap.to(this.blink, {alpha: 1, rotation: 4, duration: 1.5, ease: "power1.in"});

        gsap.to(this.blink, {alpha: 0, rotation: 6, duration: 2, ease: "power2.out"});

        await this.handle.delay(0.5);

        gsap.to(this.blink2, {alpha: 0, rotation: 4, duration: 3, ease: "power2.out"});

        this.blink3.x -= 160;
        this.blink3.y -= 40;
        await gsap.to(this.blink3, {alpha: 1, x: this.blink3.x - 40, y: this.blink3.y + 80, duration: 1.5, ease: "power2.in"});
        await gsap.to(this.blink3, {alpha: 0, x: this.blink3.x - 20, y: this.blink3.y + 40, duration: 1.5, ease: "power2.out"});

        this.doorOpen.scale.x *= -0.5;
        this.doorOpen.x -= this.doorOpen.width;
        
        await this.handle.delay(0.05);
    }

    positionElements() {
        this.centerElement(this.bgr);
        this.resizeElement(this.bgr.scale, this.doorContainer, 30, -22);
        this.resizeElement(this.bgr.scale, this.blinksContainer, -25, -10);
    }
}
