export enum Rotation {
    CW = 'clockwise',
    CCW = 'counterclockwise'
}

type Steps = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;


export class CodeGenerator {
    comboLength: number;
    secretCombo: [Steps, Rotation][] = [];
    lastRotation: Rotation | null = null;

    constructor(comboLength: number = 3) {
        this.comboLength = comboLength;
    }
    
    /**
    * Generates a secret combination code consisting of a series of steps and rotations.
    */
    generateCode() {
        this.secretCombo = [];
        this.lastRotation = null;
        
        for (let i = 0; i < this.comboLength; i++) {
            const number = this.getRandomNumber();
            const rotation = this.getRandomRotation(this.lastRotation);
            this.secretCombo.push([number, rotation]);
            this.lastRotation = rotation;
        }
        
        console.log(this.formatSecretCombo(this.secretCombo));
    }
    
    getRandomNumber(): Steps {
        return (Math.floor(Math.random() * 9) + 1) as Steps;
    }
    
    /**
    * Generates a random rotation direction, ensuring it is different from the optional {exclude} param.
    * @param {Rotation | null} exclude - The previous rotation direction to avoid.
    * @returns {Rotation} A random rotation direction, either 'clockwise' or 'counterclockwise'.
    */
    getRandomRotation(exclude: Rotation | null): Rotation {
        if (exclude) {
            return exclude == Rotation.CCW ? Rotation.CW : Rotation.CCW;
        }
    
        return Math.random() < 0.5 ? Rotation.CW : Rotation.CCW;
    }
    
    /**
    * Formats the secret combination array into a readable string.
    * @param {[number, Rotation]} combo - The array of number and rotation pairs.
    * @returns {string} A formatted string representing the secret combination.
    */
    formatSecretCombo(combo: [number, Rotation][]): string {
        return combo.map(([number, rotation]) => `${number} ${rotation}`).join(', ');
    }
    
    /**
    * Returns the generated secret combination.
    * @returns {[Steps, Rotation][]} The secret combination array.
    */
    getSecretCombo(): [Steps, Rotation][] {
        return this.secretCombo;
    }
}