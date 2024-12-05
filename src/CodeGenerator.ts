export enum Rotation {
    CW = 'clockwise',
    CCW = 'counterclockwise',
    STILL = 'still' // instead of relying on undefined | null union types
}

export type Steps = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type SecretCombo = [Rotation, Steps];


export class CodeGenerator {
    private comboLength: number;
    private secretCombo!: Array<SecretCombo>;
    public currentCombo!: Array<SecretCombo>; // player secret codes entries so far
    private lastRotation: Rotation = Rotation.STILL;

    constructor(comboLength: number = 3) {
        this.comboLength = comboLength;
    }
    
    /**
    * Generates a secret combination code consisting of a series of steps and rotations.
    */
    public generateCode() {
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
    
    private getRandomNumber(): Steps {
        return (Math.floor(Math.random() * 9) + 1) as Steps;
    }
    
    /**
    * Generates a random rotation direction, ensuring it is different from the optional "exclude" param.
    * 
    * @param {Rotation} exclude - The previous rotation direction to avoid.
    * @returns {Rotation} A random rotation direction, either 'clockwise' or 'counterclockwise'.
    */
    private getRandomRotation(exclude: Rotation): Rotation {
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
    private formatSecretCombo(combo: SecretCombo[]): string {
        return combo.map(([rotation, number]) => `${number} ${rotation}`).join(', ');
    }

    /**
    * Checks if two secret combos are matching.
    *
    * @param {SecretCombo} userCombo - The user's combination consisting of rotation and steps.
    * @param {SecretCombo} secretCombo - The secret combination consisting of rotation and steps.
    * @returns {boolean} True if the user's combination matches the secret combination, false otherwise.
    */
    private checkComboMatching(userCombo: SecretCombo, secretCombo: SecretCombo): boolean {
        const [userRotation, userSteps] = userCombo;
        const [secretRotation, secretSteps] = secretCombo;

        return userRotation === secretRotation && userSteps === secretSteps;
    }

    /**
    * Checks if the user-entered combo matches the secret combo.
    * 
    * @returns {boolean} True if the combos match, false otherwise.
    */
    public isSecretComboMatching(): boolean {
        if (this.currentCombo.length !== this.comboLength) {
            return false;
        }

        let matchingSoFar = true;
        for (let i = 0; i < this.currentCombo.length; i++) {
            if (!this.checkComboMatching(this.currentCombo[i], this.secretCombo[i])) {
                matchingSoFar = false;
            }
        }

        return matchingSoFar;
    }

    // Note: the following methods expose the secret code length, I wanted to
    // have it hidden as well, but it does not work well with the current gameplay.
    public areComboEntriesExceeding(): boolean {
        return this.currentCombo.length >= this.comboLength;
    }

    public areComboEntriesEnough(): boolean {
        return this.currentCombo.length == this.comboLength - 1;
    }

}