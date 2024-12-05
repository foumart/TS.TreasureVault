export enum Rotation {
    CW = 'clockwise',
    CCW = 'counterclockwise',
    STILL = 'still' // instead of relying on undefined | null union types
}

export type Steps = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type SecretCombo = [Rotation, Steps];


export class CodeGenerator {
    comboLength: number;
    secretCombo!: Array<SecretCombo>;
    currentCombo!: Array<SecretCombo>; // player entried secret codes so far
    lastRotation: Rotation = Rotation.STILL;

    constructor(comboLength: number = 3) {
        this.comboLength = comboLength;
    }
    
    /**
    * Generates a secret combination code consisting of a series of steps and rotations.
    */
    generateCode() {
        this.secretCombo = [];
        this.currentCombo = [];
        this.lastRotation = Rotation.STILL;
        
        for (let i = 0; i < this.comboLength; i++) {
            const number = this.getRandomNumber();
            const rotation = this.getRandomRotation(this.lastRotation);
            this.secretCombo.push([rotation, number]);
            this.lastRotation = rotation;
        }
        
        console.log(this.formatSecretCombo(this.secretCombo));
    }
    
    getRandomNumber(): Steps {
        return (Math.floor(Math.random() * 9) + 1) as Steps;
    }
    
    /**
    * Generates a random rotation direction, ensuring it is different from the optional "exclude" param.
    * 
    * @param {Rotation} exclude - The previous rotation direction to avoid.
    * @returns {Rotation} A random rotation direction, either 'clockwise' or 'counterclockwise'.
    */
    getRandomRotation(exclude: Rotation): Rotation {
        if (exclude != Rotation.STILL) {
            return exclude == Rotation.CCW ? Rotation.CW : Rotation.CCW;
        }
    
        return Math.random() < 0.5 ? Rotation.CW : Rotation.CCW;
    }
    
    /**
    * Formats the secret combination array into a readable string.
    * 
    * @param {SecretCombo} combo - The array of rotation and number pairs.
    * @returns {string} A formatted string representing the secret combination.
    */
    formatSecretCombo(combo: SecretCombo[]): string {
        return combo.map(([rotation, number]) => `${number} ${rotation}`).join(', ');
    }
    
    /**
    * Returns the generated secret combination.
    * 
    * @returns {SecretCombo[]} The secret combination array.
    */
    getSecretCombo(): SecretCombo[] {
        return this.secretCombo;
    }
}