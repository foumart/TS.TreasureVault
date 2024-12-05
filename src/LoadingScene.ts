import { Text, TextStyle } from "pixi.js";
import { Scene } from "./Scene";

export class LoadingScene extends Scene {
    
    label: string = "LoadingScene";

    init() {
        const style = new TextStyle({
            fontFamily: "Verdana",
            fontSize: 16,
            fill: "#285861",
        });
            
        const text = new Text({
            text: "Loading Treasure Vault...",
            style: style
        });
    
        text.resolution = 2;
    
        this.addChild(text);
    }
}
