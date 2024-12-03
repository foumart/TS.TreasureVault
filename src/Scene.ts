import { Container } from "pixi.js";

export abstract class Scene extends Container {
    abstract label: string;

    constructor() {
        super();
    }
}

export default Scene;