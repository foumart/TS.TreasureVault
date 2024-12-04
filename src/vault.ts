export enum Rotation {
    CW = 'clockwise',
    CCW = 'counterclockwise'
}

type Steps = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const comboLength = 3;

export let secretCombo: [Steps, Rotation][];

/**
* Generates a secret combination code consisting of a series of steps and rotations.
*/
export function generateCode() {
    secretCombo = [];
    let lastRotation: Rotation | null = null;

    for (let i = 0; i < comboLength; i++) {
        const number = getRandomNumber();
        const rotation = getRandomRotation(lastRotation);
        secretCombo.push([number, rotation]);
        lastRotation = rotation;
    }

    console.log(formatSecretCombo(secretCombo));
}

function getRandomNumber(): Steps {
    return (Math.floor(Math.random() * 9) + 1) as Steps;
}

/**
* Generates a random rotation direction, ensuring it is different from the optional {exclude} param.
* @param {Rotation | null} exclude - The previous rotation direction to avoid.
* @returns {Rotation} A random rotation direction, either 'clockwise' or 'counterclockwise'.
*/
function getRandomRotation(exclude: Rotation | null): Rotation {
    if (exclude) {
        return exclude == Rotation.CCW ? Rotation.CW : Rotation.CCW;
    }

    return Math.random() < .5 ? Rotation.CW : Rotation.CCW;
}

/**
* Formats the secret combination array into a readable string.
* @param {[number, Rotation]} combo - The array of number and rotation pairs.
* @returns {string} A formatted string representing the secret combination.
*/
function formatSecretCombo(combo: [number, Rotation][]): string {
    return combo.map(([number, rotation]) => `${number} ${rotation}`).join(', ');
}