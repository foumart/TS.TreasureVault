import { Text, TextStyle } from "pixi.js";
import { Scene } from "./Scene";

export class LoadingScene extends Scene {
    
    label: string = "LoadingScene";

    noteText!: Text;
    playText!: Text;

    noteStyle!: TextStyle;
    textStyle!: TextStyle;
    textColor!: string;
    textHoverColor!: string;

    init() {
        this.textColor = "#285861";
        this.textHoverColor = "#29717f";
        this.noteStyle = new TextStyle({
            fill: this.textColor,
        });
        this.textStyle = new TextStyle({
            fill: this.textColor,
        });

        this.noteText = new Text({
            text: "Loading Treasure Vault...",
            style: this.noteStyle
        });
    
        this.noteText.resolution = 2;
    
        this.addChild(this.noteText);

        this.positionElements();
    }

    async waitForInteraction() {
        this.removeChildren();

        this.noteText = new Text({
            text: "Please note: game has sound.",
            style: this.noteStyle
        });
    
        this.noteText.resolution = 2;
    
        this.addChild(this.noteText);

        this.textStyle.fontSize = 42;
        this.textStyle.fontWeight = 'bold';

        this.playText = new Text({
            text: "Start Game",
            style: this.textStyle
        });

        this.playText.interactive = true;
        this.playText.cursor = "pointer";
    
        this.playText.resolution = 2;
    
        this.addChild(this.playText);

        this.positionElements();

        this.playText.on("pointerenter", (event) => {
            this.textStyle.fill = this.textHoverColor;
        });
        this.playText.on("pointerleave", (event) => {
            this.textStyle.fill = this.textColor;
        });

        return new Promise<void>((resolve) => {
            this.playText.on("pointerdown", (event) => resolve());
        });
    }

    positionElements() {
        if (this.playText) {
            this.playText.x = this.screenWidth / 2 - this.playText.width / 2;
            this.playText.y = this.screenHeight / 2 - this.playText.height;
        }
        this.noteText.x = this.screenWidth / 2 - this.noteText.width / 2;
        this.noteText.y = this.screenHeight - this.noteText.height * 1.5;
    }
}
