import { Container } from "pixi.js";

export abstract class Scene extends Container {

    abstract label: string;

    constructor() {
        super();
    }

    abstract init(): void
}

export default Scene;