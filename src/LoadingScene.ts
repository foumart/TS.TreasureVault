import { Text, TextStyle } from "pixi.js";

import Scene from "./scene";

class LoadingScene extends Scene {
    
    label: string = "LoadingScene";

    constructor() {
        super();
        this.init();
    }

    init() {
        const style = new TextStyle({
            fontFamily: "Verdana",
            fontSize: 20,
            fill: "white",
        });
            
        const text = new Text({
            text: "Loading...",
            style: style
        });
    
        text.resolution = 2;
    
        this.addChild(text);
    }
}

export default LoadingScene;