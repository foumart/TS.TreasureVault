import { Text, TextStyle } from "pixi.js";

import Scene from "./Scene";

class LoadingScene extends Scene {
    
    label: string = "LoadingScene";

    constructor() {
        super();
        this.init();
    }

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

export default LoadingScene;